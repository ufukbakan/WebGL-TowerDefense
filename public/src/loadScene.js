const { lightTransforms } = require("./lightTransformation");
const { PointLight, PCFShadowMap, Mesh, PlaneGeometry, Vector3, TextureLoader, RepeatWrapping, MeshLambertMaterial, Scene, Color, WebGLRenderer } = require("three");
const hudScreen = require("./hudScreen");
const initializeCamera = require("./initializeCamera");
const { modelPlacer, scenes } = require("./modelPlacer");
const initPaths = require("./pathInitializer");
const { pickingObject } = require("./pickingObject");
const { spawnEnemies } = require("./spawnEnemies");


async function loadScene(canvas = undefined) {
	const scene = new Scene();
	scene.name = "WorldScene"
	const renderer = new WebGLRenderer({ antialias: true, canvas: canvas });
	const camera = initializeCamera();
	scenes.mainScene = scene;

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = PCFShadowMap;

	scene.background = new Color("#000000");

	const textureLoader = new TextureLoader();

	let groundTexture = textureLoader.load("/src/Assets/grass2.jpg");
	groundTexture.repeat.set(10, 10);
	groundTexture.wrapS = RepeatWrapping;
	groundTexture.wrapT = RepeatWrapping;

	const ground = new Mesh(new PlaneGeometry(8, 8), new MeshLambertMaterial({ map: groundTexture }));
	ground.setRotationFromAxisAngle(new Vector3(1, 0, 0), Math.PI / -2);
	ground.name = "Ground";
	ground.receiveShadow = true;
	scene.add(ground);

	initPaths(scene);
	spawnEnemies(scene, 0, 2, 100);
	const [hudScene, hudCamera] = hudScreen(renderer, scene, camera);

	const base = await modelPlacer(scene, "BaseTower", [0, 0, -2], [0, 0, 0], [0.01, 0.01, 0.01], 1);
	base.name = "Base";
	lightTransforms(scene);

	return [scene, renderer, camera, hudScene, hudCamera];
}

module.exports = loadScene;