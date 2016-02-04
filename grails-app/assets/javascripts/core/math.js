//=require core

GM.Math = {
    easeOutCubic: function(x0, dx, t, duration) {
        t = (t / duration) - 1.0;
        return dx*(t*t*t + 1.0) + x0;
    }
};