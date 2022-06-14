const { Texture } = require("three");
const { PlaneGeometry } = require("three");
const { Object3D } = require("three");
const { Mesh } = require("three");
const { MeshBasicMaterial } = require("three");
const { Scene } = require("three");
const { OrthographicCamera } = require("three");
const { pickingObject } = require("./pickingObject");



/**
 * 
 * @param {THREE.Renderer} renderer 
 */
function hudScreen(renderer, mainScene, mainCamera) {
    const canvas = renderer.domElement;

    const hudCamera = new OrthographicCamera(-canvas.width * 5, canvas.width * 5, canvas.height * 5, -canvas.height * 5, 0, 100);

    hudCamera.position.set(0, 0, 1);

    const hudScene = new Scene();
    hudScene.name = "UIScene";

    const header = createUIText(canvas, [-0.8, 0.3], [0.7, 0.2], "Place Turret", 280, "rgba(0,0,0,1)");
    const laserTurretText = createUIText(canvas, [-0.8, 0.2], [0.7, 0.2], "Laser Turret (50 Gold)", 200, "rgba(0,0,0,1)", "rgba(0,0,0,0.0)", "rgba(255,200,100,1)", "Turret0");
    const blueLaserTurretText = createUIText(canvas, [-0.8, 0.1], [0.7, 0.2], "Blue Laser Turret (100 Gold)", 200, "rgba(0,0,0,1)", "rgba(0,0,0,0.0)", "rgba(255,200,100,1)", "Turret1");
    const uiBackground = createUIBackground(canvas, [-0.8, 0], [0.75, 2], "rgba(255,255,255,0.5)", "rgba(30,0,0,0.5)");

    header.userData.content = undefined;
    hudScene.add(header);
    hudScene.add(laserTurretText);
    hudScene.add(blueLaserTurretText);
    hudScene.add(uiBackground);

    pickingObject(renderer, mainScene, hudScene, mainCamera, hudCamera);
    return [hudScene, hudCamera]
}

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @param {Object3D} obj 
 * @returns 
 */
function clipToUI(canvas, obj, clipPosition) {
    let realPosition = { x: 0, y: 0 };

    let width = canvas.width * 5;
    let height = canvas.height * 5;

    realPosition.x = clipPosition[0] * width /*- ((obj.geometry.parameters.width / 2) * (Math.abs(clipPosition[0]) / clipPosition[0]))*/;
    realPosition.y = clipPosition[1] * height /*- ((obj.geometry.parameters.height / 2) * (Math.abs(clipPosition[1]) / clipPosition[1]))*/;
    return realPosition;
}

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @returns 
 */
function createUIText(canvas, clipPosition, ratios, text, fontSize, fontColor, backGroundColor = undefined, borderColor = undefined, ref=undefined) {

    let hudCanvas = document.createElement("canvas");
    let width = canvas.width * ratios[0] * 2;
    let height = canvas.height * ratios[1] * 2;

    hudCanvas.width = width;
    hudCanvas.height = height;

    let hudContext = hudCanvas.getContext("2d");

    if (backGroundColor != undefined) {
        hudContext.fillStyle = backGroundColor;
        hudContext.fillRect(0, 0, width, height);
    } else {
        hudContext.fillStyle = "rgba(255,0,1,0)";
        hudContext.fillRect(0, 0, width, height);
    }

    hudContext.font = "Normal " + fontSize + "px Arial";
    hudContext.textAlign = "center";
    hudContext.fillStyle = fontColor;
    hudContext.fillText(text, width / 2, height / 2);

    if (borderColor != undefined) {
        hudContext.beginPath();
        hudContext.lineWidth = "20";
        hudContext.strokeStyle = borderColor;
        hudContext.rect(0, 0, width, height);
        hudContext.stroke();
    }

    let hudTexture = new Texture(hudCanvas);
    hudTexture.needsUpdate = true;
    let material = new MeshBasicMaterial({ map: hudTexture });
    material.transparent = true;
    let hudPlane = new Mesh(new PlaneGeometry(width, height), material);
    hudPlane.name = "TextMesh";

    let planePos = clipToUI(canvas, hudPlane, clipPosition);
    hudPlane.position.set(planePos.x, planePos.y, 0);
    hudPlane.userData.ref = ref;

    return hudPlane;
}


/**
 * 
 * @param {HTMLCanvasElement} canvas 
 */
function createUIBackground(canvas, clipPosition, ratios, backGroundColor, borderColor) {

    let hudCanvas = document.createElement("canvas");
    let width = canvas.width * ratios[0] * 2;
    let height = canvas.height * ratios[1] * 2;

    hudCanvas.width = width;
    hudCanvas.height = height;

    let hudContext = hudCanvas.getContext("2d");

    hudContext.fillStyle = backGroundColor;
    hudContext.fillRect(0, 0, width, height);

    hudContext.beginPath();
    hudContext.lineWidth = "20";
    hudContext.strokeStyle = borderColor;
    hudContext.rect(0, 0, width, height);
    hudContext.stroke();

    let hudTexture = new Texture(hudCanvas);
    hudTexture.needsUpdate = true;
    let material = new MeshBasicMaterial({ map: hudTexture });
    material.transparent = true;
    let hudPlane = new Mesh(new PlaneGeometry(width, height), material);
    hudPlane.name = "TextMesh";

    let planePos = clipToUI(canvas, hudPlane, clipPosition);
    hudPlane.position.set(planePos.x, planePos.y, -0.5);

    return hudPlane;
}

module.exports = {hudScreen, createUIText};