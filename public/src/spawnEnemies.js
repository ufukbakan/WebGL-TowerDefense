const modelPlacer = require("./modelPlacer");

async function spawnEnemies(scene, type, count){
    const boy = await modelPlacer(scene, "\\src\\Assets\\Boy.gltf", [0,0,1]);
	boy.scale.set(0.001,0.001,0.001);
}

module.exports = spawnEnemies;