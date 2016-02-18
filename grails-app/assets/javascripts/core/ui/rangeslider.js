//=require numbers
//=require ../event

var UI = window.UI || {};

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

    this.h = new GM.Handlers({obj: this});

    if (range) {
        if (range.rangeType) { this.range = range; }
        else if (range.min || range.max) { this.range = new UI.NumberRange(range.min, range.max, range.type); }
        else if (range.length == 2) { this.range = new UI.NumberRange(range[0], range[1]); }
        else { this.range = new UI.NumberRange(0, 1); }
    }
    else { this.range = new UI.NumberRange(0, 1); }
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

    fire: function(action) { this.h.fire(action); },

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

    off: function(action) { this.h.off(action); },
    on: function(action, func) { return this.h.on(action, func); },

    releaseHandle: function(e) {
        this.unregisterEventHandlers("drag");
        this.dragging.dom = null;
        this.fire("change");
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

    set: function(minVal, maxVal, minRange, maxRange) {
        if (GM.notNull(minVal)) { this.values[0] = minVal; }
        if (GM.notNull(maxVal)) { this.values[1] = maxVal; }
        if (!GM.notNull(minRange)) { minRange = this.range.min; }
        if (!GM.notNull(maxRange)) { maxRange = this.range.max; }
        this.range.set(minRange, maxRange);
        this.updateUIFromValues();
    },

    setValues: function(start, end) {
        this.values[0] = start;
        this.values[1] = end;
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

        console.log(this);
        this.dom.start.css('left', left);
        this.dom.end.css('right', right);
        this.dom.active.css({left: left, right: right});
        this.updateValueText()
    },

    updateValueText: function() {
        this.dom.text.find('.start').text(this.format.format(this.values[0]));
        this.dom.text.find('.end').text(this.format.format(this.values[1]));
    }


};