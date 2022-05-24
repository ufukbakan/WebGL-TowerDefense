const ProcessTimer = require('process-timer');
/**
 * @param {Number} milliseconds 
 * @param {Function} callback 
 */
function Timeout(milliseconds, callback){
    const timer = new ProcessTimer();
    let executeAfter = timer.msec + milliseconds;
    requestAnimationFrame(tick.bind(timer, executeAfter, callback));
}

function tick(executeAfter, callback){
    if(this.msec < executeAfter){
        requestAnimationFrame(tick.bind(this, executeAfter, callback));
    }else{
        callback();
    }
}

module.exports = { Timeout };