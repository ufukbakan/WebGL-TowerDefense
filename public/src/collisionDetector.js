const { Raycaster } = require("three");
const { Group } = require("three");
const { Mesh } = require("three");
const { Scene } = require("three");
const { Vector3 } = require("three");

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
                                const direction = new Vector3(1, 1, 1);
                                const raycaster = new Raycaster()
                                raycaster.set(point, direction)
                                const intersects = raycaster.intersectObject(obj2);

                                if (intersects.length && direction.dot(intersects[0].face.normal) > 0) {
                                    console.log(obj1.type + " collides with " + obj2.type);
                                } else {
                                    //console.log(`Point is out of object`);
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