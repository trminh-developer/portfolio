const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require(path.join(process.env.APPDATA, 'npm/node_modules/n8n/node_modules/playwright'))); }

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5173';
const output = path.resolve('.qa');
fs.mkdirSync(output, { recursive: true });
const errors = [], missing = [], checks = [];
const routes = ['/', '/experience', '/skills', '/projects', '/services', '/contact'];
const navigation = ['/', '/#about', '/experience', '/skills', '/projects', '/services', '/contact'];
const expectedContent = {
  '/experience': ['.timeline-item', 2], '/skills': ['.skill-bar-item', 7],
  '/projects': ['.project-card', 4], '/services': ['.project-card', 2], '/contact': ['.contact-item', 7],
};
const titles = { '/experience': 'WORK EXPERIENCE', '/skills': 'SKILLS & EXPERTISE', '/projects': 'FEATURED PROJECTS', '/services': 'SERVICES', '/contact': 'CONTACT' };
const record = (name) => { checks.push(name); console.log('PASS ' + name); };
const dismissIntro = async (page) => {
  await page.locator('#introSkip').click({ timeout: 1500 }).catch(() => {});
  await page.locator('#loader').waitFor({ state: 'detached', timeout: 15000 });
};
const go = async (page, route, width) => {
  if (width <= 900 && !(await page.locator('#menuToggle').getAttribute('aria-expanded') === 'true')) {
    await page.locator('#menuToggle').click();
  }
  await page.locator('.site-nav .nav-link[href="' + route + '"]').click();
  await page.waitForURL(base + route);
  if (width <= 900) assert.equal(await page.locator('#menuToggle').getAttribute('aria-expanded'), 'false');
  if (route === '/' || route === '/#about') {
    await dismissIntro(page);
    await page.waitForSelector('#cardContainer.three-ready', { timeout: 20000 });
  } else await page.locator('#page-content').getByRole('heading', { level: 1, name: titles[route], exact: true }).waitFor();
};

(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.BROWSER_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--enable-webgl', '--ignore-gpu-blocklist', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
  });
  let page;
  let emailStatus = 500, emailRequests = 0;
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
    // All nonlocal traffic is blocked or mocked. No real email or cloud write occurs.
    await context.route('**/*', (route) => {
      const url = route.request().url();
      if (url.includes('api.emailjs.com/')) {
        emailRequests++;
        return route.fulfill({ status: emailStatus, contentType: 'text/plain', body: emailStatus === 200 ? 'OK' : 'QA simulated failure' });
      }
      if (url.startsWith(base) || url.startsWith('data:') || url.startsWith('blob:')) return route.continue();
      return route.abort();
    });
    page = await context.newPage();
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => { if (response.status() === 404) missing.push(response.url()); });
    await page.goto(base, { waitUntil: 'networkidle' });
    await dismissIntro(page);
    await page.waitForSelector('#cardContainer.three-ready');
    await page.evaluate(() => {
      window.qaShell = {
        header: document.querySelector('.site-header'),
        footer: document.querySelector('.site-footer'),
        stars: document.getElementById('starfield'),
      };
    });
    await page.locator('#soundToggle').click();
    assert.equal(await page.locator('#soundToggle').getAttribute('aria-pressed'), 'true');

    if (!process.argv.includes('--effects')) {
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 960 });
      for (const route of routes) {
        await go(page, route, width);
        assert.equal(await page.locator('.site-header').count(), 1);
        assert.equal(await page.locator('.site-footer').count(), 1);
        assert.equal(await page.locator('#starfield').count(), 1);
        assert.doesNotMatch(await page.locator('.site-nav').innerText(), /trminh/i);
        assert.deepEqual(await page.locator('.site-nav .nav-link').evaluateAll((links) => links.map((el) => el.getAttribute('href'))), navigation);
        assert.equal(await page.locator('#soundToggle').getAttribute('aria-pressed'), 'true');
        assert.equal(await page.evaluate(() =>
          window.qaShell.header === document.querySelector('.site-header') &&
          window.qaShell.footer === document.querySelector('.site-footer') &&
          window.qaShell.stars === document.getElementById('starfield')), true);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
        const header = await page.locator('.site-header').boundingBox();
        assert.ok(header.x >= 0 && header.x + header.width <= width + 1);
        if (route !== '/') {
          const [selector, count] = expectedContent[route];
          assert.equal(await page.locator('#page-content ' + selector).count(), count);
          const title = await page.locator('#page-content .section-header h1').boundingBox();
          assert.ok(title.y >= header.y + header.height, 'Header must not cover page title');
          const overflow = await page.locator('#page-content').evaluate((main) =>
            [...main.querySelectorAll('.sub-card, .project-card, input, textarea, .job-badge, .skill-tag')]
              .filter((el) => el.getBoundingClientRect().right > innerWidth + 1).map((el) => el.className));
          assert.deepEqual(overflow, [], 'Content must fit the viewport');
        } else {
          assert.equal(await page.locator('.lanyard-hit-zone').count(), 1);
          assert.equal(await page.locator('#about').count(), 1);
          assert.equal(await page.locator('#contactMailForm').count(), 1);
          assert.equal(await page.locator('#fallbackPortrait').getAttribute('src'), '/171367.jpg');
          assert.equal(await page.locator('.about-person-base').getAttribute('src'), '/Vest.png');
          assert.equal(await page.locator('.about-person-suit').getAttribute('src'), '/template/21ce0f6adb12.png');
        }
        if (!process.argv.includes('--no-screenshots') && (width === 1440 || width === 320)) {
          await page.screenshot({ path: path.join(output, 'unified-' + width + '-' + (route.slice(1) || 'home') + '.png'), fullPage: true });
        }
      }
      record('All six pages retain content and the same shell at ' + width + 'px');
    }
    const files = fs.readdirSync(path.resolve('src/pages')).filter((name) => name.endsWith('.tsx')).sort();
    assert.deepEqual(files, ['Contact.tsx', 'Experience.tsx', 'Home.tsx', 'Projects.tsx', 'Services.tsx', 'Skills.tsx']);
    record('All six original page files and routes remain present');

    await page.locator('#menuToggle').click();
    assert.equal(await page.locator('.navigation-links').isVisible(), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.navigation-links').isVisible(), false);
    assert.equal(await page.locator('#menuToggle').evaluate((el) => document.activeElement === el), true);
    record('Mobile navigation closes with Escape and restores keyboard focus');

    await page.getByLabel('Your name', { exact: true }).fill('Browser QA');
    await page.getByLabel('Email', { exact: true }).fill('qa@example.com');
    await page.getByLabel('Subject', { exact: true }).fill('Simulated validation');
    await page.getByLabel('Message', { exact: true }).fill('Mocked request only. No real message is sent.');
    await page.getByRole('button', { name: 'Send message', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'Failed to send message' }).waitFor();
    emailStatus = 200;
    await page.getByRole('button', { name: 'Send message', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'Message sent successfully' }).waitFor();
    assert.equal(await page.getByLabel('Message', { exact: true }).inputValue(), '');
    assert.equal(emailRequests, 2);
    record('Contact page form handles simulated failure and successful retry');

    await go(page, '/#about', 320);
    assert.equal(await page.locator('#about-title').isVisible(), true);
    const stage = page.locator('#about-person-stage');
    await stage.focus();
    await page.keyboard.press('Enter');
    assert.equal(await stage.evaluate((el) => el.classList.contains('is-revealing')), true);
    await page.screenshot({ path: path.join(output, 'spiderman-reveal-mobile.png') });
    await page.keyboard.press('Enter');
    record('About remains reachable from other pages and preserves portrait interaction');

    await page.setViewportSize({ width: 1440, height: 960 });
    await go(page, '/', 1440);
    const card = page.locator('#lanyardCanvas');
    await card.focus();
    await page.keyboard.press('Enter');
    assert.equal(await card.getAttribute('aria-pressed'), 'true');
    await page.keyboard.press('Space');
    assert.equal(await card.getAttribute('aria-pressed'), 'false');
    const hit = await page.locator('.lanyard-hit-zone').boundingBox();
    await page.mouse.move(hit.x + hit.width / 2, hit.y + hit.height * .62);
    await page.mouse.down();
    assert.equal(await page.locator('#cardContainer').evaluate((el) => el.classList.contains('dragging-card')), true);
    await page.mouse.move(hit.x + hit.width / 2 + 50, hit.y + hit.height * .62 - 30, { steps: 7 });
    await page.mouse.up();
    assert.equal(await page.locator('html').evaluate((el) => el.classList.contains('lanyard-dragging')), false);
    await page.locator('#contactSenderName').fill('Browser QA');
    await page.locator('#contactSenderEmail').fill('qa@example.com');
    await page.locator('#contactSenderMessage').fill('Mocked homepage form submission.');
    await page.locator('#contactMailForm button[type="submit"]').click();
    await page.waitForFunction(() => document.getElementById('contactMailNotice').textContent.length > 0);
    assert.match(await page.locator('#contactMailNotice').textContent(), /thành công|Ứng dụng email/);
    record('Home retains WebGL drag/flip, contact form and one scene after route changes');
    }

    await go(page, '/', 1440);
    await page.waitForFunction(() => getComputedStyle(document.getElementById('lanyardCanvas')).visibility === 'visible');
    await page.screenshot({ path: path.join(output, 'unified-home-viewport.png') });
    await go(page, '/#about', 1440);
    const portrait = page.locator('#about-person-stage');
    await portrait.focus();
    await page.keyboard.press('Enter');
    assert.equal(await portrait.evaluate((el) => el.classList.contains('is-revealing')), true);
    await portrait.screenshot({ path: path.join(output, 'spiderman-portrait.png') });
    await page.keyboard.press('Enter');
    record('Spider-Man is revealed within the Vest portrait silhouette');

    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(base + '/skills', { waitUntil: 'networkidle' });
    await page.waitForSelector('#glassMirrorWorld > .glass-copy', { state: 'attached' });
    assert.equal(await page.locator('#glassMirrorWorld > .glass-copy').count(), 1);
    await page.waitForFunction(() => [...document.querySelectorAll('#page-content .skill-bar-fill')].every((el) => parseFloat(el.style.width) > 0));
    await go(page, '/', 1440);
    await page.waitForFunction(() => document.querySelectorAll('#glassMirrorWorld > .glass-copy').length === 3);
    assert.equal(await page.locator('#glassMirrorWorld > .glass-copy').count(), 3);
    await go(page, '/projects', 1440);
    await page.waitForFunction(() => document.querySelectorAll('#glassMirrorWorld > .glass-copy').length === 1);
    assert.equal(await page.locator('#glassMirrorWorld > .glass-copy').count(), 1);
    const duplicateIds = await page.evaluate(() => {
      const ids = [...document.querySelectorAll('[id]')].map((el) => el.id);
      return ids.filter((id, index) => ids.indexOf(id) !== index);
    });
    assert.deepEqual(duplicateIds, []);
    record('Glass reflection and reveal effects initialize and clean up across routes');

    await context.route('**/vendor/three-r128.min.js', (route) => route.abort());
    await page.goto(base, { waitUntil: 'networkidle' });
    await dismissIntro(page);
    await page.waitForSelector('#cardContainer.card-skeleton-done');
    assert.equal(await page.locator('#fallbackLanyard').isVisible(), true);
    record('Home keeps its fallback portrait card when Three.js is unavailable');
    assert.deepEqual(errors, [], 'No uncaught browser errors');
    assert.deepEqual(missing, [], 'No missing resources');
    fs.writeFileSync(path.join(output, process.argv.includes('--effects') ? 'effects-results.json' : 'browser-results.json'), JSON.stringify({ checks, errors, missing }, null, 2));
    console.log('Completed ' + checks.length + ' checks; screenshots saved to .qa/');
  } catch (error) {
    if (page) await page.screenshot({ path: path.join(output, 'failure.png'), fullPage: true }).catch(() => {});
    fs.writeFileSync(path.join(output, 'browser-results.json'), JSON.stringify({ checks, errors, missing, failure: error.message }, null, 2));
    throw error;
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
