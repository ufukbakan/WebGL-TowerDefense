const { Vector2 } = require("three");
const modelPlacer = require("./modelPlacer");

async function spawnEnemies(scene, type, count) {
    let enemies = [];

    var boy = await modelPlacer(scene, "\\src\\Assets\\Boy.gltf", [1, 0, 1]);
    boy.scale.set(0.01, 0.01, 0.01);

    enemies.push(boy);
    console.log(enemies[0]);

    return enemies;
}

function enemyMovement(enemy, target) {

    let a = new Vector2(enemy.position.x, enemy.position.z);
    let b = new Vector2(target.position.x, target.position.z);

    var direction = Math.acos(a.dot(b) / (a.length() * b.length()));   
    
    console.log(direction*(180/Math.PI));
}

module.exports = { spawnEnemies, enemyMovement };