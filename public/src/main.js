const detectCollisions = require("./collisionDetector");
const loadScene  = require("./loadScene");
const { lastPicked } = require("./pickingObject");


window.addEventListener("load", init);

async function init() {
	let last_time = 0;

	const [scene, renderer, camera, hudScene, hudCamera] = await loadScene();

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animation);
	document.body.appendChild(renderer.domElement);

	renderer.autoClear = false;

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

		renderer.clear();

		renderer.render(scene, camera);
		renderer.render(hudScene, hudCamera);
	}
}