const { TextureLoader } = require("three");
const { RepeatWrapping } = require("three");
const { MeshLambertMaterial } = require("three");
const { PointLight, Mesh, PlaneGeometry, MeshBasicMaterial, Vector3 } = require("three");
const modelPlacer = require("./modelPlacer");
const { spawnEnemies } = require("./spawnEnemies");

async function loadScene(scene) {

	var light = new PointLight("#fff");
	light.position.y = 100;
	scene.add(light);

	const textureLoader = new TextureLoader();

	let groundTexture = textureLoader.load("/src/Assets/Grass2.jpg");
	groundTexture.repeat.set(50,50);
	groundTexture.wrapS = RepeatWrapping;
	groundTexture.wrapT = RepeatWrapping;

    const ground = new Mesh(new PlaneGeometry( 8, 8 ), new MeshLambertMaterial( { map: groundTexture } ));
	ground.setRotationFromAxisAngle(new Vector3(1,0,0), Math.PI/-2);
	scene.add( ground );

	spawnEnemies(scene, 0, 0);
	
	const base = await modelPlacer(scene, "\\src\\Assets\\BaseTower.gltf", [0, 0, -2], [0,0,0], [0.01,0.01,0.01]);
}

module.exports = loadScene;