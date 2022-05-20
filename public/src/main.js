const detectCollisions = require("./collisionDetector");
const loadScene = require("./loadScene");


window.addEventListener("load", init);

async function init() {
	let last_time = 0;

	const [scene, renderer, camera] = await loadScene();
	console.log("alican");
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