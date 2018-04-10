#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform vec3 base_color;

float p = 5.;

vec2 random2( vec2 p ) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(5.20,-150.0))))*43758.409);
}

float manhattan(vec2 a, vec2 b)
{
    return abs(a.x - b.x) + abs(a.y - b.y);    
}

float l_inf(vec2 a, vec2 b)
{
    return max(abs(a.x - b.x), abs(a.y - b.y));    
}

float manhattanB(vec2 a, vec2 b)
{
    return pow(abs(a.x - b.x), p*u_mouse.x/u_resolution.x) + pow(abs(a.y - b.y), p*u_mouse.y/u_resolution.y);    
}

float lp(vec2 a, vec2 b)
{
    return pow(pow(abs(a.x - b.x), p) + pow(abs(a.y - b.y), p), 1./p);    
}

void main() {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
        
    // scale
    float scale = 2.;    
    st *= scale;
    float pix = 16.160;
    // st.x = floor(st.x*pix)/pix;
    // st.y = floor(st.y*pix*u_resolution.y/u_resolution.x)/(pix*u_resolution.y/u_resolution.x);
    
    // minimum distance
    float m_dist = 1.0/0.0;
    float m_dist2 = 1.0/0.0;
    // minimum point
    vec2 m_point = vec2(0.);
    vec2 m_point2 = vec2(0.);;
    // tile the space
    //vec2 i_st = floor(vec2(distance(st, vec2(0.5))));
    //vec2 f_st = fract(vec2(distance(st, vec2(0.5))));
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
          
    vec2 point;
    for(int y = -1; y <= 1; y++)
    {
        for(int x = -1; x <= 1; x++)     
        {
            // neighboring grid
            vec2 nay = vec2(float(x), float(y));
            // vec2 nay = i_st;
            // nay.x += float(x);
            // nay.y += float(y);
            point = random2(i_st + nay);
            
            // animation
            point = 0.5 + 0.5*sin(u_time*-0.20 + 6.2831*point);            
            
            vec2 diff = nay + point - f_st;
            // float dist = length(diff);
            //float dist = mix(lp(nay+point, f_st), manhattan(nay+point, f_st), u_mouse.x/u_resolution.x);            

            //float dist = floor(manhattan(nay+point, f_st) * 50.)/50.;
            // float dist = pow(manhattan(nay+point, f_st),lp(nay+point, f_st));
            float dist = manhattan(nay+point, f_st);
          
            if(m_dist <= dist)
            {                
                
            }
            else
            {
                m_dist2 = m_dist;
                m_dist = dist;  

                m_point2 = m_point;             
                m_point = point;
            }
        }
        
    }   
        
    vec3 color = vec3(0.);
    
    //color.gr = m_point;
    //color *= m_dist *2.;

    //color.gr = mix(m_point, vec2(m_dist), -0.408);
    //color.rb = mix(m_point, vec2(m_dist), -0.408);

     color = vec3(smoothstep(abs(m_dist - m_dist2), 0.308, 0.188));

    //color = mix( vec3(1.), color, smoothstep( 0.01, 0.02, m_dist ) );
    //iso lines
    // color *= 1. - m_dist*(0.5 + 0.5*sin(64.0*m_dist))*vec3(1.0);
    //iso lines
    // color -= fract(sin(55.624*m_dist))*0.142;
    // vec3 color2 = color;
    // color2.rg = mix(m_point*0.704, -0.2*vec2(m_dist), -0.744);
    // color *= ;
    
   
    
    gl_FragColor = vec4(color,1.);
}
