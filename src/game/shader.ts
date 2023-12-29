export const VertexShader = `
varying vec2 coord;
varying vec4 pos;
void main() {
    coord = gl_TexCoord.xy;
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
    pos = gl_Position;
}
`

export const FragmentShader = `

// uniforms
uniform sampler2D texture;
uniform float factor;
uniform float over;
uniform vec2 sky;

varying vec2 coord;
varying vec4 pos;

float fogf(float d) {
    const float LOG2 = -1.442695;
    return 1.0 - clamp(exp2(d*d*LOG2), 0.0, 1.0);
}

void main() {
    vec4 os = texture2D(texture, coord);
    vec4 ms = texture2D(texture, coord + vec2(0.0, 0.25));
    os = mix(os, ms, factor);
    if(os.a < 0.8) discard;
    float fog = fogf(gl_FragCoord.z/gl_FragCoord.w * 0.5);
    float d = (1.0 / distance(vec4(0.0, 0.0, 0.0, 0.0), pos)) * (over - 1.0);
    gl_FragColor = mix(os, vec4(sky.x, 0.26, sky.y, 1.0), fog) + (vec4(0.87, 0.46, 0.051, 1.0) * d);
    if(os.r > 0.9 && os.g > 0.9) gl_FragColor = os;
}
`
