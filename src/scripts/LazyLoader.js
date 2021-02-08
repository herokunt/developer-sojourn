class LazyLoader {
  constructor() {
    this.videos  = document.querySelectorAll('.card__video');
    this.isMobileDevice = navigator.userAgent.match(
      /(Android|iPhone|iPad|iPod|webOS|Windows Phone|BlackBerry)/i
    );

    if (this.isMobileDevice) {
      this.videos.forEach(video => video.src = '');
    } else {
      this.createObserver();
      this.checkVideoSupport();
    }
  }

  // This can be done with a <picture> element but I want to disable video
  // altogether when on mobile which makes this a lot easier to manage.
  checkVideoSupport() {
    const video = document.createElement('video');
    if (!video.canPlayType('video/webm; codecs="vp8, vorbis"')) {
      this.videos.forEach(video => video.src.replace('webm', 'mp4'));
    }
  }

  createObserver() {
    const target = document.getElementById('section-projects');

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.0
    };

    this.observer = new IntersectionObserver(([entry]) => {
      const moveIntoView = entry.intersectionRatio > 0;
      this.videos.forEach(video => moveIntoView ? video.play() : video.pause());
    }, options);

    this.observer.observe(target);
  };
}

export default LazyLoader;

/*
  - https://davidwalsh.name/detect-supported-video-formats-javascript
  - https://redstapler.co/detect-mobile-device-with-javascript/
*/
