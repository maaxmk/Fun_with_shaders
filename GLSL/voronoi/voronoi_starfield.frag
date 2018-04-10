// Author: jeff huang
// mdraws some sort of star field
// based on code from @patriciogv - 2015
// http://patriciogonzalezvivo.com

// Author: @patriciogv
// Title: CellularNoise

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

#define PI 3.14159265
#define grid_size 5


vec3 c1 = vec3(0.148,0.414,0.830);
vec3 c2 = vec3(0.850,0.288,0.313);

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

vec2 random( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
}

// Some useful functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

//
// Description : GLSL 2D simplex noise function
//      Author : Ian McEwan, Ashima Arts
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License :
//  Copyright (C) 2011 Ashima Arts. All rights reserved.
//  Distributed under the MIT License. See LICENSE file.
//  https://github.com/ashima/webgl-noise
//
float snoise(vec2 v) {

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

float manhattan(vec2 a, vec2 b)
    {    
    return abs(a.x - b.x) + abs(a.y - b.y);
}

float map(float value, float min1, float max1, float min2, float max2)
{
    return ((value - min1) / (max1 - min1)) * (max2 - min2) + min2;
}

#define OCTAVES 4
float fbm(vec2 _st)
{
    float val;
    float amp = 1.;    
    for(int i = 0; i < OCTAVES; i++)
    {
        val += amp * snoise(_st);
        _st *= 2.;
        amp *= 0.5;    
    }
    
    return val;
    
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    vec3 color = vec3(.0);

    /*
    float angle = PI/16. * u_time;
    mat2 rot = mat2(cos(angle), -sin(angle),
        sin(angle), cos(angle));
    st -= vec2(0.5);
    st *= rot;
    st += vec2(0.5);
    */
    // Scale
    
    st *= 30.;

    // Tile the space
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);

    float m_dist = 1.;  // minimun distance
    

    
    for (int y= -grid_size; y <= grid_size; y++) {
        for (int x= -grid_size; x <= grid_size; x++) {
            // Neighbor place in the grid
            vec2 neighbor = vec2(float(x),float(y));

            // Random position from current + neighbor place in the grid
            vec2 point = random2(i_st + neighbor);

            // Animate the point
            point = 0.5 + 0.5*sin(u_time*0.2+ 6.2831*point);

            // Vector between the pixel and the point
            vec2 diff = neighbor + point - f_st;

            // Distance to the point
            // float dist = distance(neighbor + point, vec2(0.5));
            float dist = manhattan(neighbor + point, f_st) *  distance(neighbor + point, vec2(0.510,0.500));

            // Keep the closer distance
            m_dist = min(m_dist, dist);
        }
    }   
    
    
    // Draw the min distance (distance field)

    
    color = vec3(1.0);

    // color.r *= fbm(color.rg + st - u_time + fbm(color.gb * st /80.)*(50. + fbm(color.b * st)));
    
    
    // color.g *= fbm(distance(color.rb, color.gr)*st/100.);
    
    vec2 q = vec2(0.);
    q.x = fbm(st + 0.01 * u_time);
    q.y = fbm(color.rb + u_time * vec2(-0.330,-0.750));
    // q *= 1./100.;
    // color.r -= q.x;
    
    float f = fbm(st/20. + q);
    
    // color *= mix(color, vec3(0.790,0.403,0.479), clamp(length(q), 0., 1.));
    // color *= mix(vec3(0.169,0.736,0.870), vec3(0.865,0.783,0.280), f * f);
    
    // color.b -= fbm(color.r * st / 100.) /10. - color.b;
    
    color *= exp(-pow(m_dist,2.*1.7) * 500.);    
        



    gl_FragColor = vec4(color,exp(-pow(m_dist,2.*.7) * 500.));
}
