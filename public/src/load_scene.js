const { BoxGeometry, MeshNormalMaterial, Mesh } = require("three");
const { GLTFLoader } = require("./GLTFLoader");

/**
 * @param {THREE.Scene} scene 
 * @param {string} path 
 * @param {Array} pos 
 * @param {Array} rot 
 */
 var model = [];

function placeModel(scene, path, pos, rot) {
    var loader = new GLTFLoader();

    loader.load(path, modelgltlf.bind(this, scene, pos, rot));
    console.log(model[0]);

    return model;
}

function modelgltlf(scene, pos, rot, gltf) {
    model.push(gltf.scene);
    model[0].position.set(pos[0], pos[1], pos[2]);
    model[0].rotation.set(rot[0], rot[1], rot[2]);
    scene.add(model[0]);
}


module.exports = placeModel;