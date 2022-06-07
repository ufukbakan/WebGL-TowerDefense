const { prcTimeout } = require("precision-timeout-interval");
const { Vector3, LineBasicMaterial, BufferGeometry, Line} = require("three");

const redLaserMaterial = new LineBasicMaterial({ color: 0xff0000 });
const rangeMaterial = new LineBasicMaterial({
    color: "rgba(255,255,0,1)", linewidth: 5
});

const ranges = {
    "Turret0": 4
}
const damages = {
    "Turret0": 50
}
const reloadTimes = {
    "Turret0": 1000
}

/**
 * @param {THREE.Object3D} turret 
 * @param {THREE.Scene} scene
 */
function initTurret(turret, scene) {
    if (turret.name.toLocaleLowerCase().includes("turret0")) {
        const type = turret.userData.type;
        turret.userData.update = turretLifeCycle.bind(null, turret, scene);
        turret.userData.reloadTime = reloadTimes[type];
        turret.userData.damage = damages[type];
        turret.userData.canShoot = true;
        turret.userData.range = ranges[type];
        turret.userData.shootMaterial = redLaserMaterial;
    }
}

/**
 * @param {THREE.Object3D} turret 
 * @param {THREE.Scene} scene
 */
function drawRange(turret, scene) {
    let segmentCount = 256;
    let radius = ranges[turret.userData.type] / 2;
    let points = [];
    for (var i = 0; i <= segmentCount; i++) {
        var theta = (i / segmentCount) * Math.PI * 2;
        points.push(
            new Vector3(
                Math.cos(theta) * radius,
                Math.sin(theta) * radius,
                0));
    }

    const geometry = new BufferGeometry().setFromPoints(points);
    let circle = new Line(geometry, rangeMaterial)
    circle.position.y = 0.1;
    circle.rotation.set(Math.PI / 2, 0, 0);
    circle.scale.set(1 / turret.scale.x, 1 / turret.scale.y, 1 / turret.scale.z);
    turret.add(circle);
}

/**
 * @param {THREE.Object3D} turret 
 * @param {THREE.Scene} scene
 */
function turretLifeCycle(turret, scene) {
    try {
        let traverseBreak = false;
        scene.traverse(
            obj => {
                if (!traverseBreak && obj.name.includes("enemy")) {
                    let enemyShootable = false;
                    //(x - xmerkez)^2 + (y - ymerkez)^2 <= kulenin görüş yarı çapı^2 ise ateş et (y yerine z ekseni)
                    const enemyDistanceSqr = Math.pow((obj.position.x - turret.position.x), 2) + Math.pow((obj.position.z - turret.position.z), 2);
                    if (enemyDistanceSqr <= turret.userData.range) {
                        enemyShootable = true;
                    }
                    if (enemyShootable) {
                        const angle = Math.atan2((obj.position.x - turret.position.x), (obj.position.z - turret.position.z));
                        turret.rotation.set(0, angle, 0);
                        traverseBreak = true;
                    }

                    if (enemyShootable && turret.userData.canShoot) {
                        turret.userData.canShoot = false;

                        const points = [];
                        points.push(turret.position.clone().add(new Vector3(0, 0.4, 0)));
                        points.push(obj.position.clone().add(new Vector3(0, 0.2, 0)));
                        const geometry = new BufferGeometry().setFromPoints(points);
                        const line = new Line(geometry, turret.userData.shootMaterial);
                        scene.add(line);
                        prcTimeout(100, () => removeLaser(line));

                        obj.userData.takeDamage(turret.userData.damage);
                        prcTimeout(turret.userData.reloadTime, () => reload(turret));
                    }
                }
            }
        )
    }
    catch (ex) {
    }
}

/**
 * @param {THREE.Line} laser 
 */
function removeLaser(laser) {
    laser.removeFromParent();
}

/**
 * @param {*} turret 
 */
function reload(turret) {
    turret.userData.canShoot = true;
}

module.exports = {
    initTurret, drawRange
}