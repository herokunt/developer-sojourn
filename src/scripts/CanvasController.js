import p5       from 'p5';
import matrix   from './sketches/matrix';
import circles  from './sketches/circles';
import snowfall from './sketches/snowfall';
import blobby   from './sketches/blobby';

const CANVAS_ELEMENT  = 'p5canvas';
const SKETCH_LIST = {
  circles,
  snowfall,
  blobby,
  matrix
};

class CanvasController {
  constructor(sketch) {
    this.current  = new p5(sketch, CANVAS_ELEMENT);
    this.observer = this.createObserver();
    this.events();
  };

  events() {
    document.querySelector('.header__navigation').addEventListener('click', e => {
      if (e.target.id.match(/(circles|matrix|blobby|snowfall|flowfield)/i)) {
        this.changeSketch(e.target.id);
      }
    });
  }

  changeSketch(sketch) {
    this.current = this.current.destroy();
    setTimeout(() => {
      this.current = new p5(SKETCH_LIST[sketch], CANVAS_ELEMENT);
    }, 250);
  }

  createObserver() {
    const target = document.getElementById(CANVAS_ELEMENT);

    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.0
    };

    this.observer = new IntersectionObserver(([entry]) => {
      const moveIntoView = entry.intersectionRatio > 0;
      moveIntoView ? this.current.resumeLoop() : this.current.stopLoop();
    }, options);

    this.observer.observe(target);
  }
}

export default new CanvasController(circles);
