const { Scene, WebGLRenderer, Color, BoxGeometry, MeshBasicMaterial, Mesh } = require("three");
const initializeCamera = require("./initializeCamera");
const loadScene = require("./loadScene");

window.addEventListener("load", init);

async function init() {
	console.log("hello world");
	const camera = initializeCamera();

	const scene = new Scene();
	scene.background = new Color("#ffffff");

	loadScene(scene);

	const renderer = new WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animation);
	document.body.appendChild(renderer.domElement);

	function animation(time) {
		scene.traverse(
			(obj)=>{
				if(obj.userData.update){
					obj.userData.update();
				}
			}
		);
		detectCollisions();
		renderer.render(scene, camera);
	}
}