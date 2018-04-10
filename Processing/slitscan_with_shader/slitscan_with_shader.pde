import netP5.*;
//===========================================================
//
// osc

import oscP5.*;

OscP5 oscP5;
NetAddress myloc;

int oscX=0;
int oscY=0;
int oscXlerp=0;
int oscYlerp=0;

void oscEvent(OscMessage msg)
{
  if (msg.checkAddrPattern("/onset") == true)
  {
    print("here");
    oscX = (floor(random(0,2)*3)/3)*640;
    oscY = (floor(random(0,2)*3)/3)*360;
  }
}
  
//===========================================================
//
// Slit scan / Time displacement video using a FIFO (first in first out) queue/buffer
import processing.video.*;
//Capture cam;
Movie movie;

PShader liquid;
PGraphics liqu_tex;

// number of frames to store in buffer
int num_frames = 256;
// Create our frame buffer
PImage queue[] = new PImage[num_frames];
int write_idx = 0;

// Our map that we'll use to select frames from buffer
PImage map;
boolean show_map;

void setup() {
  size(640, 360, P2D);
  liqu_tex = createGraphics(640,360,P2D);
  
  liquid = loadShader("/Users/mmkeene/Documents/Shaders/GLSL/black_n_white_liquid.frag");
  
  oscP5 = new OscP5(this, 12002);
  myloc = new NetAddress("127.0.0.1", 12000);
  
  // initialize camera
  //cam = new Capture(this, 640, 480);
  //cam.start();
  
  movie = new Movie(this,"/Users/mmkeene/Documents/Shaders/Processing/slitscan/data/Sacred Geometry Taught in a Donald Duck Cartoon.mp4");
  //movie = new Movie(this,"/Users/mmkeene/Documents/Shaders/Processing/slitscan/data/DR_400N_Driving_video-pbEIqMAnZIY.mp4");
  movie.loop();
  movie.speed(4.4);
  
  // initialize video buffer queueu with blank images
  for (int i = 0; i < num_frames; i++) {
    queue[i] = createImage(width, height, RGB);
  }

  // Create our gradient by drawing it to an PImage object
  map = createImage(width, height, RGB);
  linearGradient();
}

void draw() {
  
  liquid.set("u_resolution", float(width), float(height));
  liquid.set("u_time", millis()/1000.0);
  
  liqu_tex.filter(liquid);
  
  
  // Grab frames from camera if available and update our queue
  //if (cam.available()) {
    //cam.read();
    //updateQueue(movie.get());
  //}
  
  //updateQueue(movie.get());
  //updateQueue(movie.get(320+mouseX, 180+mouseY, 640, 360));
  updateQueue(movie.get(320+oscXlerp, 180+oscYlerp, 640, 360));
  
  oscXlerp = int(lerp(oscXlerp,oscX,0.2));
  oscYlerp = int(lerp(oscYlerp,oscY,0.2));
  
  // Slitscan
  slitscan();
  //linearGradient();
  //if (show_map) image(map, 0, 0);
  
  //saveFrame("video_frames/frame_#####.png");
}

void slitscan() {
  // We manipulate the canvas pixels directly
  loadPixels();
  liqu_tex.loadPixels();
  // For every pixel, use the color value of the gradient map at that pixel location
  // to pick which frame in the buffer to use as pixel source
  for (int i = 0; i < pixels.length; i++) {
    // Extract value from map by shifting and &'ing against 0xFF which is hex code for 255
    //int gradient = (map.pixels[i] >> 16) & 0xFF;
    
    int gradient = (liqu_tex.pixels[i] >> 16) & 0xFF;
    
    
    // Because we are cyclically writing to our buffer we need to know where we are currently
    // so we can start from there
    int read_idx = (write_idx - gradient - 1) & (num_frames - 1); 
    pixels[i] = queue[read_idx].pixels[i];
  }
  updatePixels();
  liqu_tex.updatePixels();
}

// Save our camera frame to our buffer and increment our write index
void updateQueue(PImage write_frame) {
  queue[write_idx] = write_frame;
  write_idx = (write_idx + 1) & (num_frames - 1);
}

// Create a linear gradient
void linearGradient() {
  map.loadPixels();
  for (int x = 0; x < map.width; x++) {
    for (int y = 0; y < map.height; y++) {
      int gradient_value = int((float(x)/width)*255);
      color c = color(int(noise(x*0.005,y*0.005,frameCount*0.008)*255));
      map.pixels[x + y*width] = c;
    }
  }
  map.updatePixels();
}

void keyPressed(int k) {
  
  if(k == 'm') {
    show_map = true;
  }
  
}

void keyReleased(int k) {
  
  if(k == 'm') {
    show_map = false;
  }
  
}

void movieEvent(Movie m) {
  m.read();
}