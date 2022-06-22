const { DirectionalLightHelper, CameraHelper, DirectionalLight } = require("three");


function fixLights(scene) {
    scene.traverse((obj) => {
        switch (obj.name) {
            case "Ground":
                obj.receiveShadow = true;
                break;
            case "rotator":
                break;
            case "forbidden":
                obj.receiveShadow = true;
                break;
            case "healthBox":
                obj.castShadow = false;
                obj.receiveShadow= false;
                break;
            default:
                obj.castShadow = true;
        }
    })
}

/**
 * 
 * @param {THREE.Scene} scene 
 */
function lightTransforms(scene) {
    var step = 0.3;

    fixLights(scene);

    var light = new DirectionalLight("#fff");
    light.position.y = 3;
    light.castShadow = true;
    light.target.position.set(0, 0, 0);
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    scene.add(light);
    scene.add(light.target);

    // var helper = new CameraHelper(light.shadow.camera);
    // scene.add(helper);

    window.addEventListener("keydown", (e) => {
        switch (e.code) {
            case "ArrowUp":
                if (light.position.z > -4) {
                    light.position.z -= step;
                }
                break;
            case "ArrowDown":
                if (light.position.z < 4) {
                    light.position.z += step;
                }
                break;
            case "ArrowRight":
                if (light.position.x < 4) {
                    light.position.x += step;
                }
                break;
            case "ArrowLeft":
                if (light.position.x > -4) {
                    light.position.x -= step;
                }
                break;
            case "KeyQ":
                if (light.position.y < 5) {
                    light.position.y += step;
                }
                break;
            case "KeyE":
                if (light.position.y > 0) {
                    light.position.y -= step;
                }
                break;
        }
    });
}
module.exports = {lightTransforms, fixLights};