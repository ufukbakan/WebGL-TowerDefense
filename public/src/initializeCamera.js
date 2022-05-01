const { Euler } = require("three");
const { Vector3 } = require("three");
const { PerspectiveCamera } = require("three");

function initializeCamera() {
    const camera = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.01, 10);
    const ONE_DEGREE = Math.PI / 180;
    const CAMERA_STEP = 0.001;
    let leftMouseDown = false;
    let rightMouseDown = false;
    let nextClickIsDouble = false;

    camera.position.z = 1.2;
    camera.position.y = 2.2;
    camera.rotateX(ONE_DEGREE*-70);

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
    function waitForDouble(e){
        e.preventDefault();
        if(nextClickIsDouble){
            camera.rotation.x = -40*ONE_DEGREE;
            camera.rotation.y = 0;
            camera.rotation.z = 0;
        }
        window.setTimeout(()=>{ nextClickIsDouble = false }, 200);
        nextClickIsDouble = true;
    }

    /**
     * 
     * @param {MouseEvent} e 
     */
    function toggleDownState(e){
        if(e.button == 0)
            leftMouseDown = !leftMouseDown;
        if(e.button == 2)
            rightMouseDown = !rightMouseDown;
    }

    /**
     * @param {MouseEvent} e
     */
    function handleCamera(e){
        if(leftMouseDown){
            //console.log(e.movementX); // sol eksi sağ artı
            //console.log(e.movementY); // yukarı eksi aşağı artı
            camera.position.x -= e.movementX * CAMERA_STEP;
            camera.position.z -= e.movementY * CAMERA_STEP;
        }else if(rightMouseDown){
            camera.rotateX(e.movementY*ONE_DEGREE*0.1);
            camera.rotateY(e.movementX*ONE_DEGREE*0.1);
        }
    }

    /**
     * 
     * @param {WheelEvent} e 
     */
    function zoom(e){
        if(e.deltaY > 0){
            camera.position.y += CAMERA_STEP*50;
            //camera.zoom *= 0.8;
        }else if(e.deltaY < 0){
            camera.position.y += CAMERA_STEP*-50;
            //camera.zoom *= 1.2;
        }
        //camera.updateProjectionMatrix();
    }
    
    function keyPush(e) {
        const key = e.key;
        if(!pushedButtons.includes(key))
            pushedButtons.push(key);

        if( pushedButtons.includes("Shift") ){
            if(pushedButtons.includes( "ArrowUp")){
                camera.position.z -= CAMERA_STEP;
            }
            if(pushedButtons.includes( "ArrowDown")){
                camera.position.z += CAMERA_STEP;
            }
        }
        else{
            if(pushedButtons.includes( "ArrowLeft")){
                camera.position.x -= CAMERA_STEP;                
            }
            if(pushedButtons.includes( "ArrowRight")){
                camera.position.x += CAMERA_STEP;
            }
            if(pushedButtons.includes( "ArrowUp")){
                camera.position.y += CAMERA_STEP;
            }
            if(pushedButtons.includes( "ArrowDown")){
                camera.position.y -= CAMERA_STEP;
            }
            if(pushedButtons.includes( "4" ) ){
                camera.rotateY(ONE_DEGREE);
            }
            if(pushedButtons.includes( "6" )){
                camera.rotateY(ONE_DEGREE*-1);
            }
            if(pushedButtons.includes( "5" ) ){
                camera.rotateX(ONE_DEGREE*-1);
            }
            if(pushedButtons.includes( "8" )){
                camera.rotateX(ONE_DEGREE);
            }
            if(pushedButtons.includes( "1" ) ){
                camera.rotateZ(ONE_DEGREE*-1);
            }
            if(pushedButtons.includes( "9" )){
                camera.rotateZ(ONE_DEGREE);
            }
        }
    }
    function keyPop(e){
        while(pushedButtons.includes(e.key)){
            pushedButtons.splice( pushedButtons.indexOf(e.key), 1);
        }
    }

    return camera;
}

module.exports = initializeCamera;