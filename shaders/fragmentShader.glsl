varying vec2 vUv;

uniform sampler2D uTexture;

void main() {
    // Sample the texture at the interpolated UV coordinates
    vec4 color = texture2D(uTexture, vUv);
    
    // Set the fragment color
    gl_FragColor = vec4(vUv, 0.0, 1.0);
}
