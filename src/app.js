import './styles.scss';
import './scripts/CanvasController';
import LazyLoader from './scripts/LazyLoader';

const isMobileDevice = navigator.userAgent.match(
  /(Android|iPhone|iPad|iPod|webOS|Windows Phone|BlackBerry)/i
);

/* Only load videos if device is on desktop for better UX */
if (!isMobileDevice) {
  new LazyLoader();
}
