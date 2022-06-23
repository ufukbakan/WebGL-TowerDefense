const { prcTimeout } = require("precision-timeout-interval");
const { Vector3, LineBasicMaterial, BufferGeometry, Line, Box3} = require("three");

const redLaserMaterial = new LineBasicMaterial({ color: 0xff0000, opacity: 0.85, transparent: true });
const blueLaserMaterial = new LineBasicMaterial({ color: 0x0000ff, opacity: 0.85, transparent: true });
const rangeMaterial = new LineBasicMaterial({
    color: "rgba(255,255,0,1)", linewidth: 5
});

const ranges = {
    "Turret0": 4,
    "Turret1": 3
}
const damages = {
    "Turret0": 50,
    "Turret1": 40
}
const reloadTimes = {
    "Turret0": 1000,
    "Turret1": 333
}

/**
 * @param {THREE.Object3D} turret 
 * @param {THREE.Scene} scene
 */
function initTurret(turret, scene) {
    const type = turret.userData.type;
    turret.userData.reloadTime = reloadTimes[type];
    turret.userData.damage = damages[type];
    turret.userData.canShoot = true;
    turret.userData.range = ranges[type];

    if (type == "Turret0") {
        turret.userData.shootMaterial = redLaserMaterial;
    }else if(type == "Turret1"){
        turret.userData.shootMaterial = blueLaserMaterial;
    }

    turret.userData.turretHeight = new Box3().setFromObject(turret).max.y;
    turret.userData.update = turretLifeCycle.bind(null, turret, scene);
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
                    if (obj.userData.currentHitPoint > 0 && enemyDistanceSqr <= turret.userData.range) {
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
                        points.push(turret.position.clone().add(new Vector3(0, turret.userData.turretHeight - 0.05 , 0)));
                        points.push(obj.position.clone().add(new Vector3(0, 0.2, 0)));
                        const geometry = new BufferGeometry().setFromPoints(points);
                        const line = new Line(geometry, turret.userData.shootMaterial);
                        scene.add(line);
                        prcTimeout(50, () => removeLaser(line));

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