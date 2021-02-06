class LazyLoader {
  constructor() {
    this.videos  = document.querySelectorAll('.card__video');
    // this.sources = [
    //   '../assets/videos/flowfield.webm',
    //   '../assets/videos/raycasting.webm',
    //   '../assets/videos/steering-behavior.webm',
    //   '../assets/videos/tetris.webm',
    //   '../assets/videos/snake.webm',
    //   '../assets/videos/maze.webm',
    //   '../assets/videos/matter.webm'
    // ];
    // this.checkVideoSupport();
    this.createObserver();
  }

  // checkVideoSupport() {
  //   const video = document.createElement('video');
  //   if (!video.canPlayType('video/webm; codecs="vp8, vorbis"')) {
  //     this.sources.forEach(src => src.replace('webm', 'mp4'));
  //   }
  // }
  //
  // loadVideos() {
  //   this.videos.forEach((video, idx) => {
  //     video.src = this.sources[idx];
  //     video.play();
  //   });
  // }
  //
  // unloadVideos() {
  //   this.videos.forEach(video => {
  //     video.pause();
  //     video.src = ''
  //   });
  // }

  createObserver() {
    const target = document.getElementById('section-projects');

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.0
    };

    // this.observer = new IntersectionObserver(([entry]) => {
    //   entry.intersectionRatio > 0 ? this.loadVideos() : this.unloadVideos();
    // }, options);

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
