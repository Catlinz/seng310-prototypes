//=require core

GM.Menu = function(id) {
    this.id = id;
    this.menu = $("#"+id);
    this.visible = false;
    this.trigger = null;
    this.align = "center";

    if (this.menu.length > 0) { this.init(); }

    return this;
};

GM.Menu.prototype = {
    constructor: GM.Menu,

    attachToTrigger: function() {
        /* Try to find a link for the menu */
        var links = $('[data-menu-id="'+this.id+'"]');

        for (var i = 0; i < links.length; ++i) {
            var link = $(links[i]);
            link.data('menu', this);
            link.removeAttr('data-menu-id');
            link.removeClass("gm-menu-toggle").addClass("gm-menu-toggle");
            link.on("click", function() {
                $(this).data('menu').toggleVisibility(this);
            });
        }
    },

    attachEventHandlers: function() {
        var _this = this;
        $(window).on("resize.gmMenu."+this.id, function() { _this.autoSetPosition(); });
        setTimeout( function() {
            $(document).on("click.gmMenu."+_this.id, function(e) {
            if ((e.target.id != _this.id && $(e.target).parents("#"+_this.id).length == 0)) { _this.hide(); }
        });
        }, 100);

        /* Fix issue with ipad delay in creating click event. */
        $(document).on("touchend.gmMenu."+_this.id, function(e) {
            var t = $(e.target);
            if ((t.attr('id') != _this.id && t.parents("#"+_this.id).length == 0) &&
                (t.data('menu') != _this && t.parents(".gm-menu-toggle").data('menu') != _this)) {
                setTimeout(function() { _this.hide(); }, 500);
            }
        });
    },

    autoSetPosition: function() {
        if (this.trigger == null) { return; }

        var anchor = {pos: this.trigger.offset(), width: this.trigger.innerWidth(), height: this.trigger.innerHeight()};
        var size = {width: this.menu.innerWidth(), height: this.menu.innerHeight()};

        if (this.align == "right") { var pos = this.calcPosRight(anchor, size); }
        else if (this.align == "left") { var pos = this.calcPosLeft(anchor, size); }
        else { var pos = this.calcPosCenter(anchor, size); }

        if (this.fixed) {
            pos.left -= $(window).scrollLeft();
            pos.top -= $(window).scrollTop();
        }

        /* Make sure menu is within bounds */
        if (pos.left < 5) { pos.left = 5; }
        else if (pos.left + size.width + 5 > $(document).width()) {
            pos.left = $(document).width() - size.width - 5;
        }
        if (pos.top < 5) { pos.top = 5; }
        else if (pos.top + size.height + 5 > $(document).height()) {
            pos.top = $(document).height() - size.height - 5;
        }

        this.menu.css({'top': pos.top, 'left': pos.left});
    },

    calcPosCenter: function(anchor, size) {
        var left = anchor.pos.left + (anchor.width*0.5) - (size.width*0.5);
        var top = anchor.pos.top + anchor.height;
        return {left: left, top: top};
    },

    calcPosLeft: function(anchor, size) {
        var left = (anchor.pos.left + (anchor.width*0.5)) - 16 - 8;
        var top = anchor.pos.top + anchor.height;
        return {left: left, top: top};
    },

    calcPosRight: function(anchor, size) {
        var left = (anchor.pos.left + (anchor.width*0.5)) + 16 + 8 - size.width;
        var top = anchor.pos.top + anchor.height;
        return {left: left, top: top};
    },

    detachEventHandlers: function() {
        $(document).off(".gmMenu."+this.id);
        $(window).off(".gmMenu."+this.id);
    },

    hide: function() {
        if (this.visible == false) { return; }
        this.detachEventHandlers();
        this.menu.fadeOut(100);
        this.visible = false;
    },

    init: function() {
        this.menu.data('menu', this);

        /* See if want to align the menu left or right */
        if (this.menu.hasClass("right")) { this.align = "right"; }
        else if (this.menu.hasClass("left")) { this.align = "left"; }

        /* Attach the menu to the menu trigger. */
        this.attachToTrigger();

        /* Remove from DOM and reinsert and end */
        this.menu.detach();
        $("body").append(this.menu);
    },

    show: function(trigger) {
        if (this.visible == true) { return; }
        if (trigger) { this.trigger = $(trigger); }
        this.menu.fadeIn(100);
        this.fixed = this.menu.hasClass("fixed");
        this.attachEventHandlers();
        this.autoSetPosition();
        this.visible = true;
    },

    toggleVisibility: function(trigger) {
        if (this.visible == true) { this.hide(); }
        else { this.show(trigger); }
    }
};

GM.Menu.findAndInitialise = function() {
    var menus = $(".gm-menu");
    for (var i = 0; i < menus.length; ++i) {
        var menu = new GM.Menu(menus[i].id);
    }
};