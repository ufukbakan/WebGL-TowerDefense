const { GLTFLoader } = require("./GLTFLoader");

const loader = new GLTFLoader();

/**
 * @param {THREE.Scene} scene 
 * @param {string} path 
 * @param {Array} pos 
 * @param {Array} rot 
 */

var scenes = {
    mainScene: undefined
};

//hala scene alıyor belki başka bir şeyde kullanılır diye
async function modelPlacer(scene, path, pos, rot = [0, 0, 0], sca = [1, 1, 1], opacity) {
    const gltfData = await loader.loadAsync("\\src\\Assets\\" + path + ".gltf");
    /** @type{THREE.Object3D} */const model = gltfData.scene;

    model.traverse((x) => {
        if (x.isMesh) {
            x.material.opacity = opacity;
            x.material.transparent = true;
        }
    })

    model.position.set(pos[0], pos[1], pos[2]);
    model.rotation.set(rot[0], rot[1], rot[2]);
    model.userData.direction = model.rotation.y * Math.PI / 180;
    model.scale.set(sca[0], sca[1], sca[2]);

    scenes.mainScene.add(model);
    return model;
}

module.exports = { modelPlacer, scenes };