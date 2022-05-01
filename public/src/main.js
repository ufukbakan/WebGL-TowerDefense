const { Scene, WebGLRenderer, Color } = require("three");
const initializeCamera = require("./initializeCamera");
const loadLevel = require("./loadScene");
const { enemyMovement } = require("./spawnEnemies");

window.addEventListener("load", init);


async function init() {
	console.log("hello world");
	const camera = initializeCamera();

	const scene = new Scene();
	scene.background = new Color("#ffffff");

	loadLevel(scene);

	const renderer = new WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animation);
	document.body.appendChild(renderer.domElement);

	function animation(time) {
		//base.rotation.y = time / 1000;
		renderer.render(scene, camera);

	}
}