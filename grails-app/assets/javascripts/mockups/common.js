//=require ../core/forms.js
//=require ../core/ajax.js
//=require ../core/scroll.js
//=require ../core/menu.js
//=require ../core/dialog.js
//=require core
//=require map
//=require filters
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
    value: "",
    keys: {
        ignore: [19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40],
        enter: 13
    },
    state: {},

    checkState: function(id) {
        if (Search.state[id]) {
            if ((Search.state[id].value == Search.value) &&
                (Search.state[id].filters == Filters.hashCode())) {
                return true;
            }
        }
        return false
    },

    doSearch: function(success, params) {
        if (!params) { params = {} }
        params = Filters.setParams(params);

        if (Search.value != "") { params.value = Search.value; }
        $("input.loop-search-input").blur();

        if (params.map) { Events.map(success, params); }
        else { Events.list(success, params); }

    },

    isEmpty: function() { return Search.value.trim() == ""; },

    init: function() {
        var jq = $(".loop-search-input");
        jq.on("change.loop", function() {
            Search.value = $(this).val();
            Search.synchroniseInputs();
        });
        jq.on("keyup.loop", function(e) {
            if (e.which == Search.keys.enter) {
                Search.value = $(e.target).val();
                Search.synchroniseInputs();
            }
        });
    },

    reset: function() {
        Search.value = "";
        Search.synchroniseInputs();
    },

    synchroniseInputs: function(value) {
        if (!value) { value = Search.value; }
        var s = $(".loop-search-input");
        s.each(function(i, elem) {
            $(elem).val(value);
            GM.Forms.checkLabel(elem);
        });
    },

    storeState: function(id) {
        Search.state[id] = {value: Search.value, filters: Filters.hashCode()};
    }
};

var Events = {

    init: function() {

    },

    get: function(success, params) { /* { html:<T|F>, details:<T|F>, id: } */
        if (!params) { params = {}; }
        params.p = Core.id;
        GM.Ajax.get('/events/get', params, {
            success: function(data, textStatus, jqXHR) {
                if (success) { success(data); }
            },
            complete: function(jqXHR, textStatus) {}
        });
    },

    /** params: { value:String } **/
    list: function(success, params) {
        if (!params) { params = {}; }
        params.p = Core.id;
        GM.Ajax.get('/events/list', params, {
            success: function(data, textStatus, jqXHR) {
                if (success) { success(data); }
            },
            complete: function(jqXHR, textStatus) {}
        });
    },

    /** params: { value:String } **/
    map: function(success, params) {
        GM.Ajax.get('/events/map', params, {
            success: function(data, textStatus, jqXHR) {
                if (success) { success(data); }
            },
            complete: function(jqXHR, textStatus) {}
        });
    }
};

var Venue = {

    init: function() {

    },

    get: function(success, params) { /* { html:<T|F>, details:<T|F>, id: } */
        if (!params) { params = {}; }
        params.p = Core.id;
        GM.Ajax.get('/venue/get', params, {
            success: function(data, textStatus, jqXHR) {
                if (success) { success(data); }
            },
            complete: function(jqXHR, textStatus) {}
        });
    }
};

$(document).ready(function() {
    GM.Menu.findAndInitialise();
    GM.Dialog.initialiseDialogs();
    GM.Scroll.initScrollableContent();
    Screen.init();
    Search.init();
    Events.init();
    Venue.init();
    Core.map = new Map('map');

    Filters.initialise();
    Filters.distance.center = Core.map.location;
});