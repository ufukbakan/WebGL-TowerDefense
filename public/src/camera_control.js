function setCameraEventListener(camera) {
    var pushedButtons = [];

    window.addEventListener("keydown", keyPush);
    window.addEventListener("keyup", keyPop);
    
    function keyPush(e) {
        const key = e.key;
        pushedButtons.push(key);

        if( pushedButtons.includes("Shift") ){
            if(key == "ArrowUp"){
                camera.position.z += 0.1;
            }
            else if(key == "ArrowDown"){
                camera.position.z -= 0.1;
            }
        }
        else{
            if(key == "ArrowLeft"){
                camera.position.x -= 0.1;                
            }
            else if(key == "ArrowRight"){
                camera.position.x += 0.1;
            }
            else if(key == "ArrowUp"){
                camera.position.y += 0.1;
            }
            else if(key == "ArrowDown"){
                camera.position.y -= 0.1;
            }
        }
    }
    function keyPop(e){
        pushedButtons.splice( pushedButtons.indexOf(e.key), 1);
    }
}

module.exports = setCameraEventListener;