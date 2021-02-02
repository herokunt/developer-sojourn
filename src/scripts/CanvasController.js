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
    const menu = document.querySelector('.dropdown__menu');
    this.effects = menu.querySelectorAll('.dropdown__btn');

    menu.addEventListener('click', e => {
      const btn = e.target;

      if (!btn.id.match(/(circles|matrix|blobby|snowfall|flowfield)/i)) {
        return;
      }

      if (btn.className.includes('active')) {
        btn.className = btn.className.replace('active', 'paused');
        this.current.stopLoop();
        return;
      }

      if (btn.className.includes('paused')) {
        btn.className = btn.className.replace('paused', 'active');
        this.current.resumeLoop();
        return;
      }

      // At this point is clear a new button was selected, reset classes
      this.effects.forEach(btn => btn.className = 'dropdown__btn');

      // Add new active class to clicked button
      btn.classList.add('.dropdown__btn--active');

      // Update sketch
      this.changeSketch(e.target.id);
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
