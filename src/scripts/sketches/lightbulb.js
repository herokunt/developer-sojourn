import p5 from 'p5';
import {
  Engine,
  World,
  Bodies,
  Constraint,
  Mouse,
  MouseConstraint,
  Events
} from 'matter-js';

const FRAME_RATE = 40;
const CANVAS_WALLS = true;
const RENDER_BODIES = false;

class Pendulum {
  constructor(p, world, { x, y, body, options = {} }) {
    this.sling = Constraint.create({
      pointA: {
        x,
        y
      },
      bodyB: body,
      ...options
    });
    this.p = p;
    World.add(world, this.sling);
  }

  render() {
    this.p.line(
      this.sling.pointA.x,
      this.sling.pointA.y,
      this.sling.bodyB.position.x,
      this.sling.bodyB.position.y
    );  
  }
}

class Ball {
  constructor(p, world, { x, y, r, c = p.color(225), options = {} }) {
    this.body = Bodies.circle(x, y, r, options);
    this.r = r;
    this.c = c;
    this.p = p;
    this.noRender = options.noRender || false;
    World.add(world, this.body);
  }

  render() {
    if (this.noRender) return;

    this.p.push();
    this.p.ellipse(
      this.body.position.x,
      this.body.position.y,
      this.r * 2
    );
    this.p.pop();
  }
}

class Light extends Ball {
  constructor(p, world, surfaces, props) {
    super(p, world, props);
    this.rays = [];
    this.surfaces = surfaces;
    for (let i = 0; i < 360; i += 1) {
      this.rays.push(new Ray(p, this.body.position, p.radians(i)));
    }
  }

  render() {
    this.p.push();
    this.p.fill(this.c);
    this.p.stroke(this.c);
    this.p.ellipse(
      this.body.position.x,
      this.body.position.y,
      this.r * 2
    );
    this.p.pop();
    
    this.rays.forEach(ray => {
      let shortestDist = Infinity;
      let closestPoint = null;

      // Check which surface or wall is closest
      this.surfaces.forEach(wall => {
        const ip = ray.cast(wall);
        if (!ip) return;

        const distance = this.p.dist(
          this.body.position.x, this.body.position.y,
          ip.x, ip.y
        );


        if (distance < shortestDist) {
          shortestDist = distance;
          closestPoint = ip;
        }
      });

      // If there is an intersection point, draw a line to it.
      if (closestPoint) {
        this.p.push();
        this.c.setAlpha(50);
        this.p.stroke(this.c);
        this.p.line(ray.pos.x, ray.pos.y, closestPoint.x, closestPoint.y);
        this.p.pop();
      }
    });
  }
}

class Ray {
  constructor(p, pos, angle) {
    this.pos = pos;
    this.dir = p5.Vector.fromAngle(angle);
    this.p = p;
  }

  cast(wall) {

    // Start and end points of the wall
    const x1 = wall.start.x;
    const y1 = wall.start.y;
    const x2 = wall.end.x;
    const y2 = wall.end.y;

    // Ray's current position and direction
    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    // Denominator used to calcualte intersection point between
    // two lines. If it's 0 lines are perfectly parallel.
    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denominator === 0) {
      return false;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denominator;

    // Check if these two lines intersect at any point, and return that point.
    if (t > 0 && t < 1 && u > 0) {
      const ip = this.p.createVector(
        x1 + t * (x2 - x1),
        y1 + t * (y2 - y1)
      );

      return ip;
    }
  }
}

class Surface {
  constructor(p, x1, y1, x2, y2) {
    this.start = p.createVector(x1, y1);
    this.end = p.createVector(x2, y2);
  }
}

class Polygon {
  constructor(p, world, { x, y, s, r, options = {} }) {
    this.body = Bodies.polygon(x, y, s, r, options);
    this.radius = r;
    this.p = p;
    this.noRender = options.noRender || false;
    World.add(world, this.body);
  }

  render() {
    if (this.noRender) return;
    this.p.push();
    this.p.beginShape();
    this.body.vertices.forEach(({ x, y }) => this.p.vertex(x, y));
    this.p.endShape(this.p.CLOSE);
    this.p.pop();
  }
}


export default p => {

  // Matter.js physics engine
  const engine = Engine.create();
  const world = engine.world;

  // Created objects in the "world" are stored here
  const bodies = [];

  // Boxes are items that cast shadow. Their surfaces are
  // tracked separately and calculated on every frame.
  const boxes = [];
  let surfaces = [];

  let canvasDOM;
  let timer;

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
    timer = setTimeout(() => {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
      // setupFlakes();
    }, 100);
  };

  p.setup = () => {
    const canvas = p.createCanvas(100, 100);
    canvas.elt.style.zIndex = 1;
    canvasDOM = canvas.parent();
    p.resizeCanvas(window.innerWidth, window.innerHeight);
    p.frameRate(FRAME_RATE);

    // create the ball
    const light = new Light(p, world, surfaces, {
      x: p.width / 2 + 100,
      y: 100,
      r: 10,
      options: {
        restitution: 0.4,
        friction: 0.3
      }
    });

    // create the pendulum
    const pendulum = new Pendulum(p, world, {
      x: p.width / 2,
      y: 200,
      body: light.body,
      options: {
        stiffness: 1,
        length: 100
      }
    });

    const poly1 = new Polygon(p, world, {
      x: p.width / 2,
      y: p.height - 200,
      s: 5,
      r: 80,
      options: {
        noRender: !RENDER_BODIES,
        isStatic: true,
        angle: Math.PI + 0.2
      }
    });
  
    const poly2 = new Polygon(p, world, {
      x: (p.width / 2) + (p.width / 5),
      y: p.height - 200,
      s: 6,
      r: 80,
      options: {
        noRender: !RENDER_BODIES,
        isStatic: true
      }
    });

    const poly3 = new Polygon(p, world, {
      x: p.width / 3,
      y: 200,
      s: 8,
      r: 80,
      options: {
        noRender: !RENDER_BODIES,
        isStatic: true,
        angle: Math.PI + 0.2
      }
    });
  
    const poly4 = new Polygon(p, world, {
      x: p.width / 2 + 200,
      y: 200,
      s: 9,
      r: 80,
      options: {
        noRender: !RENDER_BODIES,
        isStatic: true
      }
    });


    // ...and add them to the world
    bodies.push(poly1, poly2, poly3, poly4);
    boxes.push(poly1, poly2, poly3, poly4);

    // create mouse object and constraint
    const mouse = Mouse.create(canvas.elt);
    const mouseconstraint = MouseConstraint.create(engine, {
      mouse
    });

    if (CANVAS_WALLS) {
      surfaces.push(new Surface(p, 0, 0, p.width, 0));
      surfaces.push(new Surface(p, p.width, 0, p.width, p.height));
      surfaces.push(new Surface(p, p.width, p.height, 0, p.height));
      surfaces.push(new Surface(p, 0, p.height, 0, 0));
    }

    World.add(world, mouseconstraint);
    bodies.push(pendulum, light);
  };

  p.draw = () => {
    p.background(50);

    // run the engine
    Engine.update(engine);

    boxes.forEach(box => {
      box.body.vertices.forEach((vertex, idx, arr) => {
        const nextVertex = (idx + 1) % arr.length;
        surfaces.push(new Surface(
          p,
          vertex.x, vertex.y,
          arr[nextVertex].x, arr[nextVertex].y
        ));
      });
    });

    bodies.forEach(body => body.render());
    
    if (CANVAS_WALLS) {
      surfaces.splice(4);
    } else {
      surfaces = [];
    }
  };
};