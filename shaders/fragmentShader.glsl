varying vec2 vUv;
uniform vec2 uMouse;
uniform sampler2D uTexture;
uniform float uHover;

void main() {

    float blocks = 15.0;
    vec2 blockUV = floor(vUv * blocks) / blocks;
// vec2 mouse = vec2(0.5,0.5);
    float distance = length(blockUV - uMouse);
// smoothstep is a function that returns a value between 0 and 1 based on the distance between the mouse and the blockUV
    float alpha = smoothstep(0.5, 0., distance);
// if the distance is less than 0.5, then the alpha is 1, otherwise it is 0

    vec2 distortion = vec2(0.039) * alpha;

    // Sample the texture at the interpolated UV coordinates
    vec4 color = texture2D(uTexture, vUv + (distortion * uHover));

    // Set the fragment color
    // gl_FragColor = vec4(vUv*distortion, 0.0, 1.0);
    gl_FragColor = color;
}