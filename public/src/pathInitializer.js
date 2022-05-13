const { Mesh } = require("three");
const { Vector3 } = require("three");
const { MeshBasicMaterial } = require("three");
const { BoxGeometry } = require("three");
const { Group } = require("three")

/**
 * 
 * @param {THREE.Scene} scene 
 */
function placeRotators(scene) {
    const mesh_height = 0.5;
    const rotatorPositions = [ new Vector3(2.4, mesh_height/2, -2), new Vector3(2, mesh_height/2, 2.4) ];
    rotatorPositions.forEach(position =>{
        let rotatorGroup = new Group();
        rotatorGroup.name = "path_rotator";
        let rotator = new Mesh(new BoxGeometry(0.5, mesh_height, 0.5), new MeshBasicMaterial({ color: 0x00ff00, alphaTest: true, opacity:0 }));
        rotatorGroup.position.set(position.x, position.y, position.z);
        rotatorGroup.add(rotator);
        scene.add(rotatorGroup);
    });
}

/**
 * @param {THREE.Scene} scene 
 */
 function placeForbiddenPath(scene) {
    const mesh_height = 0.05;
    let forbiddenPathGroup = new Group();
    forbiddenPathGroup.name = "forbidden";
    let forbiddenPath1 =  new Mesh(new BoxGeometry(16,mesh_height,1), new MeshBasicMaterial({color: 0xff0000, opacity:0, alphaTest: true}));
    forbiddenPath1.name = "forbidden";
    forbiddenPath1.position.set(0, mesh_height/2, -2);

    let forbiddenPath2 =  new Mesh(new BoxGeometry(1,mesh_height,16), new MeshBasicMaterial({color: 0xff0000, opacity:0, alphaTest: true}));
    forbiddenPath2.name = "forbidden";
    forbiddenPath2.position.set(2, mesh_height/2, 0);

    let forbiddenPath3 =  new Mesh(new BoxGeometry(16,mesh_height,1), new MeshBasicMaterial({color: 0xff0000, opacity:0, alphaTest: true}));
    forbiddenPath3.name = "forbidden";
    forbiddenPath3.position.set(0, mesh_height/2, 2);

    forbiddenPathGroup.add(forbiddenPath1);
    forbiddenPathGroup.add(forbiddenPath2);
    forbiddenPathGroup.add(forbiddenPath3);
    scene.add(forbiddenPathGroup);
}

/**
 * 
 * @param {THREE.Scene} scene 
 */
function initPaths(scene){
    placeRotators(scene);
    placeForbiddenPath(scene);
}

module.exports = initPaths;