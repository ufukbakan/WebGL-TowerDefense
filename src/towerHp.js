/** @type{HTMLDivElement} */let hpBar;
/** @type{HTMLDivElement} */ let loseWinUi;
function initHpBar(){
    const ui = document.getElementById("ui");
    const wrapper = document.createElement("div");
    loseWinUi = document.getElementById("lose-win-ui");
    wrapper.classList.add("hpbar-wrapper");
    hpBar = document.createElement("div");
    hpBar.classList.add("hpbar");
    hpBar.style.width = "100%";

    wrapper.appendChild(hpBar);
    ui.appendChild(wrapper);
}

/**
 * @param {Number} value 
 */
function setHpBar(value){
    if(value > 0){
        hpBar.style.width = value+"%";
    }else{
        hpBar.style.width = "0";
        loseWinUi.innerText = "YOU LOST";
        loseWinUi.classList.remove("hide");
    }
}

module.exports = {
    initHpBar, setHpBar
}