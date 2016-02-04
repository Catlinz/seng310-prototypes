//=require core

GM.Spinner = function(forElem, style, numDots) {
    this.container = $(forElem);
    this.id = this.container.attr('id');
    this.style = style || GM.Spinner.MEDIUM;
    this.numDots = numDots || 8;
    this.size = 0;
    this.sizeChanged = false;
    this.timer = 0;
    this.speed = 1000;
    this.visible = false;
    this.init(this.numDots);
    return this;
};

GM.Spinner.prototype = {
    constructor: GM.Spinner,

    attachEventHandlers: function() {
        var _this = this;
        $(window).on("resize.spinner_"+this.id, function() {
            _this.autoSetSize();  _this.autoSetPosition();
        });
    },

    autoSetPosition: function() {
        var h = this.container.innerHeight();
        var top = (h - this.size) / 2;
        this.spinner.css({'top': top});

        if (this.sizeChanged) {
            /* Calculate the positions for the dots */
            var delta = -(Math.PI * 2) / this.numDots;
            var ds = $(this.dots[0]).width() / 2;
            var factor = 0.5 * this.size - ds;
            for (var i = 0; i < this.numDots; ++i) {
                var d_left = (Math.cos(i*delta) + 1) * factor - ds;
                var d_top = Math.abs(Math.sin(i*delta) - 1) * factor - ds;
                $(this.dots[i]).css({'top': d_top, 'left': d_left});
            }
            this.sizeChanged = false;
        }

    },

    autoSetSize: function() {
        var old_size = this.size;
        var c_dim = Math.min(this.container.innerWidth(), this.container.innerHeight());
        if (this.style == GM.Spinner.SMALL) {
            this.size = c_dim * 0.3;
        }
        else if (this.style == GM.Spinner.MEDIUM) {
            this.size = c_dim * 0.5;
        }
        else {
            this.size = c_dim * 0.9;
        }
        this.sizeChanged = (this.size != old_size);
        this.spinner.width(this.size);
        this.spinner.height(this.size);
    },

    detachEventHandlers: function() {
        $(window).off("resize.spinner_"+this.id);
    },

    init: function(numDots) {
        /* Create the blocker */
        this.blocker = $('<div class="gm-spinner-block">');
        var cont_div = $('<div class="gm-spinner '+this.style+'">');

        for (var i = 0; i < numDots; ++i) {
            var dot = $('<div class="gms-dot">');
            dot.data("index", i);
            cont_div.append(dot);
        }

        this.spinner = cont_div;
        this.dots = cont_div.find("div.gms-dot");
    },

    hide: function() {
        this.detachEventHandlers();
        var _this = this;
        this.blocker.fadeOut(100, function() { _this.blocker.detach(); });
        this.spinner.fadeOut(100, function() {
            _this.spinner.detach();
            _this.visible = false;
            clearTimeout(_this.timer);
            _this.timer = 0;
        })
    },

    show: function() {

        this.dots.removeClass("current");
        $(this.dots[0]).addClass("current");

        this.container.append(this.blocker);
        this.container.append(this.spinner);
        this.autoSetSize();
        this.autoSetPosition();
        this.blocker.fadeIn(100);
        this.spinner.fadeIn(100);
        this.visible = true;
        this.attachEventHandlers();
        this.step();
    },

    step: function() {
        var dot = this.dots.filter(".current");
        var idx = dot.data("index");
        dot.removeClass("current");
        idx = (idx + 1) % this.numDots;
        $(this.dots[idx]).addClass("current");
        var _this = this;
        if (this.visible) {
            this.timeout = setTimeout(function(){ _this.step(); }, this.speed);
        }

    }
};
GM.Spinner.SMALL = "small";
GM.Spinner.MEDIUM = "medium";
GM.Spinner.LARGE = "large";