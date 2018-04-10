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

    // float pix = 100.;
    // st.x = floor(st.x * pix)/pix;
    // st.y = floor(st.y * pix)/pix;
    vec3 color = vec3(0.0);
 
    st *= 5.;
	color += 2. * fbm(st + u_time/5.);
    color += fbm(st*1.5 + u_time /10. + noise(st + u_time/20.));
    // color += fbm(st + u_time + noise(st + u_time/2.) + color.rg);
    // color *= 15.* noise(st*.2 + u_time/sin(u_time/100.)) * noise(st * .5 - u_time);
    color *= 15. * noise(st * .2 + u_time/4. + fbm(st));

    // for islands
	color *= smoothstep(color.r, .59, 0.5);
    // clouds
    // color -= smoothstep(color.r, .5, 0.5);
    // color *= smoothstep(color.r, 0.5, noise(st) *0.2 +0.5);
    
    // float post = 3.;
    // color.r = floor(color.r * post)/post;
    // color.g = floor(color.g * post)/post;
    // color.b = floor(color.b * post)/post;
    
    // color *= vec3(0.618,0.910,0.168);
    
    // float pct = step(0.5, color.r);
    float pct = smoothstep(0.0, .9, color.r);
    color *= (1.0 - pct) * vec3(0.013,0.185,0.810) + pct * vec3(0.337,0.430,0.187);
    
    float pctb = smoothstep(0.0, .9, color.b);
    color += 0.3*(1.0 - pctb) * vec3(0.013,0.185,0.810);
    color += pctb * vec3(0.847,0.935,0.376);
    
    gl_FragColor = vec4(color,1.0);
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}
