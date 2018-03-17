
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
    vec2 st = gl_FragCoord.xy/u_resolution;
    float pct = 0.0;
    //st.x += -u_resolution.x/u_resolution.y*-0.25;
    //st.x *= u_resolution.x/u_resolution.y;
    float pix =50.*0.5;
    st.x = floor(st.x*pix)/pix;
    st.y = floor(st.y*pix*u_resolution.y/u_resolution.x)/(pix*u_resolution.y/u_resolution.x);
    // a. The DISTANCE from the pixel to the center
    pct = 1.-pow(distance(st,vec2(0.5)), 0.804);

    // b. The LENGTH of the vector
    //    from the pixel to the center
    // vec2 toCenter = vec2(0.5)-st;
    // pct = length(toCenter);

    // c. The SQUARE ROOT of the vector
    //    from the pixel to the center
    // vec2 tC = vec2(0.5)-st;
    // pct = sqrt(tC.x*tC.x+tC.y*tC.y);

    vec3 color = vec3(pow(pct, 3.864)*abs(sin(u_time)));

    gl_FragColor = vec4( color,1. );
}