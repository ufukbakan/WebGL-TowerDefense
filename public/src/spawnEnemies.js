const { Object3D } = require("three");
const { BoxGeometry } = require("three");
const { MeshBasicMaterial } = require("three");
const { Mesh } = require("three");
const { Vector2, Vector3 } = require("three");
const { modelPlacer } = require("./modelPlacer");

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
        /** @type {THREE.Object3D} */ let model;
        if (type == 0) {
            model = await modelPlacer(scene, "Boy", ENEMY_SPAWN_POS, [0, 0, 0], [0.01, 0.01, 0.01]);
            model.name = "enemy_boy";
            
            model.userData.maxHitPoint = 100;
            model.userData.currentHitPoint = model.userData.maxHitPoint;
            createHpBar(model, "green");
            
            model.userData.speed = 0.009;
            model.userData.rotatedAlready = [];
            model.userData.update = updateEnemy.bind(null, model);
            model.userData.takeDamage = takeDamage.bind(null, model);
            model.userData.collisionHandler = enemyCollisionHandler.bind(null, model);

            scene.add(model);
        }
        setTimeout(() => spawnEnemies(scene, type, count - 1), 500);
    }
}

/**
 * 
 * @param {Object3D} enemy 
 */
function createHpBar(enemy, color) {
    let healthBox = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: color }));
    healthBox.scale.set(15, 2, 2);
    healthBox.name = "healthBox";
    healthBox.position.set(0, 15, 0);
    enemy.add(healthBox);
}

/**
 * 
 * @param {Number} damage 
 * @param {Object3D} obj
 */
function takeDamage(obj, damage) {
    if (obj.userData.currentHitPoint <= damage) {
        const { decreaseRemainingMobs } = require("./levelBuilder");
        obj.userData.currentHitPoint = 0;
        obj.removeFromParent();
        decreaseRemainingMobs();
    }
    else {
        obj.userData.currentHitPoint -= damage
        obj.getObjectByName("healthBox").scale.set(15 * (obj.userData.currentHitPoint / obj.userData.maxHitPoint), 2, 2);
    }
}

/**
 * @param {THREE.Object3D} enemy
 * @param {THREE.Object3D} colliding_with 
 */
function enemyCollisionHandler(enemy, colliding_with) {
    if (colliding_with.name == "path_rotator" && !enemy.userData.rotatedAlready.includes(colliding_with.uuid)) {
        enemy.userData.direction -= 90;
        enemy.userData.rotatedAlready.push(colliding_with.uuid);
    }
    else if( isChildOfBase(colliding_with) ){
        const { decreaseRemainingMobs } = require("./levelBuilder");
        enemy.removeFromParent();
        decreaseRemainingMobs();
    }
}

/**
 * 
 * @param {THREE.Object3D} obj 
 */
function isChildOfBase(obj){
    if(obj.name == "Base"){
        return true;
    }else if( !obj.parent){
        return false;
    }else{
        return isChildOfBase(obj.parent);
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
        object.position.x += speed * Math.cos(angle * ONE_DEGREE) * deltaTime;
        object.position.z += speed * Math.sin(angle * ONE_DEGREE) * deltaTime;
    }

    object.lookAt(target.position);
}

/**
 * 
 * @param {THREE.Object3D} object 
 * @param {boolean} lerp 
 */
function objectWalk(object, lerp = false, deltaTime) {

    let angle = object.userData.direction * ONE_DEGREE;

    if (lerp) {
        object.position.lerp(new Vector3(object.position.x + speed * Math.cos(angle), 0, object.position.z - speed * Math.sin(angle)), 0.5);
    } else {
        object.position.x += object.userData.speed * Math.cos(angle) * deltaTime;
        object.position.z -= object.userData.speed * Math.sin(angle) * deltaTime;
    }

    object.rotation.y = angle + Math.PI / 2;
}

module.exports = { spawnEnemies, objectWalk, objectWalkTo };