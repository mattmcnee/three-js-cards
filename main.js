// Import necessary Three.js modules
import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.z = 10;


let loadedModel;
const gltfLoader = new GLTFLoader();
gltfLoader.load('enterprise.glb', (gltf) => {
  loadedModel = gltf.scene;
  loadedModel.scale.set(0.1, 0.1, 0.1);
  scene.add(loadedModel);
  createLights();
});


const center = new THREE.Vector3(0, 0, 0);


const lights = [];
function createLights() {
  // Create a point light source
  const numLights = 6;
  const lightDistance = 4;
  for (let i = 0; i < numLights; i++) {
    const phi = Math.acos(-1 + (2 * i) / numLights); // Angle from top to bottom
    const theta = Math.sqrt(numLights * Math.PI * 2) * phi; // Angle around the sphere

    const light = new THREE.PointLight(0xffffff, 20);

    // Calculate the position using spherical coordinates
    light.position.x = center.x + lightDistance * Math.cos(theta) * Math.sin(phi);
    light.position.y = center.y + lightDistance * Math.sin(theta) * Math.sin(phi);
    light.position.z = center.z + lightDistance * Math.cos(phi);

    scene.add(light);

    // Make each light point at the cube
    light.target = loadedModel;
    lights.push(light);
  }
}

function updateLightPositions() {
  const center = loadedModel.position.clone();
  const numLights = 6;
  const lightDistance = 4;

  for (let i = 0; i < lights.length; i++) {

    const phi = Math.acos(-1 + (2 * i) / numLights); // Angle from top to bottom
    const theta = Math.sqrt(numLights * Math.PI * 2) * phi; // Angle around the sphere

    // Calculate the position using spherical coordinates
    lights[i].position.x = center.x + lightDistance * Math.cos(theta) * Math.sin(phi);
    lights[i].position.y = center.y + lightDistance * Math.sin(theta) * Math.sin(phi);
    lights[i].position.z = center.z + lightDistance * Math.cos(phi);
  }
}






// Set up variables for circular motion
const radius = 6; // Radius of the circular path
const angularSpeed = 1; // Angular speed (controls the speed of rotation)

// ... (previous code)

// Initialize a flag to keep track of whether x is at its max or min
let xMaxReached = false;
let xMinReached = false;

// Create an animation loop
const animate = () => {
  requestAnimationFrame(animate);

  if (loadedModel) {
      // Update the cube's position in a circular path
  const time = Date.now() * 0.001; // Get current time in seconds
  const posX = Math.cos(time * angularSpeed) * radius;
  const posZ = Math.sin(time * angularSpeed) * radius;
  loadedModel.position.set(posX, 0, posZ);
  loadedModel.lookAt(center);
  const fromAbove = new THREE.Quaternion();
  fromAbove.setFromEuler(new THREE.Euler(-Math.PI/2, 0, 0));
  loadedModel.quaternion.multiply(fromAbove);

  // Check if x has reached its maximum or minimum value
  if (posX+0.01 >= radius && !xMaxReached) {
    xMaxReached = true;
    xMinReached = false; // Reset the min flag
    renderer.domElement.style.zIndex = '3';
  } else if (posX-0.01 <= -radius && !xMinReached) {
    xMinReached = true;
    xMaxReached = false; // Reset the max flag
    renderer.domElement.style.zIndex = '1';
  }
  updateLightPositions()
  }



  renderer.render(scene, camera);
};

// Start the animation
animate();


