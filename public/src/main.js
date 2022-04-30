const { PerspectiveCamera, Scene, BoxGeometry, MeshNormalMaterial, WebGLRenderer, Mesh } = require("three");
const THREE = require("three");
const { GLTFLoader } = require("three/examples/js/loaders/GLTFLoader.js")

window.addEventListener("load", init);


function init() {
	console.log("hello world");
	const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
	camera.position.z = 1;

	const scene = new Scene();

	const geometry = new BoxGeometry(0.2, 0.2, 0.2);
	const material = new MeshNormalMaterial();

	const mesh = new Mesh(geometry, material);
	//scene.add(mesh);

	const loader = new GLTFLoader();

loader.load( 'BaseTower.glb', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

	const renderer = new WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setAnimationLoop(animation);
	document.body.appendChild(renderer.domElement);

	// animation

	function animation(time) {

		mesh.rotation.x = time / 2000;
		mesh.rotation.y = time / 1000;

		renderer.render(scene, camera);

	}
}