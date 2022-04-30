const { BoxGeometry, MeshNormalMaterial, Mesh } = require("three");
const { GLTFLoader } = require("./GLTFLoader");

function placeModel(scene, path, pos, rot) {
    var loader = new GLTFLoader();

    loader.load(path, function(gltf){
        var model = gltf.scene;
        model.material = new MeshNormalMaterial();
        model.position.set(pos[0], pos[1], pos[2]);
        model.rotation.set(rot[0], rot[1], rot[2]);
        scene.add(model);
    }) 
}

module.exports = placeModel;