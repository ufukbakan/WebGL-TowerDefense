const detectCollisions = require("./collisionDetector");
const { loadScene } = require("./sceneLoader.js");

window.addEventListener("load", init);

async function init() {
	let last_time = 0;

	const root = document.getElementById("root");
	const canvas = document.createElement("canvas");
	canvas.width = document.body.clientWidth;
	canvas.height = window.innerHeight;
	canvas.style.maxWidth = canvas.width + "px !important";
	root.appendChild(canvas);
	const [scene, renderer, camera, hudScene, hudCamera] = await loadScene(canvas);

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animation);

	renderer.autoClear = false;

	function animation(time) {
		const deltaTime = (time - last_time) / 10;
		last_time = time;

		try {
			scene.traverse(
				(obj) => {
					if (obj.userData.update) {
						obj.userData.update(deltaTime);
					}
				}
			);
		}catch(e){

		}
		detectCollisions(scene);

		renderer.clear();

		renderer.render(scene, camera);
		renderer.render(hudScene, hudCamera);
	}
}