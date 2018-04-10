// Slit scan / Time displacement video using a FIFO (first in first out) queue/buffer
import processing.video.*;
//Capture cam;
Movie movie;

// number of frames to store in buffer
int num_frames = 256;
// Create our frame buffer
PImage queue[] = new PImage[num_frames];
int write_idx = 0;

// Our map that we'll use to select frames from buffer
PImage map;
boolean show_map;

void setup() {
  //size(636, 360);
  //size(640, 360);
  //size(314,180);
  size(640, 360);
  
  // initialize camera
  //cam = new Capture(this, 640, 480);
  //cam.start();
  
  //movie = new Movie(this,"FWM rain.mov");
  //movie = new Movie(this,"Sacred Geometry Taught in a Donald Duck Cartoon.mp4");
  //movie = new Movie(this,"Surrealis-mo.mp4");
  movie = new Movie(this,"DR_400N_Driving_video-pbEIqMAnZIY.mp4");
  movie.loop();
  movie.speed(2.4);
  
  // initialize video buffer queueu with blank images
  for (int i = 0; i < num_frames; i++) {
    queue[i] = createImage(width, height, RGB);
  }

  // Create our gradient by drawing it to an PImage object
  map = createImage(width, height, RGB);
  linearGradient();
  //radialGradient();
}

void draw() {
  // Grab frames from camera if available and update our queue
  //if (cam.available()) {
    //cam.read();
    //updateQueue(movie.get());
  //}
  
  //updateQueue(movie.get());
  updateQueue(movie.get(320+mouseX, 180+mouseY, 640, 360));
  
  
  // Slitscan
  slitscan();
  linearGradient();
  if (show_map) image(map, 0, 0);
  
  //saveFrame("video_frames/frame_#####.png");
}

void slitscan() {
  // We manipulate the canvas pixels directly
  loadPixels();
  // For every pixel, use the color value of the gradient map at that pixel location
  // to pick which frame in the buffer to use as pixel source
  for (int i = 0; i < pixels.length; i++) {
    // Extract value from map by shifting and &'ing against 0xFF which is hex code for 255
    int gradient = (map.pixels[i] >> 16) & 0xFF;
    // Because we are cyclically writing to our buffer we need to know where we are currently
    // so we can start from there
    int read_idx = (write_idx - gradient - 1) & (num_frames - 1); 
    pixels[i] = queue[read_idx].pixels[i];
  }
  updatePixels();
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

// create a radial gradient
void radialGradient() {
  noStroke();
  int radius = width*2;
  for (int r = radius; r > 0; --r) {
    int f = int(map(r, 0, radius, 0, 255));
    fill(f);
    ellipse(width/2, height/2, r, r);
  }
  loadPixels();
  map.loadPixels();
  for (int i = 0; i < pixels.length; i++) {
    map.pixels[i] = pixels[i];
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