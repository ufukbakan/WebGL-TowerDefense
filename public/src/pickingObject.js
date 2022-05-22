const { Raycaster } = require("three");
const { modelPlacer } = require("./modelPlacer");

var lastPicked = {
    name: "",
    object: undefined
}

function pickingObject(renderer, scene, camera) {

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


            if (picked.object.userData.content) {
                if (lastPicked.name != picked.object.userData.content) {
                    lastPicked.name = picked.object.userData.content;
                    lastPicked.object = modelPlacer(scene, lastPicked.name, [0, 0, 0], [0, 0, 0], [0.01, 0.01, 0.01], 0.2);
                } else {
                    lastPicked.name = "";
                    lastPicked.object = undefined;
                }
            }
        }
    }

    function putObject(event) {
        let raycaster = new Raycaster();
        raycaster.setFromCamera(canvasToClip(event), camera);
        const intersectedObjects = raycaster.intersectObjects(scene.children);

        let a = intersectedObjects.find(x => x.object.name == "Ground")
        let b = intersectedObjects.find(x => x.object.name == "forbidden")

        if (intersectedObjects.length > 0 && a != undefined && b == undefined && lastPicked.name != "") {
            lastPicked.name = "";
            lastPicked.object.then(a => {
                a.traverse((x) => {
                    if (x.isMesh) {
                        x.material.opacity = 1;
                        x.material.transparent = true;
                    }
                })
            })
        }
    }

    window.addEventListener("click", function (event) {
        if (lastPicked.name == "") {
            pickObject(event)
        } else {
            putObject(event);
        }
    }
    );


    window.addEventListener("mousemove", function (event) {
        if (lastPicked.name != "") {
            let raycaster = new Raycaster();
            raycaster.setFromCamera(canvasToClip(event), camera);
            const intersectedObjects = raycaster.intersectObjects(scene.children);

            let a = intersectedObjects.find(x => x.object.name == "Ground")
            let b = intersectedObjects.find(x => x.object.name == "forbidden")

            if (intersectedObjects.length > 0 && a != undefined && b == undefined && lastPicked.name != "") {
                let picked = a;
                let position = picked.point;
                position.y = 0;
                lastPicked.object.then(x => {
                    x.position.set(position.x, position.y, position.z);
                })
            }
        }
    });
}

module.exports = { pickingObject, lastPicked };