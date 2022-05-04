const { Scene, WebGLRenderer, Color, BoxGeometry, MeshBasicMaterial, Mesh } = require("three");
const initializeCamera = require("./initializeCamera");
const loadScene = require("./loadScene");
const { objectWalk, objectWalkTo } = require("./spawnEnemies");

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

	// const geometry = new BoxGeometry( 1, 1, 1 );
	// const material = new MeshBasicMaterial( {color: 0x00ff00} );
	// const cube = new Mesh( geometry, material );
	// scene.add( cube );
	// cube.scale.set(0.1,0.1,0.1);
	// cube.position.set(objects[1].position.x, objects[1].position.y, objects[1].position.z + 0.5);

	function animation(time) {

		// if (counter <= time) {

		// 	counter = time + 100;
		// }

		renderer.render(scene, camera);
	}
}