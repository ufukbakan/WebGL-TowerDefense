const { Vector2, Vector3 } = require("three");
const modelPlacer = require("./modelPlacer");

const ONE_DEGREE = Math.PI / 180;
const ENEMY_SPAWN_POS = [-2, 0, -2];

/**
 * 
 * @param {THREE.Scene} scene 
 * @param {Number} type 
 * @param {Number} count 
 */
async function spawnEnemies(scene, type, count) {
    if (count > 0) {
        if (type == 0) {
            let boy = await modelPlacer(scene, "\\src\\Assets\\Boy.gltf", ENEMY_SPAWN_POS, [0, 0, 0], [0.01, 0.01, 0.01]);
            boy.userData.speed = 0.003;
            boy.userData.update = updateEnemy.bind(null, boy);
        }
        setTimeout(()=>spawnEnemies(scene, type, count-1), 500);
    }
}

/**
 * 
 * @param {THREE.Object3D} enemy 
 */
function updateEnemy(enemy, deltaTime) {
    objectWalk(enemy, false, deltaTime);
}

function betweenDirection(object, target) {
    let a = new Vector2(object.position.x, object.position.z);
    let b = new Vector2(target.position.x, target.position.z);

    let direction = new Vector2(b.x - a.x, b.y - a.y);

    return direction;
}

function returnAngle(direction) {
    return Math.atan2(direction.y, direction.x) * 180 / Math.PI;
}

/**
 * 
 * @param {THREE.Object3D} object 
 */
function objectWalkTo(object, target, lerp = true, deltaTime) {
    let angle = returnAngle(betweenDirection(object, target));

    if (lerp) {
        object.position.lerp(new Vector3(object.position.x + speed * Math.cos(angle * ONE_DEGREE), 0, object.position.z + speed * Math.sin(angle * ONE_DEGREE)), 0.5);
    } else {
        object.position.x += speed * Math.cos(angle * ONE_DEGREE)*deltaTime;
        object.position.z += speed * Math.sin(angle * ONE_DEGREE)*deltaTime;
    }

    object.lookAt(target.position);
}

/**
 * 
 * @param {THREE.Object3D} object 
 * @param {boolean} lerp 
 */
function objectWalk(object, lerp = false, deltaTime) {

    let angle = object.userData.angle;

    if (lerp) {
        object.position.lerp(new Vector3(object.position.x + speed * Math.cos(angle * ONE_DEGREE), 0, object.position.z - speed * Math.sin(angle * ONE_DEGREE)), 0.5);
    } else {
        object.position.x += object.userData.speed * Math.cos(angle * ONE_DEGREE)*deltaTime;
        object.position.z -= object.userData.speed * Math.sin(angle * ONE_DEGREE)*deltaTime;
    }

    object.rotation.y = (angle + 90) * ONE_DEGREE;
}

module.exports = { spawnEnemies, objectWalk, objectWalkTo };