import p5 from 'p5';

const CHAR_SIZE = 40;
const CHAR_COLOR = 'rgba(241,241,241,0.25)';
const FRAME_RATE = 25;

class MatrixSymbol {
  constructor(p, x, y, speed, col) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.value = this.setRandomSymbol();
    this.speed = speed;
    this.color = col;
    this.interval = Math.round(Math.random() * 60 + 21);
  }

  setRandomSymbol() {
    return String.fromCharCode(0x30A0 + Math.round(Math.random() * 96));
  }

  scroll() {
    this.y += this.speed;
    if (this.y > this.p.height + CHAR_SIZE) {
      this.y = -CHAR_SIZE * 2;
    }
  }

  update() {
    this.scroll();
    if (this.p.frameCount % this.interval === 0) {
      this.value = this.setRandomSymbol();
    }
  }

  render() {
    this.p.fill(this.color);
    this.p.text(this.value, this.x, this.y);
  }
}

class Column {
  constructor(p, x, y) {
    this.p = p;
    this.x = x;
    this.y = y;
    this.symbols = [];
    this.totalSymbols = Math.round(Math.random() * 20 + 10);
    this.speed = Math.random() * 4;
    this.setup();
  }

  setup() {
    for (let i = 0; i < this.totalSymbols; i++) {
      let letterColor = this.p.color(CHAR_COLOR);

      const symbol = new MatrixSymbol(
        this.p,
        this.x,
        this.y,
        this.speed,
        letterColor
      );

      this.symbols.push(symbol);
      this.y -= CHAR_SIZE;
    }
  }

  render() {
    this.symbols.forEach(symbol => {
      symbol.update();
      symbol.render();
    });
  }
}

let columns = [];

export default p => {

  let canvasDOM;
  let timer;

  const setupColumns = () => {
    for (let i = 0; i < p.width; i += CHAR_SIZE) {
      columns[i] = new Column(p, i, p.random(-1000, 0));
    }
  }

  p.stopLoop = () => {
    p.noLoop();
  };

  p.resumeLoop = () => {
    p.loop();
  };

  p.destroy = () => {
    p.stopLoop();
    p.noCanvas();
    return null;
  };

  p.windowResized = () => {
    clearTimeout(timer);
    p.noLoop();
    timer = setTimeout(() => {
      p.resizeCanvas(document.body.clientWidth, canvasDOM.scrollHeight);
      setupColumns();
      p.loop();
    }, 500);
  }

  p.setup = () => {
    const canvas = p.createCanvas(100, 100);
    canvasDOM = canvas.parent();
    p.resizeCanvas(canvasDOM.scrollWidth, canvasDOM.scrollHeight);

    p.frameRate(FRAME_RATE);
    p.textSize(CHAR_SIZE);

    setupColumns();
  };

  p.draw = () => {
    p.clear();
    columns.forEach(column => column.render());
  };
};
