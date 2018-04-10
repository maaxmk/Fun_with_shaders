
//===========================================================
//
// osc
import netP5.*;
import oscP5.*;

OscP5 oscP5;
NetAddress myloc;

float tDelta = 0;
float tDeltaLerp = 0;
float t = 0;
float tInc = 0.03;
boolean onset_check = false;
float randXrot = 0;
float randYrot = 0;

void oscEvent(OscMessage msg)
{
  if (msg.checkAddrPattern("/onset") == true)
  {
    if(onset_check) {
      float rand = random(0.0,1.0);
      if(rand > 0.35) {
        tDelta += (mouseX/float(width))*2.5;
        tInc = 0.03;
      } else {
        tDelta -= (mouseX/float(width))*3.5;
        tInc = -0.03;
      }
      
      randXrot = random(0.0,TWO_PI);
      randYrot = random(0.0,TWO_PI);
    }
    
    //print("here");
  }
}

//===========================================================
//
//
PShader shader, blur;
PGraphics shade_graph;

void setup() {
  //size(700,700,P2D);
  fullScreen(P3D);
  shade_graph = createGraphics(width,height,P3D);
  
  oscP5 = new OscP5(this, 12002);
  myloc = new NetAddress("127.0.0.1", 12000);
  
  shader = loadShader("/Users/mmkeene/Documents/Shaders/GLSL/lava_flow.frag");
  blur = loadShader("/Users/mmkeene/Documents/Shaders/GLSL/blur.glsl");
  background(40);
}

void draw() {
  
  background(255);
  
  shader.set("u_resolution", float(width), float(height));
  shader.set("u_time", t+tDeltaLerp);//(millis()/1000.0)
  tDeltaLerp = lerp(tDeltaLerp,tDelta,0.2);
  t += tInc;
  float tDD = abs(tDeltaLerp-tDelta);
  
  //shade_graph.filter(shader);
  
  ortho();
  lights();
  translate(width/2,height/2,0);
  //rotateX(0.36+frameCount*0.01+tDD*0.05);
  //rotateY(0.36+frameCount*0.02+tDD*0.05);
  rotateX(randXrot);
  rotateY(randYrot);
  noStroke();
  //stroke(100);
  //texture(shade_graph);
  shader(shader);
  box(500);
  
  blur.set( "width", 0.436 + tDD*4.0 );
  filter( blur );
}

void mouseClicked() {
  onset_check = !onset_check;
}