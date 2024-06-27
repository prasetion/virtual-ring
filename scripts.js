import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

// canvas
const canvas = document.querySelector("canvas.webgl");
const buttonOpen = document.getElementById("open");
const buttonAll = document.getElementById("all");

// cursor
const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = -(event.clientY / sizes.height - 0.5);
  console.log(cursor.x, cursor.y);
});

// scene
const scene = new THREE.Scene();

// environtment
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/environmentMap/2k.hdr", (enviMap) => {
  enviMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = enviMap;
  scene.environment = enviMap;
});

// import gltf
const loader = new GLTFLoader();

let mixer;
let animationClips;

loader.load(
  "/models/car.glb",
  (gltf) => {
    scene.add(gltf.scene);
    mixer = new THREE.AnimationMixer(gltf.scene);
    animationClips = gltf.animations;

    // // debug
    // for (let index = 0; index < animationClips.length; index++) {
    //   console.log(animationClips[index]);
    // }
  },
  // called while loading is progressing
  (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
  // called when loading has errors
  (error) => console.log("An error happened")
);

window.addEventListener("keydown", (event) => {
  if (event.key == "h") gui.show(gui._hidden);
});

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// event listener resize
window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
});

// event listener dblclick
window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitFullscreenElement;

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
});

// event listner
buttonOpen.addEventListener("click", () => {
  const actions = mixer.clipAction(animationClips[1]);
  actions.setLoop(THREE.LoopOnce);
  actions.reset().play();
});

// event listner
buttonAll.addEventListener("click", () => {
  const actions = mixer.clipAction(animationClips[0]);
  actions.setLoop(THREE.LoopOnce);
  actions.reset().play();
});

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.01,
  1000
);

camera.position.z = 4;
camera.position.y = 1;
scene.add(camera);

// controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();

const tick = () => {
  // update controls
  controls.update();

  if (mixer) mixer.update(clock.getDelta());

  // render per frame
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
