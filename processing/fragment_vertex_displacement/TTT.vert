uniform mat4 transform;
uniform mat4 texMatrix;

attribute vec4 position;
attribute vec4 color;
attribute vec2 texCoord;

varying vec4 vertColor;
varying vec4 vertTexCoord;

uniform float u_time;
uniform sampler2D texture;
uniform float disp;
uniform sampler2D the_tex;


void main() {

  vec4 mod_pos = position;
  

  vertColor = vec4(1.0);
  vertTexCoord = texMatrix * vec4(texCoord, 1.0, 1.0);

  vec4 k = texture(the_tex, texCoord.st);
  //mod_pos.z += mod(mod_pos.x, 25) * disp;
  //mod_pos.z += snoise(mod_pos.xy * 0.005 + u_time/5.) *disp;
  
  //mod_pos.x += k.r * disp;
  mod_pos.z += length(k.rgb) * disp;
  //mod_pos.z += k.b * disp;

  vertColor *= k.r;
  //vertColor *= mod_pos.z/disp; 
  //vertColor += 0.5; 
  gl_Position = transform * mod_pos;
}