import p5         from 'p5';
import matrix     from './sketches/matrix';
import circles    from './sketches/circles';
import bubbles    from './sketches/bubbles';
import snowfall   from './sketches/snowfall';
import blobby     from './sketches/blobby';
import flowfield  from './sketches/flowfield';

const CANVAS_ELEMENT  = 'p5canvas';
const DEFAULT_SKETCH = bubbles;
const SKETCH_LIST = {
  circles,
  snowfall,
  blobby,
  matrix,
  flowfield,
  bubbles
};

class CanvasController {
  constructor() {
    this.current  = new p5(DEFAULT_SKETCH, CANVAS_ELEMENT);
    this.observer = this.createObserver();
    // this.listen();
  };

  listen() {
    const menu = document.querySelector('.dropdown__menu');
    this.effects = menu.querySelectorAll('.dropdown__btn');

    menu.addEventListener('click', ({ target }) => {

      if (!SKETCH_LIST.hasOwnProperty(target.id)) return;

      if (target.className.includes('active')) {
        target.className = target.className.replace('active', 'paused');
        this.current.stopLoop();
        return;
      }

      if (target.className.includes('paused')) {
        target.className = target.className.replace('paused', 'active');
        this.current.resumeLoop();
        return;
      }

      // At this point is clear a new effect was selected, reset classes
      this.effects.forEach(btn => btn.className = 'dropdown__btn');

      // Add new active class to clicked button
      target.classList.add('dropdown__btn--active');

      // Update sketch
      this.changeSketch(target.id);
    });
  }

  changeSketch(sketch) {
    this.current = this.current.destroy();

    this._changeSketch(sketch)
      .then(instance => this.current = instance)
      .catch(console.error);
  }

  _changeSketch(sketch) {
    return new Promise((resolve, reject) => {
      const instance = new p5(SKETCH_LIST[sketch], CANVAS_ELEMENT);
      if (instance) {
        resolve(instance);
      } else {
        reject('Error during creation of the instance');
      }
    });
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

export default CanvasController;
