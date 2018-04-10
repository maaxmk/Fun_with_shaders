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
    
    float circ = 0.6;
    float TWO_PI = 2.*(355./113.);
    float rot = t*0.015;
    vec2 pos1 = vec2( sin(rot)*circ                 , cos(rot)*circ                  );
    vec2 pos2 = vec2( sin(TWO_PI/6.-rot) * circ     , cos(TWO_PI/6.-rot) * circ      );
    vec2 pos3 = vec2( sin((TWO_PI/6.)*2.+rot) * circ, cos((TWO_PI/6.)*2.+rot) * circ );
    vec2 pos4 = vec2( sin((TWO_PI/6.)*3.-rot) * circ, cos((TWO_PI/6.)*3.-rot) * circ );
    vec2 pos5 = vec2( sin((TWO_PI/6.)*4.+rot) * circ, cos((TWO_PI/6.)*4.+rot) * circ );
    vec2 pos6 = vec2( sin((TWO_PI/6.)*5.-rot) * circ, cos((TWO_PI/6.)*5.-rot) * circ );
    
    float asq = abs(p.x-pos1.x)*abs(p.x-pos1.x);
    float bsq = abs(p.y-pos1.y)*abs(p.y-pos1.y);
    float d = sqrt(asq+bsq);
    asq = abs(p.x-pos2.x)*abs(p.x-pos2.x);
    bsq = abs(p.y-pos2.y)*abs(p.y-pos2.y);
    float d2 = sqrt(asq+bsq);
    asq = abs(p.x-pos3.x)*abs(p.x-pos3.x);
    bsq = abs(p.y-pos3.y)*abs(p.y-pos3.y);
    float d3 = sqrt(asq+bsq);
    asq = abs(p.x-pos4.x)*abs(p.x-pos4.x);
    bsq = abs(p.y-pos4.y)*abs(p.y-pos4.y);
    float d4 = sqrt(asq+bsq);
    asq = abs(p.x-pos5.x)*abs(p.x-pos5.x);
    bsq = abs(p.y-pos5.y)*abs(p.y-pos5.y);
    float d5 = sqrt(asq+bsq);
    asq = abs(p.x-pos6.x)*abs(p.x-pos6.x);
    bsq = abs(p.y-pos6.y)*abs(p.y-pos6.y);
    float d6 = sqrt(asq+bsq);
    float val = 150.;
	float a = 0.0;
    
    float freq = 50.;
    float col = 1.0+(val-d*d*d*1000.)+(300.-d*d*1000.)*cos(p.x*p.y*50.14+p.y*(45.+sin(t*0.24)*5.)+t);
    float col2 = 1.0+(val-d2*d2*d2*1000.)+(300.-d2*d2*1000.)*cos(p.x*p.y*50.14+p.y*(45.+sin(t*0.24)*5.)+t);
    float col3 = 1.0+(val-d3*d3*d3*1000.)+(300.-d3*d3*1000.)*cos(p.x*p.y*50.14+p.y*(45.+sin(t*0.24)*5.)+t);
    
    vec3 color = vec3(col,col2*0.5+sin(t)*0.2,col3*0.5+cos(t)*0.4);
    gl_FragColor = vec4(color,1.);
}