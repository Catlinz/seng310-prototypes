//=require core
//=require event
//=require math
//=require ../jquery.mousewheel

GM.Scroll = {

    initScrollableContent: function() {
        var elems = $(".gm-scrollable");

        for (var i = 0; i < elems.length; ++i) {
            var elem = $(elems[i]);
            if (!elem.data("scroll")) {
                new GM.Scroll.ScrollWrapper(elem);
            }
        }

        for (var i = 0; i < elems.length; ++i) {
            $(elems[i]).data("scroll").updateViewAndContentSize();
        }
    },

    lastTouchDown: null
};

/** Objects to encompass elements of scrollable element */

GM.Scroll.ScrollWrapper = function(elem) {
    /* Store the id and DOM element of the element we want to be scrollable. */
    this.elem = $(elem);
    this.elemID = this.elem.attr("id");

    this.elem.data("scroll", this);

    if (!this.elem.hasClass("gm-scrollable")) {
        this.elem.addClass("gm-scrollable");
    }

    /* Check to see if there already is a wrapper around it, if not,
       then we create the wrapper and make sure it has an ID. */
    this.dom = this.elem.parent(".gm-scroll_wrapper");
    if (this.dom.length == 0) {
        this.wrapScrollableElement();
    }
    else {
        if (!GM.hasAttr(this.dom, 'id')) { this.dom.attr('id', this.elemID + '_wrapper'); }
        this.domID = this.dom.attr('id');

        /* Now create the scrollbar object. */
        this.createScrollbar();
    }

    this.setProperties();

    /* Now that all the DOM creation is taken care of, we need to register
       the event handlers. */
    this.registerEventHandlers();
};

GM.Scroll.ScrollWrapper.prototype = {
    constructor: GM.Scroll.ScrollWrapper,

    cancelScroll: function() { this.scrollbar.stopScrolling(); },
    canScroll: function() { return this.view.height < this.content.height; },
    createScrollbar: function() { this.scrollbar = new GM.Scroll.Scrollbar(this); },

    distanceToBottom: function() {
        return this.scrollbar.max - this.content.dy;
    },

    dragContent: function(e) {
        this.cancelScroll();
        var pos = 0;
        if (e.originalEvent.changedTouches) {
            var touch = e.originalEvent.changedTouches[0];
            pos = touch.pageY;
        }
        else { pos = e.pageY }
        var dy = this.grabPos - pos;
        var y = this.origScroll + dy;
        this.setScroll(y);

        this.totalScroll += dy;
        this.lastPos[1] = this.lastPos[0];
        this.lastPos[0] = pos;
    },

    grabContent: function(e) {
        GM.Scroll.lastTouchDown = e.target;
        this.totalScroll = 0;
        if (this.canScroll() && !$(e.target).hasClass("gm-nograb")) {
            this.origScroll = this.content.dy;
            var _this = this;

            if (e.originalEvent.changedTouches) {
                this.grabPos = e.originalEvent.changedTouches[0].pageY;
                $(document).on("touchend.gmScrollContent", function(en) { _this.releaseContent(en); });
                $(document).on("touchmove.gmScrollContent", function(en) {_this.dragContent(en); });
            }
            else if (this.canGrabWithMouse) {
                this.grabPos = e.pageY;
                $(document).on("mouseup.gmScrollContent", function(en) { _this.releaseContent(en); });
                $(document).on("mousemove.gmScrollContent", function(en) {_this.dragContent(en); });
            }
            this.lastPos = [this.grabPos, this.grabPos];
            return true;
        }
        else { return false; }
    },

    handleScrollEvent: function(e) {
        this.updateViewAndContentSize();
        return !this.scrollbar.addScroll(-e.deltaY*this.distPerScroll, this.durationMilli);
    },

    off: function(action) { this.h.off(action); },

    on: function(action, func) { return this.h.on(action, func); },

    parseProperties: function(e) {},

    releaseContent: function(e) {
        this.totalScroll += this.lastPos[1] - this.lastPos[0];
        if (Math.abs(this.totalScroll) < 20 && e.target == GM.Scroll.lastTouchDown) {
            if (e.target.nodeName == 'A') { $(e.target).click(); }
            else {
                ($(e.target).parents("a")).click();
            }
        }
        $(document).off(".gmScrollContent");
        this.scrollBy(this.lastPos[1] - this.lastPos[0]);
    },

    registerEventHandlers: function() {
        var _this = this;
        this.elem.on("mousewheel.gmScroll", function(e) { return _this.handleScrollEvent(e) });
        if (this.canGrabWithTouch) {
            this.elem.on("touchstart.gmScroll", function(e) { return !_this.grabContent(e); });
        }
        if (this.canGrabWithMouse) {
            this.elem.on("mousedown.gmScroll", function(e) { return !_this.grabContent(e); });
        }
        $(window).on("resize.gmScroll."+this.elemID, function() { _this.updateViewAndContentSize(); });
        this.scrollbar.registerEventHandlers();
    },

    scrollBy: function(dy, durationMilli) {
        if (durationMilli == undefined) { durationMilli = this.durationMilli; }
        this.scrollbar.addScroll(dy, durationMilli);
    },

    setContentScroll: function(y) {
        this.elem.css({'top': -y});
        this.content.dy = y;
    },

    setProperties: function() {
        this.view = {height: 0};
        this.content = {height: 0, dy: 0};
        this.h = new GM.Handlers({allowed: "scroll", obj: this});

        this.totalScroll = 0;
        this.origScroll = 0;
        this.grabPos = 0;
        this.lastPos = [0, 0];

        this.distPerScroll = 56.0;
        this.durationMilli = 200;

        this.canGrabWithMouse = false;
        this.canGrabWithTouch = true;

        this.parseProperties(this.elem);
        this.updateViewAndContentSize();
    },

    setScroll: function(y) {
        if (y < 0) { y = 0; }
        else if (y > this.scrollbar.max) { y = this.scrollbar.max; }
        this.setContentScroll(y);
        this.scrollbar.setHandleScroll(y);
        this.h.fire('scroll');
    },

    updateViewAndContentSize: function() {
        var v_h = this.dom.innerHeight();
        var c_h = this.elem.innerHeight();
        if (v_h != this.view.height || c_h != this.content.height) {
            this.view.height = v_h;
            this.content.height = c_h;

            this.scrollbar.updateLayout();
            if (this.content.dy > this.scrollbar.max) {
                this.setScroll(this.scrollbar.max);
            }
            return true;
        }
        else { return false; }
    },

    unregisterEventHandlers: function() {
        this.elem.off("scroll.gmScroll");
        $(window).off("resize.gmScroll."+this.elemID);
    },

    wrapScrollableElement: function() {
        this.domID = this.elemID + '_wrapper';
        this.dom = this.elem.wrap('<div class="gm-scroll_wrapper" id="'+this.domID+'"></div>').parent();
        this.createScrollbar();
    }
};

GM.Scroll.Scrollbar = function(wrapper) {
    this.wrap = wrapper;

    /* Check to see if there is a scrollbar already, if not, create one */
    this.dom = this.wrap.dom.children('.gm-scroll_scrollbar');
    if (this.dom.length == 0) {
        this.createScrollbar();
    }
    else {
        if (!GM.hasAttr(this.dom, 'id')) { this.dom.attr('id', this.wrap.elemID + '_scrollbar'); }
        this.domID = this.dom.attr('id');

        this.handle = {dom: this.dom.children(".gm-scroll-handle"), length: 0};
    }

    this.setProperties();
};

GM.Scroll.Scrollbar.prototype = {
    constructor: GM.Scroll.Scrollbar,

    addScroll: function(dy, durationMilli) {
        dy = this.getScrollY(dy);

        if (dy == 0) { return false; }

        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = 0;
            this.dist = 0;
        }

        if (Math.abs(dy) <= 1) {
            if (dy > 0 && (this.max - this.wrap.content.dy) <= 2) { this.wrap.setScroll(this.max); }
            else if (dy < 1 && (this.wrap.content.dy <= 2)) { this.wrap.setScroll(0); }
            return true;
        }
        else {
            this.start = this.wrap.content.dy;
            this.dist = dy;
            this.end = this.start + dy;
            this.durationMilli = durationMilli;
            this.scrollStepMilli = durationMilli / 100;
            this.elapsedMilli = 0;

            this.animateScroll();
            return true;
        }
    },

    animateScroll: function() {
        this.elapsedMilli += this.scrollStepMilli;

        var y = GM.Math.easeOutCubic(this.start, this.dist, this.elapsedMilli, this.durationMilli);

        this.wrap.setContentScroll(y);
        this.setHandleScroll(y);

        if (this.elapsedMilli < this.durationMilli) {
            var _this = this;
            this.scrollTimeout = setTimeout(function () { _this.animateScroll(); }, this.scrollStepMilli);
        }
        else {
            this.scrollTimeout = 0;
            this.dist = 0;
            this.wrap.h.fire('scroll');
        }
    },

    updateLayout: function() {
        this.max = Math.max(0, this.wrap.content.height - this.wrap.view.height);
        this.handle.length = this.calculateHandleSize();
        this.handle.dom.css('height', this.handle.length);

        this.setHandleScroll(this.wrap.content.dy);

        if (!this.wrap.canScroll() && this.autoHide) {
            this.hide(200);
        }
        else {
            this.show(200);
        }
    },

    calculateHandleSize: function() {
        var len = Math.round((this.wrap.view.height/this.wrap.content.height) * this.wrap.view.height);
        if (len > this.wrap.view.height) { len = this.wrap.view.height; }
        else if (len < 20) { len = 20; }
        return len;
    },

    stopScrolling: function() {
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = 0;
            this.dist = 0;
            this.wrap.h.fire('scroll');
        }
    },

    createScrollbar: function() {
        this.domID = this.wrap.elemID + '_scrollbar';
        this.dom = $('<div class="gm-scroll_scrollbar hidden" id="'+this.domID+'"></div>');

        var handleID = this.wrap.elemID + '_handle';
        this.handle = {dom: $('<div class="gm-scroll_handle" id="'+handleID+'"></div>'), length: 0};

        this.dom.append(this.handle.dom);
        this.wrap.dom.append(this.dom);
    },

    getScrollY: function(dy) {
        var max_scroll = this.max - this.wrap.content.dy;
        var min_scroll = -this.wrap.content.dy;

        /* already scrolling in same dir */
        if (this.dist*dy > 0) { dy += this.dist - (this.wrap.content.dy - this.start); }

        if (dy > 0) {
            if (max_scroll <= 0) { return 0; }
            else { return (dy < max_scroll) ? dy : max_scroll; }
        }
        else if (dy < 0) {
            if (min_scroll >= 0) { return 0; }
            else { return (dy > min_scroll) ? dy : min_scroll; }
        }
        else { return 0; }
    },

    grabHandle: function(e) {
        if (this.wrap.canScroll()) {
            this.scrollPos = parseFloat(this.handle.dom.css('top'));
            var _this = this;

            if (e.originalEvent.changedTouches) {
                var touch = e.originalEvent.changedTouches[0];
                this.mousePos = touch.pageY;
                $(document).on("touchend.gmScrollHandle", function() { _this.releaseHandle(); });
                $(document).on("touchmove.gmScrollHandle", function(e) {_this.dragHandle(e); });
            }
            else {
                this.mousePos = e.pageY;
                $(document).on("mouseup.gmScrollHandle", function() { _this.releaseHandle(); });
                $(document).on("mousemove.gmScrollHandle", function(e) {_this.dragHandle(e); });
            }
            return true;
        }
        else { return false; }
    },

    hide: function(ms) {
        this.dom.stop(true);
        if (!this.dom.hasClass("hidden")) {
            var _this = this;
            this.dom.animate({opacity: 0}, ms, function() { _this.dom.removeClass("hidden").addClass("hidden"); });
        }
    },

    parseProperties: function(e) {
        if (e.attr('data-gmShow') == "false") { this.hidden = true; }
        if (e.attr('data-gmAutoHide') == "true") { this.autoHide = true; }
        if (e.attr('data-gmAutoHideTimer')) { this.autoHideTimer = parseInt(e.attr('data-gmAutoHideTimer')); }

        e.removeAttr("data-gmShow");
        e.removeAttr("data-gmAutoHide");
        e.removeAttr("data-gmAutoHideTimer");

    },

    show: function(ms) {
        if (!this.hidden) {
            this.dom.stop(true);
            this.dom.removeClass("hidden");
            this.dom.animate({opacity: 1.0}, ms);
        }
    },

    dragHandle: function(e) {
        this.stopScrolling();
        var dy = 0;
        if (e.originalEvent.changedTouches) {
            var touch = e.originalEvent.changedTouches[0];
            dy = this.mousePos - touch.pageY;
        }
        else {
            dy = this.mousePos - e.pageY;
        }
        var hy = this.scrollPos - dy;
        var ratio = hy / parseFloat(this.wrap.view.height - this.handle.length);
        var y = ratio * this.max;
        this.wrap.setScroll(y);
    },

    releaseHandle: function() { $(document).off(".gmScrollHandle"); },

    registerEventHandlers: function() {
        var _this = this;
        this.handle.dom.on("mousedown", function(e) { return !_this.grabHandle(e); });
        this.handle.dom.on("touchstart", function(e) { return !_this.grabHandle(e); });
    },

    setHandleScroll: function(y) {
        this.handle.dom.css('top', ((y/this.max)*(this.wrap.view.height - this.handle.length)));
    },

    setProperties: function() {
        this.scrollTimeout = 0;
        this.dist = 0;
        this.start = 0;
        this.end = 0;
        this.durationMilli = 0;
        this.scrollStepMilli = 0;
        this.elapsedMilli = 0;
        this.max = 0;

        this.mousePos = 0;
        this.scrollPos = 0;
        this.handle.length = this.handle.dom.innerHeight();

        this.hidden = false;
        this.autoHide = false;
        this.autoHideTimer = 0;

        this.parseProperties(this.wrap.elem);

        if (this.hidden) {
            this.hide(0);
        }
    }
};