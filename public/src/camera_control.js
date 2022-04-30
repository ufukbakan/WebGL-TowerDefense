function setCameraEventListener() {
    window.addEventListener("keydown", camera_handler);
    
    function camera_handler(e) {
        console.log(e.key)
    }
}

module.exports = setCameraEventListener;