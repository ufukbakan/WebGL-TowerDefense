const { PerspectiveCamera } = require("three");

function initializeCamera() {
    const camera = new PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.01, 10);
	camera.position.z = 50;

    const ONE_DEGREE = Math.PI / 180;
    const CAMERA_STEP = 0.03;

    var pushedButtons = [];

    window.addEventListener("keydown", keyPush);
    window.addEventListener("keyup", keyPop);
    
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