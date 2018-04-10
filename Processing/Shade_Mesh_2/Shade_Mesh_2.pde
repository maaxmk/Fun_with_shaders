import peasy.*;
import peasy.org.apache.commons.math.*;
import peasy.org.apache.commons.math.geometry.*;
PeasyCam cam;

PShader shader, blur;
PGraphics shade_graph;

// setup Shader
float[] brit_field;

int mesh_res_x,mesh_res_y;
float mesh_amp;



void setup() {
  
  //size(500,500,P3D);
  fullScreen(P3D);
  cam = new PeasyCam(this, 900);
  
  shader = loadShader("../../GLSL/fbm_1.frag");
  shade_graph = createGraphics(1200,1200,P2D);
  shader.set("u_resolution", float(shade_graph.width), float(shade_graph.height));
  
  blur = loadShader("../../GLSL/blur.glsl");
  blur.set("amp",30.0);
  
  mesh_res_x = 300;//320;
  mesh_res_y = 300;//240;
  
  mesh_amp = 0.05;
  brit_field = new float[mesh_res_x*mesh_res_y]; 
  
  background(0);
  //noCursor();
}



void draw() {
  
  background(240);
  //filter(blur);
  //blur.set("width",1.0);
  
  //*
  shade_graph.beginDraw();
  
  // draw shader to shade_graph
  shader.set("u_time",frameCount*0.006);
  shade_graph.filter(shader);
  shader.set("brightness",0.2);//0.675+0.25*sin(frameCount*0.01));
  shader.set("x_mod",frameCount*0.01);
  
  // get shader brightness 
  float brit_max = 0.0;
  shade_graph.loadPixels();
  for(int y=0; y<mesh_res_y; y++) {
    for(int x=0; x<mesh_res_x; x++) {
      
      color shade_pix = shade_graph.get(int(map(x,0,mesh_res_x-1,0,shade_graph.width-1)),
                                        int(map(y,0,mesh_res_y-1,0,shade_graph.height-1))
                                        );                             
      
      // get brightness
      mesh_amp = 0.25;
      brit_field[x+y*mesh_res_x] = brightness(shade_pix)*mesh_amp;
      
      // get the maximum brightness
      if(brit_field[x+y*mesh_res_x] > brit_max) {
        brit_max = brit_field[x+y*mesh_res_x];
      }
      
      //brit_field[x+y*mesh_res_x] *= (x/float(mesh_res_x));
    }
  }
  shade_graph.updatePixels();
  
  shade_graph.endDraw();
  
  scale(2.0);
  
  pointLight(205,205,255,-165.6+(0.5+0.5*sin(frameCount*0.01))*380,-130.8+(0.5+0.5*cos(frameCount*0.01))*380,100);
  pointLight(205,255,205,-165.6+(0.5+0.5*sin(frameCount*0.01+PI))*380,-130.8+(0.5+0.5*cos(frameCount*0.01+PI))*380,100);
  //lights();
  
  // draw displacement mesh
  //rotateZ(frameCount*0.001);
  noStroke();
  for(int y=0; y<mesh_res_y-1; y++) {
    beginShape(TRIANGLE_STRIP);
    texture(shade_graph);
    for(int x=0; x<mesh_res_x; x++) {
      
      float z = brit_field[x+y*mesh_res_x];
      float z1 = brit_field[x+(y+1)*mesh_res_x];
      
      float mod_amp = 90;
      
      //float x_mod = (noise(map(z,0,255,0,20),y*0.01+frameCount*0.004)-0.5)*mod_amp;
      //float x_mod1 = (noise(map(z1,0,255,0,20),(y+1)*0.01+frameCount*0.004)-0.5)*mod_amp;
      //x_mod = lerp(x_mod,0.0,0.75);
      //x_mod1 = lerp(x_mod1,0.0,0.75);
      
      //float y_mod = (noise(map(z,0,255,0,10)+frameCount*0.006+30,x*0.015+60)-0.5)*mod_amp;
      //float y_mod1 = (noise(map(z1,0,255,0,10)+frameCount*0.006+30,x*0.015+60)-0.5)*mod_amp;
      //y_mod = lerp(y_mod,0.0,0.3);
      //y_mod1 = lerp(y_mod1,0.0,0.3);
      
      vertex(-(mesh_res_x/2)+x,//+x_mod,
             -(mesh_res_y/2)+y,//+y_mod,
             z*3-185,
             map(x,0,mesh_res_x-1,0,shade_graph.width-1),
             map(y,0,mesh_res_y-1,0,shade_graph.height-1)
             );
      vertex(-(mesh_res_x/2)+x,//+x_mod1,
             -(mesh_res_y/2)+y+1,//+y_mod1, 
             z1*3-185,
             map(x,0,mesh_res_x-1,0,shade_graph.width-1),
             map(y+1,0,mesh_res_y-1,0,shade_graph.height-1)
             );
    }
    endShape();
  }
  
  // bottom
  beginShape(TRIANGLE_STRIP);
  for(int x=0; x<mesh_res_x; x++) {
    
    float z = brit_field[x+(mesh_res_y-1)*mesh_res_x];
    
    vertex(-(mesh_res_x/2)+x,
           -(mesh_res_y/2)+mesh_res_y-1,
           z*3-185
           );
    vertex(-(mesh_res_x/2)+x,
           -(mesh_res_y/2)+mesh_res_y-1,
           -185
           );
  }
  endShape();
  
  // right
  beginShape(TRIANGLE_STRIP);
  for(int y=0; y<mesh_res_y; y++) {
    
    float z = brit_field[(mesh_res_x-1)+y*mesh_res_x];
    
    vertex(-(mesh_res_x/2)+mesh_res_x-1,
           -(mesh_res_y/2)+y,
           z*3-185
           );
    vertex(-(mesh_res_x/2)+mesh_res_x-1,
           -(mesh_res_y/2)+y,
           -185
           );
  }
  endShape();
  
  // top
  beginShape(TRIANGLE_STRIP);
  for(int x=0; x<mesh_res_x; x++) {
    
    float z = brit_field[x];
    
    vertex(-(mesh_res_x/2)+x,
           -(mesh_res_y/2),
           z*3-185
           );
    vertex(-(mesh_res_x/2)+x,
           -(mesh_res_y/2),
           -185
           );
  }
  endShape();
  
  // left
  beginShape(TRIANGLE_STRIP);
  for(int y=0; y<mesh_res_y; y++) {
    
    float z = brit_field[y*mesh_res_x];
    
    vertex(-(mesh_res_x/2),
           -(mesh_res_y/2)+y,
           z*3-185
           );
    vertex(-(mesh_res_x/2),
           -(mesh_res_y/2)+y,
           -185
           );
  }
  endShape();
  
  ortho();
  
}