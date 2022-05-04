const { Vector2, Vector3 } = require("three");
const modelPlacer = require("./modelPlacer");

const ONE_DEGREE = Math.PI / 180;
var speed = 0.03;

/**
 * 
 * @param {*} scene 
 * @param {*} type 
 * @param {*} count 
 * @param {Vector3} pos 
 * @param {*} isRandom 
 * @param {*} randomFactor 
 * @returns 
 */
async function spawnEnemies(scene, type, count, pos) {
    for (let i = 0; i < count; i++) { //rastgele instantiate etme implemente edilmedi
        let boy = await modelPlacer(scene, "\\src\\Assets\\Boy.gltf", pos);
        boy.scale.set(0.01, 0.01, 0.01);
    }
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
function objectWalkTo(object, target, lerp = true) {
    let angle = returnAngle(betweenDirection(object, target));

    if (lerp) {
        object.position.lerp(new Vector3(object.position.x + speed * Math.cos(angle * ONE_DEGREE), 0, object.position.z + speed * Math.sin(angle * ONE_DEGREE)), 0.5);
    } else {
        object.position.x += speed * Math.cos(angle * ONE_DEGREE);
        object.position.z += speed * Math.sin(angle * ONE_DEGREE);
    }

    object.lookAt(target.position);
}

function objectWalk(object, lerp = true) {

    let angle = object.userData.angle;

    if (lerp) {
        object.position.lerp(new Vector3(object.position.x + speed * Math.cos(angle * ONE_DEGREE), 0, object.position.z - speed * Math.sin(angle * ONE_DEGREE)), 0.5);
    } else {
        object.position.x += speed * Math.cos(angle * ONE_DEGREE);
        object.position.z -= speed * Math.sin(angle * ONE_DEGREE);
    }

    object.rotation.y = (angle + 90) * ONE_DEGREE;
}

module.exports = { spawnEnemies, objectWalk, objectWalkTo};