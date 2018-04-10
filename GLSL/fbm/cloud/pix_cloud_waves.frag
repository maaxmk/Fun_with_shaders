// Author: jeff huang
// draws some sort of cloud/seafoam thing
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

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
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

     float pix = 150.;
    st.x = floor(st.x * pix)/pix;
    st.y = floor(st.y * pix)/pix;
    
    vec3 color = vec3(0.0);
 
    // color += fbm(st*5. + u_time);
    // color -= 0.9 * fbm(st*2.+1.1);
 	color += fbm(st*5. - 1.55*fbm(st*10.+u_time/3.) + 1. *u_time/12. - 2. + fbm(2.*st-u_time/10.));
 	color -= 0.9*fbm(st * 2.5 + 1.*u_time/9.1 + 5. * fbm(st + color.rg  + u_time/10.));
    
    
    // color *= 1. - smoothstep(fbm(color.rg + st), fbm(0.360*st + color.rg), fbm(st*5.+u_time/100.));
    
    
    color *= 5.5*color;
    color *= step(0.13, color.r*noise(st*3.));
    
    
    // color *= smoothstep(color.r, noise(color.gb), fbm(st*0.5+u_time/5.));
    // float pct = 0.09;
    float pct = distance(st*0.005, vec2(0.610,-0.450)*fbm(st*0.800)*2.);
	color = mix(vec3(0.365,0.623,0.905), (color), mix(1.0, fbm(st*2. + u_time/10.), pct)) * 1.8;
    // color = mix(vec3(0.700,0.132,0.112), (color), pct) * mix(1.0, fbm(st*.5 + u_time/10.), pct) * 2.;
    
    float post = 10.;
    color.r = floor(color.r * post)/post;
    color.g = floor(color.g * post)/post;
    color.b = floor(color.b * post)/post;
    
    // color *= step(0.13, color.r*noise(st*3.));
    gl_FragColor = vec4(color,color.b);
}
