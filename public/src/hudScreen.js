const { Texture } = require("three");
const { PlaneGeometry } = require("three");
const { CameraHelper } = require("three");
const { Color } = require("three");
const { Object3D } = require("three");
const { PointLight } = require("three");
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
    var canvas = renderer.domElement;

    var hudCamera = new OrthographicCamera(-canvas.width * 5, canvas.width * 5,
        canvas.height * 5, -canvas.height * 5,
        0, 100);

    hudCamera.position.set(0, 0, 10);

    var hudScene = new Scene();
    hudScene.name = "UIScene";

    var element = createUIText(canvas, [-0.8, 0.3], [0.8, 0.4], "BaseTower", 50, "rgba(0,0,0,1)", "rgba(100,0,0,0.5)", "rgba(30,0,0,0.5)");
    var element1 = createUIText(canvas, [-0.8, 0], [0.8, 0.4], "BaseTower", 50, "rgba(0,0,0,1)", "rgba(100,0,0,0.5)", "rgba(30,0,0,0.5)");
    var element2 = createUIText(canvas, [-0.8, -0.3], [0.8, 0.4], "BaseTower", 50, "rgba(0,0,0,1)", "rgba(100,0,0,0.5)", "rgba(30,0,0,0.5)");
    var element3 = createUIBackground(canvas, [-0.8, 0], [1, 3], "rgba(100,0,0,0.5)", "rgba(30,0,0,0.5)");
    var element4 = createUIText(canvas, [-0.8, 0.5], [0.8, 0.4], "Choose Tower", 50, "rgba(0,0,0,1)");
    element4.userData.content = undefined;
    hudScene.add(element);
    hudScene.add(element1);
    hudScene.add(element2);
    hudScene.add(element3);
    hudScene.add(element4);

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
function createUIText(canvas, clipPosition, ratios, text, fontSize, fontColor, backGroundColor = undefined, borderColor = undefined) {

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
    hudPlane.userData.content = text;

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

module.exports = hudScreen;