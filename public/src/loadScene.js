const { PointLight, Mesh, PlaneGeometry, Vector3, TextureLoader, RepeatWrapping, MeshLambertMaterial, Scene, Color,WebGLRenderer } = require("three");
const initializeCamera = require("./initializeCamera");
const modelPlacer = require("./modelPlacer");
const initPaths = require("./pathInitializer");
const { pickingObject } = require("./pickingObject");
const { spawnEnemies } = require("./spawnEnemies");

async function loadScene(canvas=undefined) {

	const scene = new Scene();
	const renderer = new WebGLRenderer({ antialias: true, canvas: canvas});
	const camera = initializeCamera();

	scene.background = new Color("#ffffff");
	var light = new PointLight("#fff");
	light.position.y = 100;
	scene.add(light);

	const textureLoader = new TextureLoader();

	let groundTexture = textureLoader.load("/src/Assets/grass2.jpg");
	groundTexture.repeat.set(10,10);
	groundTexture.wrapS = RepeatWrapping;
	groundTexture.wrapT = RepeatWrapping;

    const ground = new Mesh(new PlaneGeometry( 8, 8 ), new MeshLambertMaterial( { map: groundTexture } ));
	ground.setRotationFromAxisAngle(new Vector3(1,0,0), Math.PI/-2);
	ground.name = "Ground";
	scene.add( ground );

	pickingObject(renderer, scene, camera, "/src/Assets/Boy.gltf");
	initPaths(scene);
	spawnEnemies(scene, 0, 1);
	
	const base = await modelPlacer(scene, "\\src\\Assets\\BaseTower.gltf", [0, 0, -2], [0,0,0], [0.01,0.01,0.01]);
	base.name = "Base";

	return [scene, renderer, camera];
}

module.exports = loadScene;