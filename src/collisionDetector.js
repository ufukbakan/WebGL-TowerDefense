const { Raycaster } = require("three");
const { Group } = require("three");
const { Mesh } = require("three");
const { Scene } = require("three");
const { Vector3 } = require("three");

const raycaster = new Raycaster()
const raycast_direction = new Vector3(0.01, 0.01, 0.01);

function isCollidable(obj){
    return (obj instanceof Group);
}

/**
 * 
 * @param {THREE.Scene} scene 
 */
function detectCollisions(scene) {

    scene.traverse(
        function (obj) {
            if (obj instanceof Scene) {
                for (let obj1 of obj.children) {
                    if (isCollidable(obj1)) {
                        for (let obj2 of obj.children) {
                            if (obj1 != obj2 && isCollidable(obj2)) {
                                const point = obj1.position;
                                raycaster.set(point, raycast_direction)
                                const intersects = raycaster.intersectObject(obj2);
                                
                                if (intersects.length) {
                                    if(obj1.userData.collisionHandler){
                                        obj1.userData.collisionHandler(obj2);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    )
}

module.exports = detectCollisions;