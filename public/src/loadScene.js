const { PointLight, Mesh, PlaneGeometry, MeshBasicMaterial, Vector3 } = require("three");
const modelPlacer = require("./modelPlacer");
const { spawnEnemies, enemyMovement } = require("./spawnEnemies");

var objects = [];
var enemies = [];

async function loadScene(scene) {

	var light = new PointLight("#fff");
	light.position.y = 100;
	scene.add(light);

	let objectZ = 1;

	const ground = new Mesh(new PlaneGeometry(5, 5), new MeshBasicMaterial({ color: 0xffff00 }));
	ground.setRotationFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
	scene.add(ground);

	objects.push(ground);

	const base = await modelPlacer(scene, "\\src\\Assets\\BaseTower.gltf", [0, 0, objectZ]);
	base.scale.set(0.01, 0.01, 0.01);

	objects.push(base);

	enemies = await spawnEnemies(scene, 0, 0);

	enemyMovement(enemies[0], objects[1]);
}

module.exports = loadScene;