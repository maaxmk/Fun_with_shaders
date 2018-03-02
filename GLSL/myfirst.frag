// Author: 
// Title: 

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main() {
    vec2 p = 1.0-2.0*(gl_FragCoord.xy/u_resolution.xy);
    vec2 m = 1.0-2.0*(u_mouse.xy/u_resolution.xy);
    float t = u_time;
    float asq = abs(p.x)*abs(p.x);
    float bsq = abs(p.y)*abs(p.y);
    float d = sqrt(asq+bsq);
    float val = 160.;
    
    float col = 1.0+(val-d*d*d*1000.)+(300.-d*d*1000.)*cos(p.x*p.y*50.14+p.y*(45.+sin(t*0.24)*5.)+t);
    vec3 color = vec3(col,col,col);

    gl_FragColor = vec4(color,3.376);
}