import { useEffect } from 'react';
import markup from '../template/portfolio.html?raw';
import { initializePortfolio } from '../template/runtime.js';

export default function Home() {
  useEffect(initializePortfolio, []);
  // This is trusted, checked-in HTML from the published template. All behavior
  // lives in imported modules; no script tags or user content are evaluated.
  return <div className="home-page" dangerouslySetInnerHTML={{ __html: markup }} />;
}
