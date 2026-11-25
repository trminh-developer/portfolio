import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BackgroundCanvas from './BackgroundCanvas';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import { useInterfaceSound } from './useInterfaceSound';
import { initializePageEffects } from '../template/site.js';

export default function Layout() {
  const { pathname, hash, key } = useLocation();
  const sound = useInterfaceSound();

  useEffect(initializePageEffects, [pathname]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const id = hash.slice(1);
      const target = /^[\w-]+$/.test(id) ? document.getElementById(id) : null;
      if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);

  return (
    <div className="site-shell portfolio-template" id="page-top">
      <a className="skip-link" href={pathname === '/' ? '#home' : '#page-content'}>Đến nội dung chính</a>
      <BackgroundCanvas />
      <SiteHeader soundEnabled={sound.enabled} onToggleSound={sound.toggle} />
      {pathname === '/' ? <Outlet /> : <main className="inner-content" id="page-content"><Outlet /></main>}
      <SiteFooter />
    </div>
  );
}
