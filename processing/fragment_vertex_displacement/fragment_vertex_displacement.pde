// author: Jeff Huang
// uses a PGraphics buffer to draw a fragment shader,
// then grabs the last drawn buffer and sends it to a displacement shader to modify a mesh

int cols, rows;

int w = 400;
int h = 400;
int scl = 4;
float flying = 0;

float[][] terrain;

PShader displace;

PShader texShader;
PImage the_image;
PImage test_image;
PImage test_image2;
PShape the_shape;

PShader voro;
PGraphics pg;

void setup() {
  size(600, 600, P3D);
  cols = w / scl;
  rows = h/ scl;

  the_image = loadImage("image.png");
  the_image.resize(width, height);

  test_image = loadImage("manhattan.JPG");
  test_image.resize(width, height);

  test_image2 = loadImage("manhattan.JPG");
  test_image2.resize(width, height);

  //voro = loadShader("waves_thing.frag");
  displace = loadShader("manhattan_voronoi_YB_v1.frag");
  //displace = loadShader("pixelized_radius_thing.frag");
  //displace = loadShader("simplex_noise.frag");
  voro = loadShader("3d_cell_noise.frag");

  texShader = loadShader("TTT.frag", "TTT.vert");
  texShader.set("isPixelize", false);
  texShader.set("pixelize", 50.0);
  pg = createGraphics(width, height, P3D);
}


void draw() {

  rectMode(CORNER);
  //fill(0);
  background(180);
  blendMode(BLEND);
  resetShader();
  //rect(0, 0, width, height);
  


  pg.beginDraw();
  pg.resetShader();
  pg.shader(displace);
  pg.filter(displace);
  displace.set("u_resolution", float(width), float(height));
  displace.set("u_time", millis() / 1000.0);
  displace.set("u_mouse", (float)mouseX, (height - mouseY) * 1.0);
  rectMode(CORNER);
  pg.rect(0, 0, width, height);
  pg.endDraw();
  
  //image(pg, 0, 0);
  //blendMode(ADD);
  


  //shader(displace);
  //displace.set("u_resolution", float(width), float(height));
  //displace.set("u_time", millis() / 1000.0);
  //displace.set("u_mouse", (float)mouseX, (height - mouseY) * 1.0);
  //rect(0, 0, width, height);

  //rectMode(CORNER);
  
  //blendMode(MULTIPLY);
  // displace ment
  // ======================== //
  rectMode(CENTER);
  pushMatrix();
  translate(width/2, height/2);  

  rotateX(PI/3);
  rotateX(2*PI*mouseY/height);  
  //rotateZ(2*PI*mouseX/width);
  translate(-w/2, -h/2);

  shader(texShader);
  noStroke();
  texShader.set("u_resolution", float(width), float(height));
  texShader.set("u_time", millis() / 1000.0);
  texShader.set("disp", 50.);
  texShader.set("the_tex", pg);

  
  shape(mesh(test_image));
  //box(200);
  //sphere(100);
  popMatrix();
  // ======================== //
  //blendMode(MULTIPLY);
  //resetShader();
  //image(pg, 0, 0);
  
  pg.beginDraw();
  pg.resetShader();
  pg.shader(voro);
  pg.filter(voro);
  voro.set("u_resolution", float(width), float(height));
  voro.set("u_time", millis() / 1000.0);
  voro.set("u_mouse", (float)mouseX, (height - mouseY) * 1.0);
  rectMode(CORNER);
  pg.rect(0, 0, width, height);
  pg.endDraw();
  resetShader();
  //blendMode(LIGHTEST);
  //image(pg, 0, 0);
  
}

PShape mesh(PImage p)
{
  PShape bilbo = createShape();
  float u;
  float v;
  for (int i = 0; i < cols-1; i++)
  {
    bilbo.beginShape(TRIANGLE_STRIP);
    bilbo.texture(p);
    for (int j = 0; j < rows; j++)
    {
      u = (float)i/cols * width;
      v = (float)j/rows * height;
      bilbo.vertex(i * scl, j * scl, 0, u, v);
      u = (float)(i+1)/cols * width;
      v = (float)j/rows * height;
      bilbo.vertex((i+1) * scl, j * scl, 0, u, v);
    }
    bilbo.endShape();
  }
  return bilbo;
}