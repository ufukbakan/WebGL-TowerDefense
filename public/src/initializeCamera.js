const { DoubleSide } = require("three");
const { BoxGeometry } = require("three");
const { Raycaster } = require("three");
const { PlaneGeometry } = require("three");
const { MeshBasicMaterial } = require("three");
const { Mesh } = require("three");
const { Vector3 } = require("three");
const { PerspectiveCamera } = require("three");

/**
 * 
 * @param {THREE.Scene} scene 
 * @returns {THREE.Camera}
 */
function initializeCamera(scene) {
    const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 30);
    const coordinatePlane = new Mesh( new PlaneGeometry(1,1), new MeshBasicMaterial({color: 0xffffff, side: DoubleSide}) );
    const raycaster = new Raycaster();
    scene.add( coordinatePlane );
    coordinatePlane.position.set(0, 0, 0);
    const ONE_DEGREE = Math.PI / 180;
    const CAMERA_STEP = 0.005;
    let leftMouseDown = false;
    let rightMouseDown = false;
    let nextClickIsDouble = false;

    let cameraFocusPoint = new Vector3(0, 0, 0);
    let defaultZoomRadius = 4.5;
    let cameraPositionVector = new Vector3(defaultZoomRadius, ONE_DEGREE * 50, 0);

    updateCamera();

    function calculateOrbitalCoordinates() {
        if (cameraPositionVector.y > Math.PI){
            cameraPositionVector.y = Math.PI;
        }
        else if (cameraPositionVector.y < 0){
            cameraPositionVector.y = 0;
        }
        const radius = cameraPositionVector.x;
        const phi = cameraPositionVector.y;
        const lambda = cameraPositionVector.z;
        return new Vector3(
            radius * Math.cos(phi) * Math.cos(lambda) + cameraFocusPoint.x,
            radius * Math.sin(phi) + cameraFocusPoint.y,
            radius * Math.cos(phi) * Math.sin(lambda) + cameraFocusPoint.z
        )
    }


    function updateCamera() {
        let cameraPosition = calculateOrbitalCoordinates();
        camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        camera.lookAt(cameraFocusPoint);
        coordinatePlane.rotation.set(0, cameraPositionVector.z - Math.PI / 2, 0);
    }


    window.addEventListener("wheel", zoom);
    window.addEventListener("mousedown", toggleDownState);
    window.addEventListener("mouseup", toggleDownState);
    window.addEventListener("mousemove", handleCamera);
    window.addEventListener("contextmenu", waitForDouble);

    /**
     * 
     * @param {MouseEvent} e 
     */
    function waitForDouble(e) {
        e.preventDefault();
        if (nextClickIsDouble) {
            cameraFocusPoint = new Vector3(0, 0, 0);
            cameraPositionVector = new Vector3(defaultZoomRadius, Math.PI / 2, Math.PI / 2);
            updateCamera();
        }
        window.setTimeout(() => { nextClickIsDouble = false }, 200);
        nextClickIsDouble = true;
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    function toggleDownState(e) {
        if (e.button == 0) {
            leftMouseDown = !leftMouseDown;
        }
        if (e.button == 2) {
            rightMouseDown = !rightMouseDown;
        }
    }

    function limit(x, limit = 0.001) {
        if (x < limit && x > -limit) {
            return 0;
        } else {
            return x;
        }
    }

    /**
     * @param {MouseEvent} e
     */
    function handleCamera(e) {
        if (leftMouseDown) {
            cameraFocusPoint.add( new Vector3(-1 * e.movementX * CAMERA_STEP ,1 * e.movementY * CAMERA_STEP,0).applyQuaternion(camera.quaternion).setY(0) );
            updateCamera();
        } else if (rightMouseDown) {
            cameraPositionVector.add(new Vector3(0, e.movementY * CAMERA_STEP, e.movementX * CAMERA_STEP));
            updateCamera();
        }
    }

    /**
     * 
     * @param {WheelEvent} e 
     */
    function zoom(e) {
        cameraPositionVector.x += 0.1 * Math.sign(e.deltaY)// zoom radius 
        updateCamera();
    }

    return camera;
}

module.exports = initializeCamera;