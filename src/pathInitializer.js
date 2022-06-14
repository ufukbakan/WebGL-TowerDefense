const { Mesh, TextureLoader, MeshLambertMaterial, RepeatWrapping, MirroredRepeatWrapping, ClampToEdgeWrapping } = require("three");
const { Vector3 } = require("three");
const { MeshBasicMaterial } = require("three");
const { BoxGeometry } = require("three");
const { Group } = require("three")

const textureLoader = new TextureLoader();
const roadTexture_x = textureLoader.load("/assets/stone-road.jpg");
const roadTexture_y = textureLoader.load("/assets/stone-road.jpg");
roadTexture_x.wrapS = MirroredRepeatWrapping;
roadTexture_x.wrapT = MirroredRepeatWrapping;
roadTexture_y.wrapS = MirroredRepeatWrapping;
roadTexture_y.wrapT = MirroredRepeatWrapping;
roadTexture_x.repeat.set(20, 2);
roadTexture_y.repeat.set(2, 20);
const roadMaterial_x =  new MeshLambertMaterial({ map: roadTexture_x});
const roadMaterial_y =  new MeshLambertMaterial({ map: roadTexture_y});

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
        rotator.name = "rotator";
        rotatorGroup.position.set(position.x, position.y, position.z);
        rotatorGroup.add(rotator);
        scene.add(rotatorGroup);
    });
}

/**
 * @param {THREE.Scene} scene 
 */
 function placeForbiddenPath(scene) {
    const mesh_height = 0.001;
    let forbiddenPathGroup = new Group();
    forbiddenPathGroup.name = "forbidden";
    let forbiddenPath1 =  new Mesh(new BoxGeometry(8,mesh_height,1), roadMaterial_x );
    forbiddenPath1.name = "forbidden";
    forbiddenPath1.position.set(0, mesh_height/2, -2);

    let forbiddenPath2 =  new Mesh(new BoxGeometry(1,mesh_height,8), roadMaterial_y );
    forbiddenPath2.name = "forbidden";
    forbiddenPath2.position.set(2, mesh_height/2 + 0.001, 0);

    let forbiddenPath3 =  new Mesh(new BoxGeometry(8,mesh_height,1), roadMaterial_x );
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