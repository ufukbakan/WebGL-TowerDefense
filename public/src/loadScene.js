const { PointLight, Mesh, PlaneGeometry, MeshBasicMaterial, Vector3, BoxGeometry } = require("three");
const modelPlacer = require("./modelPlacer");
const { spawnEnemies } = require("./spawnEnemies");

async function loadScene(scene) {

	var light = new PointLight("#fff");
	light.position.y = 100;
	scene.add(light);

	const ground = new Mesh(new PlaneGeometry(5, 5), new MeshBasicMaterial({ color: 0xffff00 }));
	ground.setRotationFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
	scene.add(ground);

	const base = await modelPlacer(scene, "\\src\\Assets\\BaseTower.gltf", [0, 0, 0]);
	base.scale.set(0.01, 0.01, 0.01);

	await spawnEnemies(scene, 0, 1, [0, 0, 0]);
}

module.exports = loadScene;