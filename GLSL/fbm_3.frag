// Author: 
// Title: 
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float brightness;
uniform float x_mod;

float random (in vec2 _st) { 
    return fract(sin(dot(_st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

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

#define NUM_OCTAVES 3

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(500.);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), 
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    
    vec2 st = gl_FragCoord.xy/u_resolution.xy*3.;
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm( st + 0.024*u_time + vec2(x_mod,0.0));
    q.y = fbm( st + vec2(-0.320,0.280) + vec2(x_mod,0.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + -0.288*q + vec2(0.760,0.290) + 0.874*u_time + vec2(x_mod,0.0));
    r.y = fbm( st + -0.104*q + vec2(-0.730,-0.780) + vec2(-0.720*u_time,0.0) + vec2(x_mod,0.0));

    float f = fbm(st+r+vec2(x_mod,0.0));

    float val_res = 7.352+sin(u_time*1.2)*2.0;
    f = 0.2+floor(f*val_res)/val_res;
    
    color = mix(vec3(0.916,0.931,0.950),
                vec3(0.985,0.946,0.946),
                clamp((f*f)*4.0,0.0,1.0));

    // color = mix(color,
    //             vec3(0.649,0.635,0.650),
    //             clamp(length(q),0.0,1.0));

    // color = mix(color,
    //             vec3(0.705,0.032,0.093),
    //             clamp(length(r.x),0.0,1.0));
    
    vec3 final_col = (f*f+0.376*f*f*f+0.388*f)*color+brightness;

    final_col = mix(final_col,
                    vec3(0.461,0.653,0.872),
                    0.204);

    float a = 1.0;
    //if(final_col.x<0.95) {a=0.0;}

    gl_FragColor = vec4(final_col,a);
}