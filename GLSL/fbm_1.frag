// Author: 
// Title: 
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float brightness;

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

#define NUM_OCTAVES 5

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
    q.x = fbm( st + sin(-0.288*u_time)*0.0001*u_time);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.05*u_time );
    r.y = fbm( st + 5.0*q + vec2(8.3,6.8)+ -0.600*u_time);

    float f = fbm(st+r);

    color = mix(vec3(0.916,0.931,0.950),
                vec3(0.985,0.946,0.946),
                clamp((f*f)*4.0,0.0,1.0));

    // color = mix(color,
    //             vec3(0.649,0.635,0.650),
    //             clamp(length(q),0.0,1.0));

    // color = mix(color,
    //             vec3(0.705,0.032,0.093),
    //             clamp(length(r.x),0.0,1.0));
    
    vec3 final_col = (f*f+.6*f*f*f+.5*f)*color+brightness;

    final_col = mix(final_col,
                    vec3(0.0,0.0,1.0),
                    0.1);

    gl_FragColor = vec4(final_col,1.);
}