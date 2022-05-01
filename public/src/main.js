const { PerspectiveCamera, Scene, BoxGeometry, MeshNormalMaterial, WebGLRenderer, Mesh, Vector3, PointLight, Color } = require("three");
const setCameraEventListener = require("./camera_control");
const placeModel = require("./load_scene");

window.addEventListener("load", init);


async function init() {
	console.log("hello world");
	const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
	camera.position.z = 50;

	setCameraEventListener(camera);

	const scene = new Scene();
	scene.background = new Color("#ffffff");

	const geometry = new BoxGeometry(0.2, 0.2, 0.2);
	const material = new MeshNormalMaterial();
	
	const mesh = new Mesh(geometry, material);
	// scene.add(mesh);
	
	const base = await placeModel(scene, "\\src\\BaseTower.gltf", [0,0,0], [0,0,0]);
	//console.log(base);
	//window.setTimeout(()=>{console.log(base)}, 2000);
	base.scale.set(0.5,0.5,0.5);

	var light = new PointLight("#fff");
	light.position.y = 100;
	scene.add(light);

	const renderer = new WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animation);
	document.body.appendChild(renderer.domElement);

	// animation

	function animation(time) {

		//mesh.rotation.x = time / 2000;
		mesh.rotation.y = time / 1000;
		base.rotation.y = time / 1000;

		renderer.render(scene, camera);

	}
}