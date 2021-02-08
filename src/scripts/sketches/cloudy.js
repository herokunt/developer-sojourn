import p5 from 'p5';


export default p => {

  let noiseValue = 0.015;
  let canvasDOM;
  let timer;

  p.stopLoop = () => {
    p.noLoop();
  };

  p.resumeLoop = () => {
    p.draw();
  };

  p.destroy = () => {
    p.stopLoop();
    p.noCanvas();
    return null;
  };

  p.windowResized = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      p.resizeCanvas(document.body.clientWidth, canvasDOM.scrollHeight);
      p.draw();
    }, 100);
  };

  p.setup = () => {
    const canvas = p.createCanvas(100, 100);
    canvasDOM = canvas.parent();
    p.resizeCanvas(canvasDOM.scrollWidth, canvasDOM.scrollHeight);

    p.clear();
    // p.pixelDensity(1);
  }

  p.draw = () => {
    p.loadPixels();

    let yoff = 0;
    for (let i = 0; i < p.width; i++) {

      let xoff = 0;
      for (let j = 0; j < p.height; j++) {
        const index = (i + j * p.height) * 4;
        const r = p.noise(xoff, yoff) * 255;

        p.pixels[index + 0] = r;
        p.pixels[index + 1] = r;
        p.pixels[index + 2] = r;
        p.pixels[index + 3] = 255;

        xoff += noiseValue;
      }
      yoff += noiseValue;
    }
    p.updatePixels();
    p.noLoop();
  }
};
