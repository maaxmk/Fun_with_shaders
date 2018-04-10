#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif

uniform sampler2D texture;
uniform float pixelize = 500.0;
uniform bool isPixelize = false;
uniform vec2 u_resolution;

varying vec4 vertColor;
varying vec4 vertTexCoord;



void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st.x *= u_resolution.x/u_resolution.y;

  gl_FragColor = mix(texture(texture, vertTexCoord.st), vertColor, 0.5);
  gl_FragColor = vec4(mix(st.x, vertColor.y, vertColor.x), st.y, 1.0-st.y, 1.0) * 1.8*vertColor;
  //gl_FragColor.rgb = floor(gl_FragColor.rgb*5.)/5.;
  gl_FragColor.a = 1.;

  //gl_FragColor = vertColor;
}