const { MeshBasicMaterial } = require("three");
const { Raycaster } = require("three");
const { modelPlacer } = require("./modelPlacer");
const { initTurret, drawRange } = require("./turretInitializer");
const { buyTurret,sellTurret } = require("./turretShop");

var placing = {
    object: undefined,
    originalMaterial: [],
    lastColorIsRed: false
}
const redMeshMaterial = new MeshBasicMaterial({ color: 0xff0000, opacity: 0.75, transparent: true });
const greenMeshMaterial = new MeshBasicMaterial({ color: 0x00ff00, opacity: 0.75, transparent: true });
const raycaster = new Raycaster();
var turretToSell = undefined;

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
            if (picked.userData.ref) {
                if (picked.userData.ref != "Sell" && buyTurret(picked.userData.ref)) {
                    raycaster.setFromCamera(getCanvasPosition(event), mainCamera);
                    intersections = raycaster.intersectObjects(mainScene.children);
                    let groundIntersection = intersections.find(x => x.object.name == "Ground");
                    let position = [0, 0, 0];
                    if (groundIntersection) {
                        position = [groundIntersection.point.x, 0, groundIntersection.point.z];
                    }
                    placing.object = await modelPlacer(mainScene, picked.userData.ref, position, [0, 0, 0], [0.01, 0.01, 0.01], picked.userData.ref);
                    drawRange(placing.object, mainScene);
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
                }else if(picked.userData.ref == "Sell"){ 
                    window.removeEventListener("click", hudClickHandler);
                    window.addEventListener("click", placeObjectToCursor);
                }
            }
        }
    }

    function placeObjectToCursor(event) {
        if(placing.object != undefined){
            raycaster.setFromCamera(getCanvasPosition(event), mainCamera);
            const intersections = raycaster.intersectObjects(mainScene.children);
    
            let groundIntersection = intersections.find(intersection => intersection.object.name == "Ground");
            let forbiddenIntersection = intersections.find(intersection => intersection.object.name.includes("forbidden") ||
                (!isChildOfPlacing(intersection.object) && intersection.object.name.toLocaleLowerCase().includes("turret")));
    
            if (groundIntersection && !forbiddenIntersection && placing.object) {
                placing.object.traverse((x) => {
                    if (x.material) {
                        x.material = placing.originalMaterial.shift();
                    }
                })
                const turretReference = placing.object;
                initTurret(turretReference, mainScene);
                placing.object = undefined;
                window.removeEventListener("click", placeObjectToCursor);
                window.removeEventListener("mousemove", objectTrackCursor);
                window.addEventListener("click", hudClickHandler);
            }
        }else{
            raycaster.setFromCamera(getCanvasPosition(event), mainCamera);
            const intersections = raycaster.intersectObjects(mainScene.children);
            
            checkTurretType(intersections.find(intersection => (intersection.object.name.toLocaleLowerCase().includes("turret"))).object);

            if(turretToSell != undefined){
                sellTurret(turretToSell.userData.type);
                turretToSell.removeFromParent();
                turretToSell = undefined;
            }

            window.removeEventListener("click", placeObjectToCursor);
            window.addEventListener("click", hudClickHandler);
        }
    }

    window.addEventListener("click", hudClickHandler);


    function checkTurretType(turretPart){
        if(turretPart.userData != undefined && turretPart.userData.type !=  undefined && turretPart.userData.type.toLocaleLowerCase().includes("turret")){
            turretToSell = turretPart;
        }else{
            checkTurretType(turretPart.parent);
        }
    }

    function isChildOfPlacing(object) {
        if (object.id == placing.object.id) {
            return true;
        }
        else if (object.parent == null) {
            return false;
        }
        else {
            return isChildOfPlacing(object.parent);
        }
    }

    function objectTrackCursor(event) {
        if (placing.object) {
            raycaster.setFromCamera(getCanvasPosition(event), mainCamera);
            const intersections = raycaster.intersectObjects(mainScene.children);

            let groundIntersection = intersections.find(x => x.object.name == "Ground")
            let forbiddenIntersection = intersections.find(intersection => intersection.object.name.includes("forbidden") ||
                (!isChildOfPlacing(intersection.object) && intersection.object.name.toLocaleLowerCase().includes("turret")));

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

module.exports = { pickingObject };