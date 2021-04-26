import './styles.scss';

import CanvasController from './scripts/CanvasController';
import VideoLoader from './scripts/VideoLoader';
import Scroller from './scripts/Scroller';
// import PostLoader from './scripts/PostLoader';
// import Modal from './scripts/Modal';

new CanvasController();
// new PostLoader();
// new Modal();

const isMobileDevice = navigator.userAgent.match(
  /(Android|iPhone|iPad|iPod|webOS|Windows Phone|BlackBerry)/i
);

new VideoLoader(isMobileDevice);
new Scroller(isMobileDevice);
