const { lightTransforms } = require("./lightTransformation");
const { PCFShadowMap, Mesh, PlaneGeometry, Vector3, TextureLoader, RepeatWrapping, MeshLambertMaterial, Scene, Color, WebGLRenderer } = require("three");
const initializeCamera = require("./cameraInitializer");
const { modelPlacer } = require("./modelPlacer");
const initPaths = require("./pathInitializer");
const { simulateLevels } = require("./levelBuilder");
const {hudScreen} = require("./hudScreen");
const { ClonableModels } = require("./ClonableModels")

let clonableModels;

async function loadScene(canvas = undefined) {
	const scene = new Scene();
	scene.name = "WorldScene"
	const renderer = new WebGLRenderer({ antialias: true, canvas: canvas });
	const camera = initializeCamera();
	clonableModels = new ClonableModels(scene);
	await clonableModels.init();
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = PCFShadowMap;

	scene.background = new Color("#000000");

	const textureLoader = new TextureLoader();

	let groundTexture = textureLoader.load("/assets/grass.jpg");
	groundTexture.repeat.set(10, 10);
	groundTexture.wrapS = RepeatWrapping;
	groundTexture.wrapT = RepeatWrapping;

	const ground = new Mesh(new PlaneGeometry(8, 8), new MeshLambertMaterial({ map: groundTexture }));
	ground.setRotationFromAxisAngle(new Vector3(1, 0, 0), Math.PI / -2);
	ground.name = "Ground";
	ground.receiveShadow = true;
	scene.add(ground);

	initPaths(scene);
	const [hudScene, hudCamera] = hudScreen(renderer, scene, camera);

	const base = await modelPlacer(scene, "BaseTower", [-4, 0, 2], [0, 0, 0], [0.01, 0.01, 0.01], 1);
	base.userData.hp = 100;
	base.name = "Base";
	lightTransforms(scene);
	simulateLevels(scene);

	return [scene, renderer, camera, hudScene, hudCamera];
}

function getClonableModels(){
	return clonableModels.getModels();
}

module.exports = {loadScene, getClonableModels};