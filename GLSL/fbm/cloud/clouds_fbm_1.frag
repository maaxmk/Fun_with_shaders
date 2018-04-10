// Author: jeff huang
// based on code from @patriciogv - 2015
// http://patriciogonzalezvivo.com


#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float seed;

uniform float scale_inc;

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
    //st.x *= u_resolution.x/u_resolution.y;

    // float pix = 200.;
    // st.x = floor(st.x * pix)/pix;
    // st.y = floor(st.y * pix)/pix;
    vec3 color = vec3(0.0);
    
    float scale = mod(2.5 + scale_inc, 5.);
    st *= scale;
    color += 2. * fbm(st*fbm(st) + u_time/5. + noise(st + seed));
    color += 2. * fbm(st*1.4 + u_time/4.3 + fbm(st));

    
    float pct = 1. - pow(distance(st/scale, vec2(0.460,0.470)), 1.2);
    // color = vec3(1.);
    color *= pow(pct, 2.0) * 3. * (abs(sin(u_time)) * .9 * noise(vec2(st.x*sin(u_time/5.2 + 2.), st.y *sin(u_time/5.) + u_time ) + fbm(st*2.)) + 0.3);
    color *= 1.8*smoothstep(0.9, 0.5, color.r);
    

    
    // color *= vec3(0.982,1.000,0.767);
    gl_FragColor = vec4(color,color.r/2.);    
}
