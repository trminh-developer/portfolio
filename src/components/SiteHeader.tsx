import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navigation } from './navigation';

type Props = { soundEnabled: boolean; onToggleSound: () => void };

export default function SiteHeader({ soundEnabled, onToggleSound }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname, hash } = useLocation();
  const currentPage = navigation.find(({ to }) => to === pathname + hash)?.label
    || navigation.find(({ to }) => to === pathname)?.label || 'Home';

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        document.getElementById('menuToggle')?.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="glass-mirror" id="glassMirror" aria-hidden="true" inert>
        <div className="glass-mirror-world" id="glassMirrorWorld" />
      </div>
      <nav className="site-nav" aria-label="Điều hướng chính">
        <canvas className="nav-magnifier" id="navMagnifier" aria-hidden="true" />
        <span className="nav-current">{currentPage}</span>
        <div className={`navigation-links${menuOpen ? ' is-open' : ''}`} id="primaryNavigation">
          {navigation.map(({ to, label }) => {
            const active = to === '/#about'
              ? pathname === '/' && hash === '#about'
              : pathname === to && (to !== '/' || hash !== '#about');
            return (
              <Link key={to} to={to} className={`nav-link${active ? ' active' : ''}`}
                aria-current={active ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            );
          })}
        </div>
        <div className="nav-controls">
          <button className="sound-toggle" id="soundToggle" type="button" aria-pressed={soundEnabled}
            aria-label={soundEnabled ? 'Tắt âm thanh giao diện' : 'Bật âm thanh giao diện'}
            title="Bật/tắt âm thanh giao diện" onClick={onToggleSound}>
            <svg id="soundIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              {soundEnabled ? <><path d="M16 9a4 4 0 0 1 0 6" /><path d="M19 6a8 8 0 0 1 0 12" /></>
                : <path d="m16 9 5 6m0-6-5 6" />}
            </svg>
          </button>
          <button className="menu-toggle" id="menuToggle" type="button" aria-controls="primaryNavigation"
            aria-expanded={menuOpen} aria-label={menuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            onClick={() => setMenuOpen((open) => !open)}>
            <i className={`bi bi-${menuOpen ? 'x-lg' : 'list'}`} aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  );
}
