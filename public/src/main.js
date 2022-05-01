const { Scene, BoxGeometry, MeshNormalMaterial, WebGLRenderer, Mesh } = require("three");
const initializeCamera = require("./initializeCamera");

window.addEventListener("load", init);

function init() {

	const camera = initializeCamera();

	const scene = new Scene();

	const geometry = new BoxGeometry(0.2, 0.2, 0.2);
	const material = new MeshNormalMaterial();

	const mesh = new Mesh(geometry, material);
	scene.add(mesh);

	const renderer = new WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animation);
	document.body.appendChild(renderer.domElement);

	function animation(time) {
		//mesh.rotation.x = time / 2000;
		mesh.rotation.y = time / 1000;
		renderer.render(scene, camera);

	}
}