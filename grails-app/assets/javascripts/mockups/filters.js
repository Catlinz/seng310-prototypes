

var Filters = {
    distance: null,
    cover: null,

    updateUIAfterSearch: function(stats) {},

    setParams: function(params) {
        params = Filters.distance.setParams(params);
        params = Filters.cover.setParams(params);

        return params;
    },

    hashCode: function() {
        var str = Filters.distance.str() + Filters.cover.str();
        return str.hashCode()
    },

    initialise: function() {
        Filters.distance = new Filters.DistanceFilter();
        Filters.cover = new Filters.CoverChargeFilter();
    },

    DistanceFilter: function(center, maxRadiusMetres, minRadiusMetres) {
        this.center = center || {lat: 0, lng: 0};
        this.maxRadius = maxRadiusMetres || 0;
        this.minRadius = minRadiusMetres || 0;
    },

    CoverChargeFilter: function(min, max) {
        this.min = min || 0;
        this.max = max || 0;
    }
};

Filters.DistanceFilter.prototype = {
    constructor: Filters.DistanceFilter,

    str: function() {
        if (this.isValid()) {
            return 'DF' + this.center.lat + ' ' + this.center.lng + ' ' + this.maxRadius + ' ' + this.minRadius
        }
        else { return 'DF' }
    },

    isValid: function() { return this.minRadius != this.maxRadius; },

    reset: function() { this.maxRadius = 0;  this.minRadius = 0;  this.center = {lat: 0, lng: 0}; },

    setParams: function(params) {
        params['DistanceFilter'] = true;
        params['DistanceFilter.center.lat'] = this.center.lat;
        params['DistanceFilter.center.lng'] = this.center.lng;
        if (this.isValid()) {
            params['DistanceFilter.maxRadius'] = this.maxRadius;
            params['DistanceFilter.minRadius'] = this.minRadius;
        }
        return params;
    }
};

Filters.CoverChargeFilter.prototype = {
    constructor: Filters.CoverChargeFilter,

    str: function() {
        if (this.isValid()) { return 'CCF' + this.min + ' ' + this.max }
        else { return 'CCF' }
    },

    isValid: function() { return this.min < this.max; },
    reset: function() { this.min = 0; this.max = 0; },

    setParams: function(params) {
        params['CoverChargeFilter'] = true;
        if (this.isValid()) {
            params['CoverChargeFilter.min'] = this.min;
            params['CoverChargeFilter.max'] = this.max;
        }
        return params;
    }
};

var UI = window.UI || {};

UI.NumberFormat = function(params) {
    if (!params) { params = {}; }
    this.prefix = params.prefix || "";
    this.postfix = params.postfix || "";
    this.decimals = (params.decimals != undefined) ? params.decimals : 2;
};
UI.NumberFormat.prototype.format = function(num) { return this.prefix + num.toFixed(this.decimals) + this.postfix; };
UI.NumberFormat.Default = function() {
    return new UI.NumberFormat();
};
UI.NumberFormat.Currency = function(sym) {
    return new UI.NumberFormat({prefix: sym || "$", decimals: 2});
};
UI.NumberFormat.Distance = function(decimals) {
    return { format: function(num) { return (num < 1000) ? num.toFixed(decimals || 0) + "m" : (num / 1000).toFixed((decimals || 0) + 2) + "km"; } };
};

UI.NumberFormat.Price = function(sym) {
    return { format: function(amt) { return (amt) ? (sym || "$") + ((amt - parseInt(amt) == 0) ? amt.toFixed(0) : amt.toFixed(2)) : "Free"; } };
};


UI.RangeSlider = function(selector, range, format) {
    var jq = $(selector);
    this.dom = {
        root: jq,
        slider: jq.find(".slider"),
        active: jq.find(".bar .active"),
        start: jq.find('.slider .start'),
        end: jq.find('.slider .end'),
        text: jq.find('.text')
    };
    this.dragging = {
        touch: {x: 0, y: 0},
        origin: {x: 0, y: 0},
        dom: null
    };

    this.handleSize = {width: 0, height: 0};
    this.calculateHandleSize();

    this.format = format || UI.NumberFormat.Default();

    if (range) {
        if (range.rangeType) { this.range = range; }
        else if (range.min || range.max) { this.range = new UI.RangeSlider.NumberRange(range.min, range.max, range.type); }
        else if (range.length == 2) { this.range = new UI.RangeSlider.NumberRange(range[0], range[1]); }
        else { this.range = new UI.RangeSlider.NumberRange(0, 1); }
    }
    else { this.range = new UI.RangeSlider.NumberRange(0, 1); }
    this.values = [0, 0];
    this.calculateValues();
    this.dom.root.data('rangeSlider', this);
    this.registerEventHandlers("init");
};

UI.RangeSlider.prototype = {
    constructor: UI.RangeSlider,

    calculateHandleSize: function() {
        this.handleSize.width = this.dom.start.innerWidth() + parseInt(this.dom.start.css('border-right-width')) + parseInt(this.dom.start.css('border-left-width'));
        this.handleSize.height = this.dom.start.innerHeight() + parseInt(this.dom.start.css('border-top-width')) + parseInt(this.dom.start.css('border-bottom-width'));
    },

    calculateValues: function() {
        var len = this.size();
        var ds = this.startOffset() / len;
        var de = (len - this.endOffset()) / len;

        this.values[0] = this.range.get(ds);
        this.values[1] = this.range.get(de);

        this.updateValueText();
    },

    dragHandle: function(e) {
        var pos = this.getEventXY(e);
        var x = this.getNewOffset(this.dragging.dom, pos.x - this.dragging.touch.x);

        if (this.dragging.dom == this.dom.start) {
            this.dragging.dom.css('left', x);
            this.dom.active.css('left', x)
        }
        else {
            this.dragging.dom.css('right', x);
            this.dom.active.css('right', x);
        }
        this.calculateValues();
    },

    endOffset: function() { return parseFloat(this.dom.end.css('right')); },

    getEventXY: function(e) {
        if (e.originalEvent.changedTouches) {
            var touch = e.originalEvent.changedTouches[0];
            return {x: touch.pageX, y: touch.pageY};
        }
        else { return {x: e.pageX, y: e.pageY}; }
    },

    getNewOffset: function(handle, dx) {
        var new_x;
        var lim;
        if (handle == this.dom.start) {
            new_x = this.dragging.origin.x + dx;
            lim = [0, this.size() - this.endOffset()];
        }
        else {
            new_x = this.dragging.origin.x - dx;
            lim = [0, this.size() - this.startOffset()];
        }
        if (new_x < lim[0]) { new_x = lim[0]; }
        else if (new_x > lim[1]) { new_x = lim[1]; }
        return new_x;
    },

    grabHandle: function(handle, e) {
        this.dragging.dom = handle;
        this.dragging.touch = this.getEventXY(e);
        if (handle == this.dom.start) {
            this.dragging.origin.x = parseFloat(handle.css('left'));
        }
        else { this.dragging.origin.x = parseFloat(handle.css('right')); }

        if (e.originalEvent.changedTouches) { this.registerEventHandlers("touch"); }
        else { this.registerEventHandlers("click"); }
    },

    releaseHandle: function(e) {
        this.unregisterEventHandlers("drag");
        this.dragging.dom = null;
    },

    registerEventHandlers: function(stage) {
        var _this = this;
        if (stage == "init") {
            this.dom.start.on("touchstart.ui.rangeslider mousedown.ui.rangeslider", function(e) {
                _this.grabHandle(_this.dom.start, e);
                return false;
            });
            this.dom.end.on("touchstart.ui.rangeslider mousedown.ui.rangeslider", function(e) {
                _this.grabHandle(_this.dom.end, e);
                return false;
            });
        }
        else if (stage == "touch") {
            $(document).on("touchend.ui.rangeslider", function(en) { _this.releaseHandle(en); });
            $(document).on("touchmove.ui.rangeslider", function(en) {_this.dragHandle(en); });
        }
        else if (stage == "click") {
            $(document).on("mouseup.ui.rangeslider", function(en) { _this.releaseHandle(en); });
            $(document).on("mousemove.ui.rangeslider", function(en) {_this.dragHandle(en); });
        }
    },

    reset: function(min, max) {
        if (min != undefined && max != undefined) {
            this.range.set(min, max);
        }
        this.values[0] = this.range.min;
        this.values[1] = this.range.max;
        this.updateUIFromValues();
    },

    size: function() {
        return parseFloat(this.dom.slider.innerWidth()) - this.handleSize.width;
    },

    setValues: function(start, end) {
        this.values[0] = start;
        this.values[1] = end;
        this.updateUIFromValues();
    },

    setMinMax: function(min, max) {
        this.range.set(min, max);
        this.calculateValues();
        this.updateUIFromValues();
    },

    startOffset: function() { return parseFloat(this.dom.start.css('left')); },

    unregisterEventHandlers: function(stage) {
        if (stage == "init") {
            this.dom.start.off(".ui.touchslider");
            this.dom.end.off(".ui.touchslider");
        }
        else if (stage == "drag") {
            $(document).off(".ui.rangeslider");
        }
    },

    updateUIFromValues: function() {
        var len = this.size();
        var ds = this.range.dist(this.values[0]);
        var de = this.range.dist(this.values[1]);

        var left = ds*len;
        var right = len - de*len;
        if (this.dom.root.is(":visible")) {
            this.dom.start.animate({left: left}, 100);
            this.dom.end.animate({right: right}, 100);
            this.dom.active.animate({left: left, right: right}, 100)
        }
        else {
            this.dom.start.css('left', left);
            this.dom.end.css('right', right);
            this.dom.active.css({left: left, right: right});
        }
        this.updateValueText()
    },

    updateValueText: function() {
        this.dom.text.find('.start').text(this.format.format(this.values[0]));
        this.dom.text.find('.end').text(this.format.format(this.values[1]));
    }


};

UI.RangeSlider.NumberRange = function(min, max, type) {
    this.set(min, max);
    this.type = type || UI.RangeSlider.NumberRange.Real;
    this.rangeType = "NumberRange";
};

UI.RangeSlider.NumberRange.Real = "real";
UI.RangeSlider.NumberRange.Int = "int";

UI.RangeSlider.NumberRange.prototype = {
    constructor: UI.RangeSlider.NumberRange,

    dist: function(val) { return (val - this.min) / this.length; },

    get: function(dist) { return this['get_'+this.type](dist); },
    get_int: function(dist) { return Math.round(this.length*dist + this.min); },
    get_real: function(dist) { return this.length*dist + this.min; },

    set: function(min, max) {
        this.min = min; this.max = max;
        this.length = max - min;
    }
};

