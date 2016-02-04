//=require core
//=require event

GM.Dialog = function(params) {
    this.setDefaultProperties();

    if (params.id) { this.dom = $('#'+params.id);}
    else if (params.jquery) { this.dom = params.jquery; }
    else if (params.html) { this.dom = $(params.html); }

    if (this.dom.length > 0) { this.setupDialog(); }
};

GM.Dialog.prototype = {
    constructor: GM.Dialog,

    close: function() {
        this.unregisterEventHandlers('show');
        this.dom.animate({opacity: 0}, this.animDuration, function() {
            $(this).removeClass('visible');
        });
        GM.PageBlock.hide(this.animDuration);
    },

    connectToActions: function(btn) {
        var actions = btn.attr("data-actions");
        if (!actions || actions.trim() == "") { return; }

        var _this = this;
        actions = actions.split(/\s/);
        btn.on("click.dialog", function() { _this.h.fire(actions); });
        btn.removeAttr('data-actions');
    },

    off: function(action) { this.h.off(action); },
    on: function(action, func) { return this.h.on(action, func); },

    registerEventHandlers: function(forwhat) {
        if (forwhat == 'buttons') {
            var btns = this.dom.find('.gm-dialog-btn');
            for (var i = 0; i < btns.length; ++i) {
                var btn = $(btns[i]);
                this.connectToActions(btn);
            }
        }
        else if (forwhat == 'show') {
            var _this = this;
            $(window).on('resize.dialog', function() { _this.updateLayout(); });
        }
    },

    setDefaultProperties: function() {
        this.modal = true;
        this.animDuration = 300;

        this.dom = null;
        this.h = new GM.Handlers({obj: this, afterFire: function(obj) { obj.close(); }});
    },

    setupDialog: function() {
        this.dom.data('dialog', this);
        /* First, we want to find all the buttons and connect them */
        this.registerEventHandlers('buttons');
    },

    show: function() {
        GM.PageBlock.show(this.animDuration);
        this.dom.removeClass('visible').addClass('visible');
        this.dom.animate({opacity: 1.0}, this.animDuration);
        this.updateLayout();
        this.registerEventHandlers('show');
    },

    unregisterEventHandlers: function(forwhat) {
        if (forwhat == 'buttons') {
            var btns = this.dom.find('.gm-dialog-btn');
            for (var i = 0; i < btns.length; ++i) {
                $(btns[i]).off("click.dialog");
            }
        }
        else if (forwhat == 'show') {
            $(window).off('resize.dialog');
        }
    },

    updateLayout: function() {
        var h = this.dom.innerHeight();
        var w = this.dom.innerWidth();
        var winH = $(window).innerHeight();
        var winW = $(window).innerWidth();

        var top = parseInt((winH - h)*0.5);
        var left = parseInt((winW - w)*0.5);
        this.dom.css({'top': top, 'left': left});
    }
};

GM.Dialog.initialiseDialogs = function() {
    var dialogs = $(".gm-dialog");
    for (var i = 0; i < dialogs.length; ++i) { new GM.Dialog({jquery: $(dialogs[i])}); }
};

GM.Dialog.close = function(sel) {
    var d = $(sel).data('dialog');
    if (d) { d.close(); }
};

GM.Dialog.show = function(sel) {
    var d = $(sel).data('dialog');
    if (d) { d.show(); }
};