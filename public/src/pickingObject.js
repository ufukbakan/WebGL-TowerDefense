const { Raycaster, Group } = require("three");
const modelPlacer = require("./modelPlacer");

function pickingObject(renderer, scene, camera, objectPath = "") {

    let canvas = renderer.domElement;

    function returnCanvasPos(event) {
        return {
            x: event.offsetX,
            y: event.offsetY
        };
    }

    function canvasToClip(event) {
        let clipPosition = { x: 0, y: 0 };
        let pos = returnCanvasPos(event);

        clipPosition.x = (pos.x / canvas.width) * 2 - 1;
        clipPosition.y = ((canvas.height - pos.y) / canvas.height) * 2 - 1;

        return clipPosition;
    }

    function pickObject(event) {
        let raycaster = new Raycaster();
        raycaster.setFromCamera(canvasToClip(event), camera);
        const intersectedObjects = raycaster.intersectObjects(scene.children);
        
        if (intersectedObjects.length > 0) {
            let picked = intersectedObjects[0];
        }
    }

    function putObject(event) {
        let raycaster = new Raycaster();
        raycaster.setFromCamera(canvasToClip(event), camera);
        const intersectedObjects = raycaster.intersectObjects(scene.children);

        if (intersectedObjects.length > 0 && intersectedObjects[0].object.name == "Ground") {
            let picked = intersectedObjects[0];
            let position = picked.point;
            position.y = 0;
            modelPlacer(scene, objectPath, [position.x, position.y, position.z], [0, 0, 0], [0.01, 0.01, 0.01]);
        }
    }

    window.addEventListener('click', function (event) {
        if (objectPath == "") {
            pickObject(event)
        } else {
            putObject(event, objectPath);
        }
    });
}

module.exports = { pickingObject };