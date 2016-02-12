//=require ../core/forms.js
//=require ../core/ajax.js
//=require ../core/scroll.js
//=require ../core/menu.js
//=require ../core/dialog.js
//=require map
//=require core
//=require_self

function Event(params) {
    if (!params) { params = {}; }
    this.title = params.title || "";
    this.locale = params.locale || "";
    this.latlng = params.latlng || [0, 0];
    this.address = params.address || "";
    this.hours = params.hours || ["", ""];
    this.code = params.code || '';
    this.isEventObj = true
}

Event.prototype = {
    constructor: Event
};

function EventList() {
    this.list = [];
    this.length = 0;
    this.h = new GM.Handlers({obj: this, allowed: "add remove change"});
}

EventList.prototype = {
    constructor: EventList,

    add: function(event, nofire) {
        if (event.length) {
            this.addAll(event);
            return;
        }

        if (event.isEventObj) { this.list.push(event); }
        else { this.list.push(new Event(event)); }
        this.list[this.list.length - 1].code = this.getCode(this.list.length - 1);
        this.length = this.list.length;
        if (!nofire) { this.fire('add'); }
    },

    addAll: function(events) {
        for (var i = 0; i < events.length; ++i) {
            this.add(events[i], true);
        }
        this.fire('add');
    },

    at: function(index) {
        if (typeof(index) == "string") { index = EventList.Codes.indexOf(index); }
        return this.list[index];
    },

    fire: function(action) { this.h.fire(action); },
    getCode: function(index) { return EventList.Codes[index]; },
    indexOf: function(code) { return EventList.Codes.indexOf(code); },
    off: function(action) { this.h.off(action); },
    on: function(action, func) { return this.h.on(action, func); }

};

EventList.Codes = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var Screen = {
    history: [],

    back: function(screen, after) {
        if (!screen) {
            if (Screen.history.length > 0) { Screen.goto(Screen.history.pop(), after, true); }
        }
        else {
            var idx = Screen.history.lastIndexOf(screen);
            if (idx != -1) {
                Screen.history = Screen.history.slice(0, idx);
                Screen.goto(screen, after, true);
            }
        }
    },

    findAndAttachLinks: function() {
        $("#screen-container").on("click", ".ctrl-link", function() {
            var screen = $(this).attr("data-link");
            if (screen == "_back") { Screen.back(); }
            else { Screen.goto(screen); }
        });
    },

    goto: function(screen, after, back) {
        var s = $('.screen.'+screen);
        if (s.length == 0 || s.hasClass('active')) { return; }

        var cur = $('.screen.active');
        var cur_w = parseInt(cur.innerHeight());
        if (!back) {
            cur.removeClass("active").addClass("under");
            s.css({top: 0, left: cur_w}).addClass('active').animate({left: 0}, 300, function() {
                cur.removeClass("under");
                Screen.onShow(screen);
                if (after) { after(); }
            });
            Screen.history.push(cur[0].className.replace(/(screen|active|under|over)/g, "").trim());
        }
        else { /* going back */
            s.css({top: 0, left: 0}).addClass('active');
            cur.removeClass("active").addClass("over").animate({left: cur_w}, 300, function() {
                cur.removeClass("over");
                Screen.onShow(screen);
                if (after) { after(); }
            });
        }
    },
    height: function() { return parseInt($('.screen.active').innerHeight()); },

    init: function() { Screen.findAndAttachLinks();},

    onShow: function(screen) {
        if (Core.screens[screen] && Core.screens[screen].onShow) {
            Core.screens[screen].onShow();
        }
    },

    width: function() { return parseInt($('.screen.active').innerWidth()); }
};

var Core = {
    events: new EventList(),
    map: null,
    screens: {}
};

var Location = {
    random: function(latlng, radiusMetres) {
        var w = (radiusMetres / 111000.0) * Math.sqrt(Math.random());
        var t = 2 * Math.PI * Math.random();
        var x = w * Math.cos(t);
        var y = w * Math.sin(t);

        // Adjust for shrinking east-west distances
        x = x / Math.cos(latlng.lng);

        return {lat: x + latlng.lat, lng: y + latlng.lng};
    }
};

$(document).ready(function() {
    GM.Menu.findAndInitialise();
    GM.Dialog.initialiseDialogs();
    GM.Scroll.initScrollableContent();
    Screen.init();

    Core.events.add([
        {
            title: "Cool Event",
            locale: "Some Place",
            latlng: Location.random(Map.defaultLocation, 1000),
            address: "3333 Some Rd, Victoria",
            hours: ["11pm", "2am"]
        },
        {
            title: "Other Event",
            locale: "Diff Place",
            latlng: Location.random(Map.defaultLocation, 1000),
            address: "4322 Other Rd, Saanich",
            hours: ["11pm", "2am"]
        },
        {
            title: "Other Event",
            locale: "Diff Place",
            latlng: Location.random(Map.defaultLocation, 1000),
            address: "4322 Other Rd, Saanich",
            hours: ["11pm", "2am"]
        },
        {
            title: "Other Event",
            locale: "Diff Place",
            latlng: Location.random(Map.defaultLocation, 1000),
            address: "4322 Other Rd, Saanich",
            hours: ["11pm", "2am"]
        },
        {
            title: "Other Event",
            locale: "Diff Place",
            latlng: Location.random(Map.defaultLocation, 1000),
            address: "4322 Other Rd, Saanich",
            hours: ["11pm", "2am"]
        },
        {
            title: "Other Event",
            locale: "Diff Place",
            latlng: Location.random(Map.defaultLocation, 1000),
            address: "4322 Other Rd, Saanich",
            hours: ["11pm", "2am"]
        },
        {
            title: "Other Event",
            locale: "Diff Place",
            latlng: Location.random(Map.defaultLocation, 1000),
            address: "4322 Other Rd, Saanich",
            hours: ["11pm", "2am"]
        }
    ]);
});