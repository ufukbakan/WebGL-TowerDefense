const { Object3D } = require("three");
const { Group } = require("three");
const { GLTFLoader } = require("./GLTFLoader");

/**
 * @param {THREE.Scene} scene 
 * @param {string} path 
 * @param {Array} pos 
 * @param {Array} rot 
 */

const loader = new GLTFLoader();

async function placeModel(scene, path, pos, rot=[0,0,0], sca=[1,1,1]) {
    const gltfData = await loader.loadAsync(path);
    /** @type{THREE.Object3D} */const model = gltfData.scene;
    model.position.set(pos[0], pos[1], pos[2]);
    model.rotation.set(rot[0], rot[1], rot[2]);
    model.scale.set(sca[0], sca[1], sca[2]);
    scene.add(model);
    return model;
}

module.exports = placeModel;