class LazyLoader {
  constructor() {
    this.videos  = document.querySelectorAll('.card__video');
    this.sources = [];
    // this.videoFormat = this.checkVideoSupport();
    this.createObserver();
  }
  //
  // checkVideoSupport() {
  //   return this.videos[0].canPlayType('video/webm; codecs="vp8, vorbis"')
  //     ? 'webm'
  //     : 'mp4';
  // }

  loadVideos() {

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
