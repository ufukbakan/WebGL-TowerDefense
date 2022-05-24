const { Cache } = require("three");
const { GLTFLoader } = require("./GLTFLoader");
const { fixLights } = require("./lightTransformation");

const loader = new GLTFLoader();
Cache.enabled = true;

/**
 * @param {THREE.Scene} scene 
 * @param {String} modelName
 * @param {Array} pos 
 * @param {Array} rot
 * @param {Array} sca
 * @param {String} objectName
 */
async function modelPlacer(scene, modelName, pos, rot = [0, 0, 0], sca = [1, 1, 1], objectName=undefined) {
    const { getClonableModels } = require("./loadScene");
    let model = getClonableModels()[modelName].clone();
    model.position.set(pos[0], pos[1], pos[2]);
    model.rotation.set(rot[0], rot[1], rot[2]);
    model.userData.direction = model.rotation.y * Math.PI / 180;
    model.scale.set(sca[0], sca[1], sca[2]);
    if(objectName)
        model.name = objectName;

    scene.add(model);

    fixLights(scene);
    return model;
}

/**
 * @returns {THREE.Object3D}
 */
async function modelLoader(name){
    const gltfData = await loader.loadAsync("\\src\\Assets\\" + name + ".gltf");
    return gltfData.scene;
}

module.exports = { modelPlacer, modelLoader };