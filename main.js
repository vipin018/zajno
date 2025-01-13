import LocomotiveScroll from 'locomotive-scroll';
import * as THREE from 'three';
import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';
import gsap from 'gsap';

const scroll = new LocomotiveScroll();
// Create the scene
const scene = new THREE.Scene();

// Calculate the field of view based on the window height and camera distance and convert to degrees 
let distance = 20;
let fov = 2 * Math.atan((window.innerHeight / 2) / distance) * 180 / Math.PI;
// Create a camera, which determines what we'll see when we render the scene
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = distance;

// Create a renderer and attach it to our document
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas'),
  alpha: true
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// Add orbit controls to allow for camera movement
// const controls = new OrbitControls(camera, renderer.domElement);
const images = document.querySelectorAll('img');
const planes = [];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

images.forEach(image => {
  const imgBounds = image.getBoundingClientRect();
  const texture = new THREE.TextureLoader().load(image.src);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 }
    }
  });

  const geometry = new THREE.PlaneGeometry(imgBounds.width, imgBounds.height);
  const plane = new THREE.Mesh(geometry, material);
  plane.position.set(imgBounds.left - window.innerWidth / 2 + imgBounds.width / 2, -imgBounds.top + window.innerHeight / 2 - imgBounds.height / 2, 0);
  planes.push(plane);
  scene.add(plane);
});

function updatePlanePosition(){
  planes.forEach((plane,index)=>{
    const image = images[index];
    const imgBounds = image.getBoundingClientRect();
    plane.position.set(imgBounds.left - window.innerWidth / 2 + imgBounds.width / 2, -imgBounds.top + window.innerHeight / 2 - imgBounds.height / 2, 0);
  })
}

// Create an animation loop to render the scene
function animate() {
  requestAnimationFrame(animate);
  // Required if controls.enableDamping or controls.autoRotate are set to true
  // controls.update();
  updatePlanePosition();
  
  renderer.render(scene, camera);
}

// Start the animation loop
animate();

// Handle window resize
window.addEventListener('resize', () => {
  distance = 20;
  fov = 2 * Math.atan((window.innerHeight / 2) / distance) * 180 / Math.PI;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updatePlanePosition();
});

window.addEventListener('mousemove', (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / window.innerWidth) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planes);

  planes.forEach((plane)=>{
    plane.material.uniforms.uHover.value = 0;
  });


  if (intersects.length > 0) {
    const intersectedPlane = intersects[0];
    const uv = intersectedPlane.uv;
    intersectedPlane.object.material.uniforms.uMouse.value.set(uv.x, uv.y);
    intersectedPlane.object.material.uniforms.uHover.value = 1;
  }
  
});
