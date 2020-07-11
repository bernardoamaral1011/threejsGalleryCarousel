/*

Three.js Image Caroussel

Note: post processing settings, with composers and shaders are commented,
      but required libraries are in dependencies.
*/

import gsap from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import EffectComposer, {
  RenderPass,
  ShaderPass,
} from "@johh/three-effectcomposer";

let camera, scene, renderer, controls;
let imgArray = [];
const objects = [];
let uMouse = new THREE.Vector2();
// let composer, renderPass, customPass;
// let raycaster = new THREE.Raycaster();
// let mouse = new THREE.Vector2();

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );

  /*sides, upndown, frontnback */
  camera.position.set(0, 0, 5);

  scene = new THREE.Scene();
  camera.lookAt(scene.position);

  //const material = new THREE.MeshBasicMaterial({color:0x000000,side:THREE.DoubleSide});
  const count = 27;

  // for each img in folder x create a mesh
  for (let i = 0; i < count; i++) {
    // load texture
    const texture = new THREE.TextureLoader().load(
      "http://localhost:8000/img/opf/opf-" + i + ".jpg"
    );

    texture.minFilter = THREE.LinearFilter;
    imgArray.push(new Image());

    imgArray[i].src = "http://localhost:8000/img/opf/opf-" + i + ".jpg";

    const mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
    );

    imgArray[i].onload = function () {
      // adjust these consitions to you image dimensions
      if (imgArray[i].width > 1200) {
        mesh.scale.x = imgArray[i].width / 4000;
        mesh.scale.y = imgArray[i].height / 4000;
      } else {
        mesh.scale.x = imgArray[i].width / 700;
        mesh.scale.y = imgArray[i].height / 700;
      }
    };

    const t = (i / count) * 2 * Math.PI + 2; //+2 is a shift right

    mesh.position.x = Math.cos(t) * 3.5;

    mesh.position.z = Math.sin(t) * 3.5;

    // experiment with the following for some fun results
    //
    // mesh.position.x = Math.cos(t) * 10;
    // mesh.position.z = Math.sin(t) * 4;

    scene.add(mesh);
    objects.push(mesh);
  }

  //scene.fog = new THREE.Fog( 0xffffff, 1, 1.3);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 0);
  document.body.appendChild(renderer.domElement);

  // Post Processing
  //composer = new EffectComposer(renderer);
  //renderPass = new RenderPass(scene, camera);
  //renderPass.renderToScreen = true;
  //renderPass.material.transparent = true;
  //composer.addPass(renderPass);
  //customPass = new ShaderPass(myEffect);
  //customPass.uniforms.resolution.value.set( 1 / window.innerWidth, 1 / window.innerHeight );
  //customPass.renderToScreen = true;

  //composer.addPass(customPass);

  //composer.setClearColor( 0xffffff, 0);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = Math.PI / 2;

  controls.maxPolarAngle = Math.PI / 2;
  controls.rotateSpeed = 0.05;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.enableKeys = false;

  // controls.enableDamping = true;
  // controls.rotateSpeed = 0.5;
  // controls.autoRotate = true;
  // controls.autoRotateSpeed = 0.2;
  //window.addEventListener("dblclick", onDocumentMouseDown, false);

  document.addEventListener("mousemove", onDocumentMouseMove, false);
  window.addEventListener("resize", onWindowResize, false);
}

// function onDocumentMouseDown() {
//   event.preventDefault();

//   var intersects = raycaster.intersectObjects(scene.children, true);

//   for (var i = 0; i < intersects.length; i++) {
//     gsap.to(intersects[i].object.scale, {duration:0.5, x:intersects[i].object.scale.x *1.2, y:intersects[i].object.scale.y *1.2});

//     // Block every event handler
//     // Show some text?
//     // Create an event handler to get out of this state to the normal state!
//   }
// }

//default
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//default
function onDocumentMouseMove(e) {
  event.preventDefault();
  uMouse.x = e.clientX / window.innerWidth;
  uMouse.y = 1 - e.clientY / window.innerHeight;
}

function animate() {
  requestAnimationFrame(animate);
  // raycaster.setFromCamera(mouse, camera);

  let i = 0;
  for (let object of objects) {
    i++;
    object.rotation.y = controls.getAzimuthalAngle();
    //object.lookAt( camera.position );

    let distance = Math.sqrt(
      Math.pow(camera.position.x - object.position.x, 2) +
        Math.pow(camera.position.y - object.position.y, 2) +
        Math.pow(camera.position.z - object.position.z, 2)
    );

    // this condition varies with the distance between objs and camera required
    if (distance > 5) {
      object.material.transparent = true;
      gsap.set(object.material, { opacity: 0 });
    } else {
      object.material.transparent = false;
      gsap.set(object.material, { opacity: 1 });
    }
  }

  controls.update();
  renderer.render(scene, camera);

  //scene.background = null;
  //customPass.uniforms.uMouse.value = uMouse;
  //renderer.clearDepth();
  //composer.render();
}
