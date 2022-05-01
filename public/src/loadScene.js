const { PointLight, Mesh, PlaneGeometry, MeshBasicMaterial, Vector3 } = require("three");
const modelPlacer = require("./modelPlacer");

async function loadScene(scene){

	var light = new PointLight("#fff");
	light.position.y = 100;
	scene.add(light);

	let objectZ = 1;

    const ground = new Mesh(new PlaneGeometry( 5, 5 ), new MeshBasicMaterial( {color: 0xffff00} ));
	ground.setRotationFromAxisAngle(new Vector3(1,0,0), -Math.PI/2);
	scene.add( ground );

	const boy = await modelPlacer(scene, "\\src\\Assets\\Boy.gltf", [0,0,objectZ]);
	boy.scale.set(0.001,0.001,0.001);
	
	const base = await modelPlacer(scene, "\\src\\Assets\\BaseTower.gltf", [0,0,objectZ]);
	base.scale.set(0.001,0.001,0.001);
}

module.exports = loadScene;