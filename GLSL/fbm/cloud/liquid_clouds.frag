// Author: jeff huang
// draws liquid-like clouds
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

    vec3 color = vec3(0.0);
   
    color += fbm(st*2. + u_time/5. - 5.*fbm(st* 2.));
 	color -= 0.9*fbm(st * 5.0 + 1.*u_time/9.1 + 5. * fbm(st + color.rg  + u_time/10.));  
    
    color *= 5.5*color;
    color *= step(0.03, color.r*fbm(st*2. + fbm(st * 2.1) + u_time/10.));  
    
	// float pct = distance(st*0.005, vec2(0.610,-0.450)*fbm(st*0.800)*2.);
	// color = mix(vec3(0.365,0.623,0.905), (color), mix(1.0, fbm(st*2. + u_time/10.), pct)) * 1.8;   
    
    gl_FragColor = vec4(color,color.r*.85);
}
