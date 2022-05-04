const { Scene, WebGLRenderer, Color} = require("three");
const detectCollisions = require("./collisionDetector");
const initializeCamera = require("./initializeCamera");
const loadScene = require("./loadScene");

window.addEventListener("load", init);

async function init() {
	let last_time = 0;
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
		const deltaTime = (time - last_time) / 10;
		last_time = time;
		scene.traverse(
			(obj)=>{
				if(obj.userData.update){
					obj.userData.update(deltaTime);
				}
			}
		);
		detectCollisions(scene);
		renderer.render(scene, camera);
	}
}