const { Vector3 } = require("three");
const { PerspectiveCamera } = require("three");

/**
 * 
 * @param {THREE.Scene} scene 
 * @returns {THREE.Camera}
 */
function initializeCamera(/*scene*/) {
    const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 30);
    const ONE_DEGREE = Math.PI / 180;
    const CAMERA_STEP = 0.005;
    let leftMouseDown = false;
    let rightMouseDown = false;
    let nextClickIsDouble = false;

    let cameraFocusPoint = new Vector3(0, 0, 0);
    let defaultZoomRadius = 3;
    let cameraPositionVector = new Vector3(defaultZoomRadius, ONE_DEGREE*90, 0);


    updateCamera();
    console.log("camera pos" + JSON.stringify(camera.position));

    function calculateOrbitalCoordinates(rplVector) {
        const radius = rplVector.x;
        const phi = rplVector.y;
        const lambda = rplVector.z;
        return new Vector3(
            radius * Math.cos(phi) * Math.cos(lambda) + cameraFocusPoint.x,
            radius * Math.sin(phi) + cameraFocusPoint.y,
            radius * Math.cos(phi) * Math.sin(lambda) + cameraFocusPoint.z
        )
    }


    function updateCamera() {
        let cameraPosition = calculateOrbitalCoordinates(cameraPositionVector);
        camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        camera.lookAt(cameraFocusPoint);

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
            cameraPositionVector = new Vector3(defaultZoomRadius, Math.PI/2, Math.PI/2);
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

    function limit(x, limit=0.1){
        if(x<limit && x>-limit){
            return 0;
        }else{
            return x;
        }
    }

    /**
     * @param {MouseEvent} e
     */
    function handleCamera(e) {
        if (leftMouseDown) {
            const lambda = limit(cameraPositionVector.z);
            const sinL = limit(Math.sin(lambda));
            
            var movement = new Vector3(
                limit(Math.sign(e.movementX)*sinL, 0.71 ) + limit(Math.sign(e.movementY)*limit(Math.cos(Math.PI - lambda) ), 0.71),
                0,
                limit(Math.sign(e.movementY)*sinL, 0.71) + limit ( Math.sign(e.movementX)*limit(Math.cos(Math.PI - lambda) ), 0.71 )
            );

            movement = movement.multiply(new Vector3(CAMERA_STEP, CAMERA_STEP, CAMERA_STEP));
            cameraFocusPoint.add(movement);
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