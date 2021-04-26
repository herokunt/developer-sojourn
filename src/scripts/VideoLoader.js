/*
  - https://davidwalsh.name/detect-supported-video-formats-javascript
  - https://redstapler.co/detect-mobile-device-with-javascript/
*/

class VideoLoader {
  constructor(isMobileDevice) {
    if (isMobileDevice) {
      document.querySelectorAll('.card__video').forEach(video => video.src = '');
      return;
    }

    this.videos = document.querySelectorAll('.card__video');
    this.createObservers();
    this.checkVideoSupport();
  }

  // This can be done with a <picture> element but I want to disable video
  // altogether when on mobile which makes this a lot easier to manage.
  checkVideoSupport() {
    const video = document.createElement('video');
    if (!video.canPlayType('video/webm; codecs="vp8, vorbis"')) {
      this.videos.forEach(video => video.src.replace('webm', 'mp4'));
    }
    this.videos = null; //cleanup
  }

  createObservers() {

    const targets = [
      document.getElementById('gamesgraphics'),
      document.getElementById('scripts')
    ];

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.0
    };

    targets.forEach(target => {
      new IntersectionObserver(([entry]) => {
        const moveIntoView = entry.intersectionRatio > 0;
        target
          .querySelectorAll('.card__video')
          .forEach(video => moveIntoView ? video.play() : video.pause());
      }, options)
      .observe(target);
    });
  };
}

export default VideoLoader;
