import { useEffect } from 'react';
import { initializeBackground } from '../template/background.js';

export default function BackgroundCanvas() {
  useEffect(initializeBackground, []);
  return <canvas id="starfield" aria-hidden="true" />;
}
