const { MeshBasicMaterial } = require("three");
const { Raycaster } = require("three");
const { modelPlacer } = require("./modelPlacer");

var placing = {
    object: undefined,
    originalMaterial: [],
    lastColorIsRed: false
}
const redMeshMaterial = new MeshBasicMaterial({ color: 0xff0000, opacity: 0.75, transparent: true });
const greenMeshMaterial = new MeshBasicMaterial({ color: 0x00ff00, opacity: 0.75, transparent: true });
const raycaster = new Raycaster();

function pickingObject(renderer, mainScene, hudScene, mainCamera, hudCamera) {

    let canvas = renderer.domElement;

    function getHtmlPosition(event) {
        return {
            x: event.offsetX,
            y: event.offsetY
        };
    }

    function getCanvasPosition(event) {
        let clipPosition = { x: 0, y: 0 };
        let pos = getHtmlPosition(event);

        clipPosition.x = (pos.x / canvas.width) * 2 - 1;
        clipPosition.y = ((canvas.height - pos.y) / canvas.height) * 2 - 1;

        return clipPosition;
    }

    async function hudClickHandler(event) {
        raycaster.setFromCamera(getCanvasPosition(event), hudCamera);
        let intersections = raycaster.intersectObjects(hudScene.children);
        if (intersections.length) {
            let picked = intersections[0].object;
            if (picked.userData.content) {
                raycaster.setFromCamera(getCanvasPosition(event), mainCamera);
                intersections = raycaster.intersectObjects(mainScene.children);
                let groundIntersection = intersections.find(x => x.object.name == "Ground");
                let position = [0, 0, 0];
                if (groundIntersection) {
                    position = [groundIntersection.point.x, 0, groundIntersection.point.z];
                }
                placing.object = await modelPlacer(mainScene, picked.userData.content, position, [0, 0, 0], [0.01, 0.01, 0.01], "turret");
                let originalMaterials = [];
                let n = 0;
                placing.object.traverse(m => {
                    m.name = placing.object.name + "_" + n++;
                    if (m.material) {
                        originalMaterials.push(m.material);
                        m.material = greenMeshMaterial;
                    }
                })
                placing.originalMaterial = originalMaterials;
                window.removeEventListener("click", hudClickHandler);
                window.addEventListener("mousemove", objectTrackCursor);
                window.addEventListener("click", placeObjectToCursor);
            }
        }
    }

    function placeObjectToCursor(event) {
        raycaster.setFromCamera(getCanvasPosition(event), mainCamera);
        const intersections = raycaster.intersectObjects(mainScene.children);

        let groundIntersection = intersections.find(intersection => intersection.object.name == "Ground");
        let forbiddenIntersection = intersections.find(intersection => intersection.object.name.includes("forbidden") ||
            (!isChildOfPlacing(intersection.object) && intersection.object.name.includes("turret")));

        if (groundIntersection && !forbiddenIntersection && placing.object) {
            placing.object.traverse((x) => {
                if (x.material) {
                    x.material = placing.originalMaterial.shift();
                }
            })
            placing.object = undefined;
            window.removeEventListener("click", placeObjectToCursor);
            window.removeEventListener("mousemove", objectTrackCursor);
            window.addEventListener("click", hudClickHandler);
        }
    }

    window.addEventListener("click", hudClickHandler);

    function isChildOfPlacing(object){
        if(object.id == placing.object.id){
            return true;
        }
        else if(object.parent == null){
            return false;
        }
        else{
            return isChildOfPlacing(object.parent);
        }
    }

    function objectTrackCursor(event) {
        if (placing.object) {
            raycaster.setFromCamera(getCanvasPosition(event), mainCamera);
            const intersections = raycaster.intersectObjects(mainScene.children);

            let groundIntersection = intersections.find(x => x.object.name == "Ground")
            let forbiddenIntersection = intersections.find(intersection => intersection.object.name.includes("forbidden") ||
                ( !isChildOfPlacing(intersection.object) && intersection.object.name.includes("turret")));

            if (groundIntersection) {
                if (forbiddenIntersection && !placing.lastColorIsRed) {
                    placing.object.traverse(m => {
                        if (m.material) {
                            m.material = redMeshMaterial;
                        }
                    });
                    placing.lastColorIsRed = true;
                }
                else if (!forbiddenIntersection && placing.lastColorIsRed) {
                    placing.object.traverse(m => {
                        if (m.material) {
                            m.material = greenMeshMaterial;
                        }
                    });
                    placing.lastColorIsRed = false;
                }
                let position = groundIntersection.point;
                position.y = 0;
                placing.object.position.set(position.x, position.y, position.z);
            }
        }
    }
}

module.exports = { pickingObject, lastPicked: placing };