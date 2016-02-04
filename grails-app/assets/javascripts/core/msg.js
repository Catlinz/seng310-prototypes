//=require core

/**
 *  Create a new message to display to the user.
 * @param title The title of the message (text or html)
 * @param msg The message body (text or html)
 * @param level The level of the message (message, error, etc.)
 * @param style How the message is presented to the user.
 * @param autoclose Integer time in which to close the message (0 = no timeout).
 * @constructor
 */
GM.Msg = function(title, msg, level, style, autoclose) {
    this.title = title || null;
    this.msg = msg || null;
    this.level = level || GM.Msg.MessageLevel;
    this.style = style || GM.Msg.SlideTopStyle;
    this.autoclose = autoclose || 0;
    this.id = GM.Msg._msgIdGen++;
};

GM.Msg.prototype = {
    constructor: GM.Msg,

    /** Attach the event handlers to keep the message in the right position. */
    attachEventHandlers: function() {
        var _this = this;
        $(window).on("resize.msg_"+this.id, function() { _this.autoSetPosition(); });
        this.html.find("a.gmam-close").on("click", function() {
            _this.remove();
        })
    },

    /** Set the position in the window */
    autoSetPosition: function() {
        var size = {width: $(window).width(), height: $(window).height()};

        var width = this.html.innerWidth();
        var height = this.html.innerHeight();

        var left = (size.width - width) / 2;
        var top = (size.height - height) / 2;
        var right = left + width;
        var bottom = top + height;

        /* Make sure menu is within bounds */
        if (left < 5) { left = 5; }
        else if (right + 5 > size.width) {
            left = size.width - width - 5;
        }
        if (top < 5) { top = 5; }
        else if (bottom + 5 > size.height) {
            top = size.height - height - 5;
        }

        if (this.style == GM.Msg.ModalStyle) {
            this.html.css({'top': top, 'left': left});
        }
        else {
            this.html.css({'left': left});
        }
    },

    /** Create the HTML for the message. */
    create: function() {
        /* Create the main div container */
        var cont_div = $('<div class="gm-app-message">');
        cont_div.addClass(this.level);
        cont_div.addClass(this.style);

        /* If we have a title to display, put it in */
        if (this.title) {
            var title_div = $('<div class="gmam-title">');
            title_div.html(this.title);
            cont_div.append(title_div);
        }

        /* If we have a message to display, put it in */
        if (this.msg) {
            var msg_div = $('<div class="gmam-message">')
            msg_div.html(this.msg);
            cont_div.append(msg_div);
        }

        /* If an autoclose message, then put in a process bar to show when will close */
        if (this.autoclose > 0) {
            var autoclose_div = $('<div class="gmam-autoclose-bar">');
            cont_div.append(autoclose_div);
        }

        /* Put in a close button as well */
        var close_btn = $('<a class="gmam-close">&times;</a>');
        cont_div.append(close_btn);

        this.html = cont_div;
    },

    /** Detach the event handlers from the window. */
    detachEventHandlers: function() {
        $(window).off("resize.msg_"+this.id);
    },

    /** Method to show the message to the user */
    present: function() {
        $("body").append(this.html);
        if (this.style == GM.Msg.SlideBottomStyle ||
            this.style == GM.Msg.SlideTopStyle) {
            this.html.slideDown(100);
        }
        else {
            this.html.fadeIn(100);
        }
        this.attachEventHandlers();
        this.autoSetPosition();
    },

    /** Hide and then remove the message */
    remove: function() {
        var _this = this;
        var on_complete = function() {
            _this.html.remove();  _this.html = null;
        };
        this.detachEventHandlers();
        if (this.style == GM.Msg.SlideBottomStyle ||
            this.style == GM.Msg.SlideTopStyle) {
            this.html.slideUp(100, on_complete);
        }
        else {
            this.html.fadeIn(100, on_complete);
        }
    }
};

GM.Msg._msgIdGen = 1;
GM.Msg.SlideBottomStyle = "slide bottom";
GM.Msg.SlideTopStyle = "slide top";
GM.Msg.ModalStyle = "modal";

GM.Msg.SuccessLevel = "success";
GM.Msg.MessageLevel = "message";
GM.Msg.WarnLevel = "warning";
GM.Msg.ErrorLevel = "error";

GM.Msg.message = function(params) {
    var msg = new GM.Msg(params.title, params.msg || params.message, GM.Msg.MessageLevel, params.style, params.autoclose);
    msg.create();
    msg.present();
};

GM.Msg.error = function(params) {
    var msg = new GM.Msg(params.title, params.msg || params.message, GM.Msg.ErrorLevel, params.style, params.autoclose);
    msg.create();
    msg.present();
};

GM.Msg.warn = function(params) {
    var msg = new GM.Msg(params.title, params.msg || params.message, GM.Msg.WarnLevel, params.style, params.autoclose);
    msg.create();
    msg.present();
};

GM.Msg.success = function(params) {
    var msg = new GM.Msg(params.title, params.msg || params.message, GM.Msg.SuccessLevel, params.style, params.autoclose);
    msg.create();
    msg.present();
};