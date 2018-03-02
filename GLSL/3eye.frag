// Author: 
// Title: 

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 p = -1.0+2.0*(gl_FragCoord.xy/u_resolution.xy);
    vec2 m = -1.0+2.0*(u_mouse.xy/u_resolution.xy);
    float t = u_time;
    
    float circ = 0.5+0.5*sin(t*0.1);
    float TWO_PI = 2.*(355./113.);
    vec2 pos1 = vec2(sin(0.)*circ,cos(0.)*circ);
    vec2 pos2 = vec2(sin(TWO_PI/3.)*circ,cos(TWO_PI/3.)*circ);
    vec2 pos3 = vec2(sin((TWO_PI/3.)*2.)*circ,cos((TWO_PI/3.)*2.)*circ);
    
    float asq = abs(p.x-pos1.x)*abs(p.x-pos1.x);
    float bsq = abs(p.y-pos1.y)*abs(p.y-pos1.y);
    float d1 = sqrt(asq+bsq);
    asq = abs(p.x-pos2.x)*abs(p.x-pos2.x);
    bsq = abs(p.y-pos2.y)*abs(p.y-pos2.y);
    float d2 = sqrt(asq+bsq);
    asq = abs(p.x-pos3.x)*abs(p.x-pos3.x);
    bsq = abs(p.y-pos3.y)*abs(p.y-pos3.y);
    float d3 = sqrt(asq+bsq);
    float val = 150.;
	float a = 0.0;
    
    float freq = 50.;
    float col = sin(d1*freq-t)+sin(d2*freq+t)+sin(d3*freq+t);
    
    vec3 color = vec3(col,col*0.5+sin(t)*0.2,col*0.5+cos(t)*0.4);
    gl_FragColor = vec4(color,1.);
}