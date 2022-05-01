const { PerspectiveCamera, Scene, BoxGeometry, MeshNormalMaterial, WebGLRenderer, Mesh, Vector3, PointLight, Color, PlaneGeometry, MeshBasicMaterial, DoubleSide } = require("three");
const setCameraEventListener = require("./camera_control");
const placeModel = require("./load_scene");

window.addEventListener("load", init);


async function init() {
	console.log("hello world");
	const camera = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.01, 100);
	camera.position.z = 50;

	setCameraEventListener(camera);

	const scene = new Scene();
	scene.background = new Color("#ffffff");

	const ground = new Mesh(new PlaneGeometry( 50, 50 ), new MeshBasicMaterial( {color: 0xffff00} ));
	ground.setRotationFromAxisAngle(new Vector3(1,0,0), -Math.PI/2);
	scene.add( ground );
	
	const base = await placeModel(scene, "\\src\\BaseTower.gltf", [0,0,0], [0,0,0]);
	//console.log(base);
	//window.setTimeout(()=>{console.log(base)}, 2000);
	base.scale.set(0.5,0.5,0.5);
	console.log(base.position);

	var light = new PointLight("#fff");
	light.position.y = 100;
	scene.add(light);

	const renderer = new WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animation);
	document.body.appendChild(renderer.domElement);

	function animation(time) {
		base.rotation.y = time / 1000;
		renderer.render(scene, camera);

	}
}