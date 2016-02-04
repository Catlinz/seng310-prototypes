//=require ../core/forms.js
//=require ../core/ajax.js
//=require ../core/scroll.js
//=require ../core/menu.js
//=require ../core/dialog.js
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

    init: function() {
        Screen.findAndAttachLinks();
    },

    onShow: function(screen) {
        if (Core.screens[screen] && Core.screens[screen].onShow) {
            Core.screens[screen].onShow();
        }
    },

    width: function() { return parseInt($('.screen.active').innerWidth()); }
};


function Map(id, latlng, initialZoom) {
    if (!latlng) { latlng = Map.defaultLocation; }
    if (!initialZoom) { initialZoom = 14; }

    this.map = L.map(id).setView(latlng, initialZoom);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(this.map);

    this.location = latlng;
    this.markers = [];

    this.onMarkerClicked = null;
    this.locationIcon = L.icon({ iconUrl: '/assets/location-icon.png', iconRetinaUrl: '/assets/location-icon-2x.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41]
    });

    this.locMarker = L.marker(this.location, {icon: this.locationIcon}).addTo(this.map);
    var _this = this;
    this.locMarker.on("click", function() { _this.centerOnLocation(); })
}

Map.prototype = {
    constructor: Map,

    clearEventMarkers: function() {
        for (var i = 0; i < this.markers.length; ++i) {
            this.map.removeLayer(this.markers[i]);
        }
        this.markers = [];
    },

    addEventMarkers: function(list) {
        for (var i = 0; i < list.length; ++i) {
            this.addEventMarker(list.at(i));
        }
    },

    centerOnMarker: function(index) {
        if (!index) { index = 0; }
        var m = this.markers[index];
        this.map.setView(m.getLatLng());
    },

    centerOnLocation: function() {
        this.map.setView(this.location);
    },

    addEventMarker: function(event) {
        var marker = L.marker(event.latlng, {icon: this.eventIcon(event.code)}).addTo(this.map);
        var _this = this;
        marker.on("click", function(e) { if (_this.onMarkerClicked) { _this.onMarkerClicked(event.code);} });
        this.markers.push(marker);
    },

    eventIcon: function(code) {
        return L.divIcon({className: 'map-icon', iconSize: [50, 41], iconAnchor: [25, 41], popupAnchor: [0, -41], html:'<span class="letter">'+code+'</span>'});
    }
};

Map.defaultLocation = [48.441216117602345, -123.3530330657959];

var Core = {
    events: new EventList(),
    map: null,
    screens: {}
};

var Location = {
    random: function(lat, lng, radiusMetres) {
        var w = (radiusMetres / 111000.0) * Math.sqrt(Math.random());
        var t = 2 * Math.PI * Math.random();
        var x = w * Math.cos(t);
        var y = w * Math.sin(t);

        // Adjust for shrinking east-west distances
        x = x / Math.cos(lng);

        return [x + lat, y + lng];
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
            latlng: Location.random(Map.defaultLocation[0], Map.defaultLocation[1], 1000),
            address: "3333 Some Rd, Victoria",
            hours: ["11pm", "2am"]
        },
        {
            title: "Other Event",
            locale: "Diff Place",
            latlng: Location.random(Map.defaultLocation[0], Map.defaultLocation[1], 1000),
            address: "4322 Other Rd, Saanich",
            hours: ["11pm", "2am"]
        },
        {
            title: "Other Event",
            locale: "Diff Place",
            latlng: Location.random(Map.defaultLocation[0], Map.defaultLocation[1], 1000),
            address: "4322 Other Rd, Saanich",
            hours: ["11pm", "2am"]
        },
        {
            title: "Other Event",
            locale: "Diff Place",
            latlng: Location.random(Map.defaultLocation[0], Map.defaultLocation[1], 1000),
            address: "4322 Other Rd, Saanich",
            hours: ["11pm", "2am"]
        },
        {
            title: "Other Event",
            locale: "Diff Place",
            latlng: Location.random(Map.defaultLocation[0], Map.defaultLocation[1], 1000),
            address: "4322 Other Rd, Saanich",
            hours: ["11pm", "2am"]
        },
        {
            title: "Other Event",
            locale: "Diff Place",
            latlng: Location.random(Map.defaultLocation[0], Map.defaultLocation[1], 1000),
            address: "4322 Other Rd, Saanich",
            hours: ["11pm", "2am"]
        },
        {
            title: "Other Event",
            locale: "Diff Place",
            latlng: Location.random(Map.defaultLocation[0], Map.defaultLocation[1], 1000),
            address: "4322 Other Rd, Saanich",
            hours: ["11pm", "2am"]
        }
    ]);
});