// Every imported effect belongs to one React mount. No global API is patched.
export function createScope() {
  let active = true;
  const abort = new AbortController();
  const frames = new Set();
  const timeouts = new Set();
  const intervals = new Set();
  const disposers = [];
  const defer = (dispose) => {
    if (active) disposers.push(dispose);
    else dispose();
  };
  const wrapObserver = (Observer) => class extends Observer {
    constructor(callback, options) {
      super((...args) => { if (active) callback(...args); }, options);
      defer(() => this.disconnect());
    }
  };
  return {
    get active() { return active; },
    defer,
    listen(target, event, listener, options = {}) {
      if (!active) return;
      target.addEventListener(event, listener, {
        ...(typeof options === 'boolean' ? { capture: options } : options),
        signal: abort.signal,
      });
    },
    requestAnimationFrame(callback) {
      if (!active) return 0;
      const id = window.requestAnimationFrame((time) => {
        frames.delete(id);
        if (active) callback(time);
      });
      frames.add(id);
      return id;
    },
    cancelAnimationFrame(id) { window.cancelAnimationFrame(id); frames.delete(id); },
    setTimeout(callback, delay, ...args) {
      if (!active) return 0;
      const id = window.setTimeout(() => {
        timeouts.delete(id);
        if (active) callback(...args);
      }, delay);
      timeouts.add(id);
      return id;
    },
    clearTimeout(id) { window.clearTimeout(id); timeouts.delete(id); },
    setInterval(callback, delay, ...args) {
      if (!active) return 0;
      const id = window.setInterval(() => { if (active) callback(...args); }, delay);
      intervals.add(id);
      return id;
    },
    clearInterval(id) { window.clearInterval(id); intervals.delete(id); },
    IntersectionObserver: wrapObserver(window.IntersectionObserver),
    MutationObserver: wrapObserver(window.MutationObserver),
    ResizeObserver: wrapObserver(window.ResizeObserver),
    dispose() {
      if (!active) return;
      active = false;
      abort.abort();
      frames.forEach((id) => window.cancelAnimationFrame(id));
      timeouts.forEach((id) => window.clearTimeout(id));
      intervals.forEach((id) => window.clearInterval(id));
      for (const dispose of disposers.reverse()) {
        try { dispose(); } catch (error) { console.warn('Effect cleanup failed', error); }
      }
      frames.clear(); timeouts.clear(); intervals.clear(); disposers.length = 0;
    },
  };
}

export function disposeScene(scene, renderer) {
  const resources = new Set();
  scene.traverse((object) => {
    if (object.geometry) resources.add(object.geometry);
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      if (!material) continue;
      resources.add(material);
      for (const value of Object.values(material)) {
        if (value?.isTexture) resources.add(value);
      }
    }
  });
  resources.forEach((resource) => resource.dispose());
  renderer?.dispose();
  renderer?.forceContextLoss();
}
