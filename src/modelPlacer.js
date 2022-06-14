const { Cache } = require("three");
const { DRACOLoader } = require("./DRACOLoader");
const { GLTFLoader } = require("./GLTFLoader");
const { fixLights } = require("./lightTransformation");

const loader = new GLTFLoader();
const draco = new DRACOLoader();
draco.setDecoderPath("./libs/draco/");
loader.dracoLoader = draco;
Cache.enabled = true;

/**
 * @param {THREE.Scene} scene 
 * @param {String} modelName
 * @param {Array} pos 
 * @param {Array} rot
 * @param {Array} sca
 * @param {String} objectName
 * @returns {THREE.Object3D}
 */
async function modelPlacer(scene, modelName, pos, rot = [0, 0, 0], sca = [1, 1, 1], objectName=undefined) {
    const { getClonableModels } = require("./sceneLoader");
    let model = getClonableModels()[modelName].clone();
    model.userData.type = modelName;
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
    const gltfData = await loader.loadAsync("/assets/" + name + ".gltf");
    return gltfData.scene;
}

module.exports = { modelPlacer, modelLoader };