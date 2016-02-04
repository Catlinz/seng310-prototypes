//=require ../core/core.js
if (GM.App == undefined) { GM.App = {}; }

GM.App.sleep = function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
};