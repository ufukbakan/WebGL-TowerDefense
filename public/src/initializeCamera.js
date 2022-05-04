const { Euler } = require("three");
const { Mesh } = require("three");
const { MeshNormalMaterial } = require("three");
const { Raycaster } = require("three");
const { Vector2 } = require("three");
const { PlaneGeometry } = require("three");
const { MeshBasicMaterial } = require("three");
const { BoxGeometry } = require("three");
const { Vector3 } = require("three");
const { PerspectiveCamera } = require("three");

/**
 * 
 * @param {THREE.Scene} scene 
 * @returns {THREE.Camera}
 */
function initializeCamera(/*scene*/) {
    const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 30);
    //const raycaster = new Raycaster();
    const ONE_DEGREE = Math.PI / 180;
    const CAMERA_STEP = 0.005;
    let leftMouseDown = false;
    let rightMouseDown = false;
    let nextClickIsDouble = false;

    let cameraFocusPoint = new Vector3(0, 0, 0);
    let translateDirection = new Vector3(0, 0, 0);
    let defaultZoomRadius = 3;
    let cameraPositionVector = new Vector3(defaultZoomRadius, ONE_DEGREE*90, 0);

/*
    let focusPoint = new Mesh(new BoxGeometry(0.2, 0.2, 0.2), new MeshNormalMaterial());
    focusPoint.position.add(cameraFocusPoint);
    scene.add(focusPoint);
    const ground = new Mesh(new PlaneGeometry(500, 500), new MeshBasicMaterial({ color: 0x000, opacity: 1, alphaTest: 1 }));
    ground.setRotationFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);
    scene.add(ground);
*/

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
        //return new Vector3(radius*Math.sin(alpha)*Math.cos(phi) + cameraFocusPoint.x , radius*Math.sin(alpha)*Math.sin(phi) + cameraFocusPoint.y, radius*Math.cos(alpha) + cameraFocusPoint.z );
    }
    /*function calculateOrbitalCoordinates(radius, alpha, phi){
        return new Vector3(radius*Math.sin(alpha)*Math.cos(phi) + cameraFocusPoint.x , radius*Math.sin(alpha)*Math.sin(phi) + cameraFocusPoint.y, radius*Math.cos(alpha) + cameraFocusPoint.z );
    }*/

    function updateCamera() {
        let cameraPosition = calculateOrbitalCoordinates(cameraPositionVector);
        camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
        camera.lookAt(cameraFocusPoint);
        //focusPoint.position.set(cameraFocusPoint.x, cameraFocusPoint.y, cameraFocusPoint.z);
    }



    var pushedButtons = [];

    //window.addEventListener("keydown", keyPush);
    //window.addEventListener("keyup", keyPop);
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
            /*
            camera.rotation.x = -40*ONE_DEGREE;
            camera.rotation.y = 0;
            camera.rotation.z = 0;
            */
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
            const cosL = limit(Math.cos(lambda));
            const sinL = limit(Math.sin(lambda));
            const cosL2 = limit(Math.cos(Math.PI/2 - lambda));
            const sinL2 = limit(Math.sin(Math.PI/2 - lambda));
            //console.log("cos(lambda) "+ cosL + " sin(lambda) "+ sinL);
            
            var movement = new Vector3(
                limit(Math.sign(e.movementX)*sinL, 0.71 ) + limit(Math.sign(e.movementY)*limit(Math.cos(Math.PI - lambda) ), 0.71),
                0,
                limit(Math.sign(e.movementY)*sinL, 0.71) + limit ( Math.sign(e.movementX)*limit(Math.cos(Math.PI - lambda) ), 0.71 )
            );

            console.log(movement);
            movement = movement.multiply(new Vector3(CAMERA_STEP, CAMERA_STEP, CAMERA_STEP));
            cameraFocusPoint.add(movement);
            //movement = movement.unproject(camera).normalize();
            //console.log(movement);
            // z movement : sin lambda
            //const direction = new Vector3(1, Math.cos(cameraPositionVector.z) , Math.sin(cameraPositionVector.z));
            //console.log(direction);
            //const multiplied = direction.multiply( new Vector3(e.movementX*CAMERA_STEP, 0, e.movementY*-CAMERA_STEP) );
            //console.log(multiplied);
            //cameraFocusPoint.add( multiplied );
            //cameraFocusPoint.
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

    function keyPush(e) {
        const key = e.key;
        if (!pushedButtons.includes(key))
            pushedButtons.push(key);

        if (pushedButtons.includes("Shift")) {
            if (pushedButtons.includes("ArrowUp")) {
                camera.position.z -= CAMERA_STEP;
            }
            if (pushedButtons.includes("ArrowDown")) {
                camera.position.z += CAMERA_STEP;
            }
        }
        else {
            if (pushedButtons.includes("ArrowLeft")) {
                camera.position.x -= CAMERA_STEP;
            }
            if (pushedButtons.includes("ArrowRight")) {
                camera.position.x += CAMERA_STEP;
            }
            if (pushedButtons.includes("ArrowUp")) {
                camera.position.y += CAMERA_STEP;
            }
            if (pushedButtons.includes("ArrowDown")) {
                camera.position.y -= CAMERA_STEP;
            }
            if (pushedButtons.includes("4")) {
                camera.rotateY(ONE_DEGREE);
            }
            if (pushedButtons.includes("6")) {
                camera.rotateY(ONE_DEGREE * -1);
            }
            if (pushedButtons.includes("5")) {
                camera.rotateX(ONE_DEGREE * -1);
            }
            if (pushedButtons.includes("8")) {
                camera.rotateX(ONE_DEGREE);
            }
            if (pushedButtons.includes("1")) {
                camera.rotateZ(ONE_DEGREE * -1);
            }
            if (pushedButtons.includes("9")) {
                camera.rotateZ(ONE_DEGREE);
            }
        }
    }
    function keyPop(e) {
        while (pushedButtons.includes(e.key)) {
            pushedButtons.splice(pushedButtons.indexOf(e.key), 1);
        }
    }

    return camera;
}

module.exports = initializeCamera;