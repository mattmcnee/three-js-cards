// Import necessary Three.js modules
import './style.css';
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setClearColor(0x000000, 0);
camera.position.z = 10;

// Create a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x009900});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Set up variables for circular motion
const radius = 6; // Radius of the circular path
const angularSpeed = 2; // Angular speed (controls the speed of rotation)

// ... (previous code)

// Initialize a flag to keep track of whether x is at its max or min
let xMaxReached = false;
let xMinReached = false;

// Create an animation loop
const animate = () => {
  requestAnimationFrame(animate);

  // Update the cube's position in a circular path
  const time = Date.now() * 0.001; // Get current time in seconds
  const posX = Math.cos(time * angularSpeed) * radius;
  const posZ = Math.sin(time * angularSpeed) * radius;
  cube.position.set(posX, 0, posZ);

  // Check if x has reached its maximum or minimum value
  if (posX+0.01 >= radius && !xMaxReached) {
    console.log("X has reached its maximum value.");
    xMaxReached = true;
    xMinReached = false; // Reset the min flag
    renderer.domElement.style.zIndex = '3';
  } else if (posX-0.01 <= -radius && !xMinReached) {
    console.log("X has reached its minimum value.");
    xMinReached = true;
    xMaxReached = false; // Reset the max flag
    renderer.domElement.style.zIndex = '1';
  }

  renderer.render(scene, camera);
};

// Start the animation
animate();


