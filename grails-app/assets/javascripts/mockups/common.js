//=require ../core/forms
//=require ../core/ajax
//=require ../core/scroll
//=require ../core/menu
//=require ../core/dialog
//=require ../core/ui
//=require core
//=require map
//=require filters
//=require events
//=require_self


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
        if (!back && Screen.history.length > 0 && Screen.history[Screen.history.length - 1] == screen) {
            Screen.back(null, after);
            return;
        }
        var s = $('.screen.'+screen);
        if (s.length == 0 || s.hasClass('active')) { return; }

        var cur = $('.screen.active');
        var cur_s = cur[0].className.replace(/(screen|active|under|over)/g, "").trim();
        var cur_w = parseInt(cur.innerHeight());
        if (!back) {
            cur.removeClass("active").addClass("under");
            s.css({left: cur_w}).addClass('active').animate({left: 0}, 300, function() {
                cur.removeClass("under");
                Screen.onDisappear(cur_s);
                Screen.onShow(screen);
                if (after) { after(); }
            });
            Screen.history.push(cur_s);

        }
        else { /* going back */
            s.css({left: 0}).addClass('active');
            cur.removeClass("active").addClass("over").animate({left: cur_w}, 300, function() {
                cur.removeClass("over");
                Screen.onDisappear(cur_s);
                Screen.onShow(screen);
                if (after) { after(); }
            });
        }
    },
    height: function() { return parseInt($('.screen.active').innerHeight()); },

    init: function() {
        Screen.findAndAttachLinks();
        if (window.navigator.standalone) {
            $("#screen-container").addClass("ios-standalone")
        }
    },

    onDisappear: function(screen) {
        if (Core.screens[screen] && Core.screens[screen].onDisappear) {
            Core.screens[screen].onDisappear();
        }
    },

    onShow: function(screen) {
        if (Core.screens[screen] && Core.screens[screen].onShow) {
            Core.screens[screen].onShow();
        }
    },

    width: function() { return parseInt($('.screen.active').innerWidth()); }
};

var Core = {
    map: null,
    id: 0,
    screens: {}
};

var Location = {
    r_earth: 6378137.0,

    random: function(latlng, radiusMetres) {
        var w = (radiusMetres / 111000.0) * Math.sqrt(Math.random());
        var t = 2 * Math.PI * Math.random();
        var x = w * Math.cos(t);
        var y = w * Math.sin(t);

        // Adjust for shrinking east-west distances
        x = x / Math.cos(latlng.lng);

        return {lat: x + latlng.lat, lng: y + latlng.lng};
    },

    rect: function(center, radius) {
        var max = {
            lat: center.lat + (radius / Location.r_earth) * (180.0 / Math.PI),
            lng: center.lng + (radius / Location.r_earth) * (180.0 / Math.PI) / Math.cos(center.lat * Math.PI / 180.0)
        };

        var min = {
            lat: center.lat + (-radius / Location.r_earth) * (180.0 / Math.PI),
            lng: center.lng + (-radius / Location.r_earth) * (180.0 / Math.PI) / Math.cos(center.lat * Math.PI / 180.0)
        };
        return {max: max, min: min};
    }
};

var Search = {
    keys: {
        ignore: [19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40],
        enter: 13
    },

    init: function() {
        var jq = $(".loop-search-input");
        jq.on("change.loop", function() {
            Events.filters.setSearchText($(this).val());
            Search.synchroniseInputs();
        });
        jq.on("keyup.loop", function(e) {
            if (e.which == Search.keys.enter) {
                Events.filters.setSearchText($(e.target).val());
                Search.synchroniseInputs();
            }
        });
    },

    reset: function() {
        Events.filters.setSearchText("");
        Search.synchroniseInputs();
    },

    synchroniseInputs: function(value) {
        if (!value) { value = Events.filters.saved.text.value; }
        var s = $(".loop-search-input");
        s.each(function(i, elem) {
            $(elem).val(value);
            GM.Forms.checkLabel(elem);
        });
    }
};

$(document).ready(function() {
    GM.Menu.findAndInitialise();
    GM.Dialog.initialiseDialogs();
    GM.Scroll.initScrollableContent();
    Screen.init();
    Search.init();
    Core.map = new Map('map');

    Events.setFilterDefaults();
    Events.filters.setLocation(Core.map.location);
});