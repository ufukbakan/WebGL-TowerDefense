const { MeshBasicMaterial } = require("three");
const { Raycaster } = require("three");
const { modelPlacer } = require("./modelPlacer");

var lastPicked = {
    name: "",
    object: undefined,
    originalMaterial: [],
    lastColorIsRed: false
}
const redMeshMaterial = new MeshBasicMaterial({ color: 0xff0000, opacity: 0.75, transparent: true });
const greenMeshMaterial = new MeshBasicMaterial({ color: 0x00ff00, opacity: 0.75, transparent: true });
const raycaster = new Raycaster();

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

    async function pickObject(event) {

        raycaster.setFromCamera(canvasToClip(event), camera);
        const intersections = raycaster.intersectObjects(scene.children);

        if (intersections.length > 0) {
            let picked = intersections[0];


            if (picked.object.userData.content) {
                if (lastPicked.name != picked.object.userData.content) {
                    lastPicked.name = picked.object.userData.content;
                    lastPicked.object = await modelPlacer(scene, lastPicked.name, [0, 0, 0], [0, 0, 0], [0.01, 0.01, 0.01]);
                    let originalMaterials = [];
                    lastPicked.object.traverse( m => {
                        if(m.material){
                            originalMaterials.push(m.material);
                            m.material = greenMeshMaterial;
                        }
                    })
                    lastPicked.originalMaterial = originalMaterials;
                } else {
                    lastPicked.name = "";
                    lastPicked.object = undefined;
                }
            }
        }
    }

    function putObject(event) {

        raycaster.setFromCamera(canvasToClip(event), camera);
        const intersections = raycaster.intersectObjects(scene.children);

        let groundIntersection = intersections.find(x => x.object.name == "Ground")
        let forbiddenIntersection = intersections.find(x => x.object.name == "forbidden")

        if (groundIntersection && !forbiddenIntersection && lastPicked.name != "") {
            lastPicked.name = "";
            lastPicked.object.traverse((x) => {
                if (x.material) {
                    x.material = lastPicked.originalMaterial.shift();
                }
            })
            console.log(scene);
        }
    }

    window.addEventListener("click", function (event) {
        if (lastPicked.name == "") {
            pickObject(event)
        } else {
            putObject(event);
        }
    });


    window.addEventListener("mousemove", function (event) {
        if (lastPicked.name != "" && lastPicked.object) {

            raycaster.setFromCamera(canvasToClip(event), camera);
            const intersections = raycaster.intersectObjects(scene.children);

            let groundIntersection = intersections.find(x => x.object.name == "Ground")
            let forbiddenIntersection = intersections.find(x => x.object.name == "forbidden")

            if (groundIntersection && lastPicked.name != "") {
                if(forbiddenIntersection && !lastPicked.lastColorIsRed){
                    lastPicked.object.traverse(m => {
                        if(m.material){
                            m.material = redMeshMaterial;
                        }
                    });
                    lastPicked.lastColorIsRed = true;
                }
                else if(!forbiddenIntersection && lastPicked.lastColorIsRed){
                    lastPicked.object.traverse(m => {
                        if(m.material){
                            m.material = greenMeshMaterial;
                        }
                    });
                    lastPicked.lastColorIsRed = false;
                }
                let position = groundIntersection.point;
                position.y = 0;
                lastPicked.object.position.set(position.x, position.y, position.z);
            }
        }
    });
}

module.exports = { pickingObject, lastPicked };