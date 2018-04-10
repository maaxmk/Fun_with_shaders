// Author @patriciogv - 2015
// http://patriciogonzalezvivo.com

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float seed;
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

    // float pix = 200.;
    // st.x = floor(st.x * pix)/pix;
    // st.y = floor(st.y * pix)/pix;
    vec3 color = vec3(0.0);
    
    float scale = 10.75;
    st *= scale;
	
    color += 2. * noise(st/1.*fbm(st/5.) + u_time/2. + noise(st/10. + seed));
    color += 2. * noise(st/10. + u_time/2.3 + fbm(st));
    
    
    float pct = 1. - abs(sin(2.*3.14*10.112*pow(length(st/scale-vec2(0.520,-0.410)), 0.628)-u_time*2. + 0.5 *abs(sin(u_time*5.))));
    pct *= 1. - length(st/scale-vec2(0.5));
    pct *= abs(sin(u_time)) + .35;
    float post = 5.;
    color.r = floor(color.r * post)/post;
    color.g = floor(color.g * post)/post;
    color.b = floor(color.b * post)/post;
    // color = vec3(1.);
    color *= pct;
    color *= vec3(0.355,0.744,1.000) *5.;
    gl_FragColor = vec4(color,color.r);
    
    
    
    
}
