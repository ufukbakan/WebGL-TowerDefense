let coins = 50;
let coinBox = document.createElement("div");
coinBox.classList.add("coin-box");
coinBox.addEventListener("animationend", ()=> coinBox.classList.remove("animate-warn"));
const ui = document.querySelector("#ui");
ui.appendChild(coinBox);
updateCoinBox();

const prices = {
    "Turret0": 25
}

/**
 * @param {Number} x 
 */
function addCoins(x){
    coins += x;
    updateCoinBox();
}

/**
 * @param {Number} x 
 */
function spendCoins(x){
    coins -= x;
    updateCoinBox();
}

/**
 * @param {String} type 
 */
function buyTurret(type){
    if(coins >= prices[type]){
        spendCoins(prices[type]);
        return true;
    }else{
        coinBox.classList.add("animate-warn");
    }
    return false;
}

/**
 * @param {Number} x 
 */
 function updateCoinBox(){
    coinBox.innerText = "Gold: " + coins;
}

module.exports = {
    addCoins, buyTurret
}