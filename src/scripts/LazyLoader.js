/*
  - https://davidwalsh.name/detect-supported-video-formats-javascript
  - https://redstapler.co/detect-mobile-device-with-javascript/
*/

class LazyLoader {
  constructor() {
    this.videos = document.querySelectorAll('.card__video');
    this.controller = document.querySelector('.btn--controller');
    this.autoplay = true;

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
    // const target = document.getElementById('section-projects');
    const target = document.querySelector('.gallery');

    this.controller.addEventListener('click', () => {
      this.autoplay = !this.autoplay;
      this.videos.forEach(video => video.paused
        ? video.play()
        : video.pause());
    });

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.0
    };

    this.observer = new IntersectionObserver(([entry]) => {
      const moveIntoView = entry.intersectionRatio > 0;

      if (moveIntoView) {
        this.controller.classList.remove('btn--hidden');
        if (!this.autoplay) return;
        this.videos.forEach(video => video.play());
      } else {
        this.controller.classList.add('btn--hidden');
        if (!this.autoplay) return;
        this.videos.forEach(video => video.pause());
      }
    }, options);

    this.observer.observe(target);
  };
}

export default LazyLoader;
