const modelPlacer = require("./modelPlacer");

/**
 * 
 * @param {THREE.Scene} scene 
 * @param {Number} type 
 * @param {Number} count 
 */
async function spawnEnemies(scene, type, count){
    console.log("enemy spawned");
    const boy = await modelPlacer(scene, "\\src\\Assets\\Boy.gltf", [0,0,0], [0,0,0], [0.01,0.01,0.01]);
    scene.add(boy);
}

module.exports = spawnEnemies;