// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
    return 1.-smoothstep(_radius-(_radius*-0.374),
                         _radius+(_radius*-1.078),
                         dot(dist,dist)*4.216);
}

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // st.x *= u_resolution.x/u_resolution.y;
    float pix =50.*2.;
    // st.x = floor(st.x*pix)/pix;
    // st.y = floor(st.y*pix*u_resolution.y/u_resolution.x)/(pix*u_resolution.y/u_resolution.x);
    // vec2 i_st = floor(st);
    // vec2 f_st = fract(st);
    
    vec3 color = vec3(1.0)*abs(sin(2.*3.212*6.136*length(st-vec2(0.5))+u_time)) * 0.5/length(st-vec2(0.5));
    
    // color *= vec3(mix(snoise(st*mix(10.,sin(-u_time+st.x)+1., 0.228)+1./10.*(u_time)), 1., 0.148));
    
    //color = vec3(mix(snoise(st), color.r, 2.*snoise(vec2( abs((u_time/20.))))));
    
    // color *= smoothstep(0.1, 0.372, color.x);
    // color *= 1.-step(0.476, pow(distance(st, random2(st)), 1.048) );
    
    // color *= smoothstep(0.1, 1.632, color.x)+circle(st, 0.024);
    // color = vec3(circle(st, 0.024));
    // color.r += step(0.932, f_st.x) + step(.98, f_st.y);
    gl_FragColor = vec4( color, mix(color.r, abs(sin(u_time)), 0.5) );
}
