varying vec2 vUv;

void main() {
    // Pass the UV coordinates to the fragment shader
    vUv = uv;
    
    // Calculate the position of the vertex in clip space
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewPosition;
}
