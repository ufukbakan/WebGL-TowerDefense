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

async function placeModel(scene, path, pos, rot) {
    const gltfData = await loader.loadAsync(path);
    const model = gltfData.scene;
    scene.add(model);
    return model;
}

module.exports = placeModel;