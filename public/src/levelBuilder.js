const { spawnEnemies } = require("./spawnEnemies");
const { timeout } = require("timeout");

let infoBox = document.createElement("div");
let level = 0;
let remainingMobs = 0;
infoBox.classList.add("info-box");
const ui = document.querySelector("#ui");
ui.appendChild(infoBox);
const typesOfMobsForEachLevel = [
    [0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
];
var globalScene;

/**
 * 
 * @param {THREE.Scene} scene 
 */
function simulateLevels(scene) {
    globalScene = scene;
    countdownBeforeNextLevel(2);
}

/**
 * 
 * @param {Number} count 
 */
function countdownBeforeNextLevel(count) {
    infoBox.innerHTML = getCountdownBox(count).outerHTML;
    if (count > 1) {
        timeout(1000, () => countdownBeforeNextLevel(count - 1));
        // ! set timeout ile laglı bir şekilde çalışıyor
        //setTimeout(() => countdownBeforeNextLevel(count - 1), 1000);
    } else {
        timeout(1000, () => nextLevel());
        //setTimeout(() => nextLevel(), 1000);
    }
}

function getCountdownBox(n) {
    let countBox = document.createElement("span");
    countBox.classList.add("countdown");
    countBox.innerText = n;
    return countBox;
}

function updateLevelInfo() {
    const levelBox = document.createElement("span");
    levelBox.classList.add("level-info");
    levelBox.innerText = "Level " + level + " " + remainingMobs + "/" + typesOfMobsForEachLevel[level - 1].length;
    infoBox.innerHTML = levelBox.outerHTML;
}

function nextLevel() {
    level++;
    remainingMobs = typesOfMobsForEachLevel[level - 1].length;
    updateLevelInfo();
    spawnLevelMobs(level, 0);
}

function spawnLevelMobs(level, nSpawned) {
    let mobsOfLevel = typesOfMobsForEachLevel[level - 1];
    if (nSpawned >= mobsOfLevel.length) {
        // hepsi spawnlandı
    } else {
        spawnEnemies(globalScene, mobsOfLevel[nSpawned], 1);
        timeout(1000, ()=> spawnLevelMobs(level, nSpawned+1));
    }
}

function decreaseRemainingMobs() {
    remainingMobs -= 1;
    updateLevelInfo();
    if (remainingMobs == 0) {
        countdownBeforeNextLevel(3);
    }
}

module.exports = { simulateLevels, decreaseRemainingMobs };