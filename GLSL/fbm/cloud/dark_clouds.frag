// Author: jeff huang
// based on code from @patriciogv - 2015
// http://patriciogonzalezvivo.com

// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Value Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

#define OCTAVES 6
float fbm (in vec2 st) {
    // Initial values
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    //
    // Loop of octaves
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(st);
        st *= 2.;
        amplitude *= .5;
    }
    return value;
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;

    // st = st*2. - 1.;
    vec3 color = vec3(0.0);
 	
    float scale = 3.;
    st *= scale;
    // color += fbm(st*5. + u_time);
    // color -= 0.9 * fbm(st*2.+1.1);
 	  
    float billy = 13. * fbm(st + u_time/10. + fbm(vec2(st.x - u_time/20. + sin(u_time/24.1), st.y + u_time/20. - 1.1* sin(u_time/24.))));
    color = vec3(0.067,0.099,0.225) * billy * 0.75;
     
    
    
    // color *= step(0.13, color.r*noise(st*3.));
    gl_FragColor = vec4(color,billy * 0.8);
}
