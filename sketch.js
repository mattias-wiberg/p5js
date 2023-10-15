class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Grid {
  // Generates points on a grid given a start Point, cell width and height and spacing
  constructor(
    x_origin = 0,
    y_origin = x_origin,
    width = 5,
    height = width,
    cell_width = 50,
    cell_height = cell_width,
    spacing = 0
  ) {
    this.x_origin = x_origin;
    this.y_origin = y_origin;
    this.width = width;
    this.height = height;
    this.cell_width = cell_width;
    this.cell_height = cell_height;
    this.spacing = spacing;
    this.points = [];
    this.generate();
  }

  generate() {
    let x = this.x_origin;
    let y = this.y_origin;
    this.points = [];
    for (let i = 0; i < this.width; i += 1) {
      for (let j = 0; j < this.height; j += 1) {
        this.points.push(new Point(x, y));
        y += this.cell_height + this.spacing;
      }
      y = this.y_origin;
      x += this.cell_width + this.spacing;
    }
  }

  draw() {
    for (let i = 0; i < this.points.length; i += 1) {
      strokeWeight(1);
      stroke(255);
      noFill();
      square(this.points[i].x, this.points[i].y, this.cell_width);
      strokeWeight(2);
      stroke(0);
      point(this.points[i].x, this.points[i].y);
    }
  }
}

class Cone {
  constructor(x, y, size = 50, height = 27) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.height = height;
    // Thetas are to allow for the cones sides to be
    this.center = new Point(this.x + this.size / 2, this.y + this.size / 2);
    this.peak = new Point(this.center.x, this.center.y);
    this.base = {
      topLeft: new Point(x, y), // Top left
      topRight: new Point(x + this.size, y), // Top right
      bottomRight: new Point(x + this.size, y + this.size), // Bottom right
      bottomLeft: new Point(x, y + this.size), // Bottom left
    };
  }

  set_peak(x, y, range = 100, reaction = 1) {
    let angle = atan2(y - this.center.y, x - this.center.x);
    let distance = dist(x, y, this.center.x, this.center.y);
    console.log(reaction);

    if (distance > this.height) {
      // if (distance > range) {
      //   // Out of range ignore
      //   this.peak.x = this.center.x;
      //   this.peak.y = this.center.y;
      //   return;
      // }
      this.peak.x =
        this.center.x +
        follow *
          cos(angle) *
          this.height *
          max(0, 1 - (distance - this.height) / range) *
          reaction;
      this.peak.y =
        this.center.y +
        follow *
          sin(angle) *
          this.height *
          max(0, 1 - (distance - this.height) / range) *
          reaction;
      return;
    }
    this.peak.x = this.center.x + follow * cos(angle) * distance * reaction;
    this.peak.y = this.center.y + follow * sin(angle) * distance * reaction;
    /* 
    this.peak.x =
    this.center.x +
    follow * cos(angle) * this.height * (distance / this.height);
    this.peak.y =
    this.center.y +
    follow * sin(angle) * this.height * (distance / this.height);
    */
  }

  draw_side(base_point1, base_point2) {
    strokeWeight(0);
    beginShape();
    vertex(base_point1.x, base_point1.y);
    vertex(this.peak.x, this.peak.y);
    vertex(base_point2.x, base_point2.y);
    endShape(CLOSE);
  }

  active_sides(x, y) {
    // A side is visible if the peak is towards the opposite side of the line created from the sides base points
    let sides = [];
    // Top side
    if (this.y < y) {
      sides.push(["top", this.base.topLeft, this.base.topRight]);
    }
    // Right side
    if (this.x + this.size > x) {
      sides.push(["right", this.base.topRight, this.base.bottomRight]);
    }
    // Bottom side
    if (this.y + this.size > y) {
      sides.push(["bottom", this.base.bottomLeft, this.base.bottomRight]);
    }
    // Left side
    if (this.x < x) {
      sides.push(["left", this.base.topLeft, this.base.bottomLeft]);
    }
    return sides;
  }

  draw() {
    let grass = {
      top: "#80C342",
      right: "#66BC46",
      bottom: "#47B649",
      left: "#3fa341",
    };
    let ferrofluid = {
      top: "#8C8C8C",
      right: "#4D4D4D",
      bottom: "#333333",
      left: "#000000",
    };
    let side_colors = grass;
    this.set_peak(mouseX - width / 2, mouseY - height / 2);
    let sides = this.active_sides(this.peak.x, this.peak.y);
    for (let i = 0; i < sides.length; i += 1) {
      fill(side_colors[sides[i][0]]);
      this.draw_side(sides[i][1], sides[i][2]);
    }
  }
}

let cones = [];
let grid;
let follow = -1;

function setup() {
  createCanvas(400, 400, WEBGL);
  w_count = 7;
  h_count = 7;
  grid = new Grid(
    -width / 2 + 25,
    -height / 2 + 25,
    w_count,
    h_count,
    50,
    50,
    0
  );
  for (let i = 0; i < grid.points.length; i += 1) {
    let height = random(1, 70);
    console.log(height);
    cones.push(
      new Cone(
        grid.points[i].x,
        grid.points[i].y,
        50,
        noise(grid.points[i].x, grid.points[i].y) * 70
      )
    );
  }
}

function draw() {
  background(220);
  //grid.draw();
  for (let cone of cones) {
    cone.draw();
  }
}

function mouseClicked() {
  follow *= -1;
}
