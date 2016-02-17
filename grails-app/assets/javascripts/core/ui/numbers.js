//=require core

var UI = window.UI || {};

UI.NumberFormat = function(params) {
    if (!params) { params = {}; }
    this.prefix = params.prefix || "";
    this.postfix = params.postfix || "";
    this.decimals = (params.decimals != undefined) ? params.decimals : 2;
};
UI.NumberFormat.prototype.format = function(num) { return this.prefix + num.toFixed(this.decimals) + this.postfix; };
UI.NumberFormat.Default = function() { return new UI.NumberFormat(); };
UI.NumberFormat.Currency = function(sym) { return new UI.NumberFormat({prefix: sym || "$", decimals: 2}); };
UI.NumberFormat.Distance = function(decimals) {
    return { format: function(num) { return (num < 1000) ? num.toFixed(decimals || 0) + "m" : (num / 1000).toFixed((decimals || 0) + 2) + "km"; } };
};

UI.NumberFormat.Price = function(sym) {
    return { format: function(amt) { return (amt) ? (sym || "$") + ((amt - parseInt(amt) == 0) ? amt.toFixed(0) : amt.toFixed(2)) : "Free"; } };
};




UI.NumberRange = function(min, max, type) {
    this.set(min, max);
    this.type = type || "Real";
    this.rangeType = "NumberRange";
};
UI.NumberRange.prototype.dist = function(val) { return UI.NumberRange.fn_dist[(this.type)](val, this.length, this.min); };
UI.NumberRange.prototype.get = function(dist) { return UI.NumberRange.fn_get[(this.type)](dist, this.length, this.min); };
UI.NumberRange.prototype.set = function(min, max) { this.min = min; this.max = max;  this.length = max - min; };

UI.NumberRange.Real = function(min, max) { return new UI.NumberRange(min, max, "Real"); };
UI.NumberRange.Int = function(min, max) { return new UI.NumberRange(min, max, "Int"); };
UI.NumberRange.RealExp = function(min, max) { return new UI.NumberRange(min, max, "RealExp"); };
UI.NumberRange.IntExp = function(min, max) { return new UI.NumberRange(min, max, "IntExp"); };

UI.NumberRange.fn_get = {
    Int: function(dist, len, min) { return Math.round(len*dist + min); },
    IntExp: function(dist, len, min) { return Math.round(len*(Math.pow(dist, 4)) + min); },

    Real: function(dist, len, min) { return len*dist + min; },
    RealExp: function(dist, len, min) { return len*(Math.pow(dist, 4)) + min; }
};

UI.NumberRange.fn_dist = {
    Int: function(val, len, min) { return (val - min) / len; },
    IntExp: function(val, len, min) { return (Math.pow((val - min) / len, 1/4.0)) },

    Real: function(val, len, min) { return (val - min) / len; },
    RealExp: function(val, len, min) { return (Math.pow((val - min) / len, 1/4.0)) }
};
