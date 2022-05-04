const { Scene, WebGLRenderer, Color, BoxGeometry, MeshBasicMaterial, Mesh } = require("three");
const initializeCamera = require("./initializeCamera");
const loadScene = require("./loadScene");
const { objectWalk, objectWalkTo, spawnEnemies } = require("./spawnEnemies");

window.addEventListener("load", init);
var counter = 0;
var sceneObjects = [];

async function init() {
	console.log("hello world");
	const camera = initializeCamera();

	const scene = new Scene();
	scene.background = new Color("#ffffff");

	await loadScene(scene);

	const renderer = new WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animation);
	document.body.appendChild(renderer.domElement);

	spawnEnemies(scene, 0, 1);

	function animation(time) {
		scene.traverse(
			(obj)=>{
				if(obj.userData.update){
					obj.userData.update();
				}
			}
		);
		renderer.render(scene, camera);
	}
}