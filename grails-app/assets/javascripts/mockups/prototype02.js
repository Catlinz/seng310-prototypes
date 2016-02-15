//=require_self

var P02 = {};

P02.Home = {
    init: function() {
        $(".screen.home form").on('submit', function() {
            Screen.goto('search');
            return false;
        });
    }
};

P02.Preview = {
    jq: {
        bar: null,
        cont: null,
        defNav: null,
        resNav: null
    },

    calcHeight: function() {
        return Math.min(this.expHeight(), this.maxHeight());
    },

    expHeight: function() {
        return parseInt(P02.Preview.jq.cont.innerHeight()) + P02.Preview.minHeight();
    },

    hide: function(anim) {
        if (P02.Preview.hide.goto) {
            var s = P02.Preview.hide.goto;
            P02.Preview.hide.goto = null;
            Screen.goto(s, function() { P02.Preview.hide(false); });
            return;
        }
        if (anim != false) { anim = true; }

        var h = P02.Preview.minHeight();
        P02.Preview.stopAnim();
        P02.Preview.jq.cont.data('scroll').scrollbar.hide(300);
        if (anim) {
            P02.Preview.jq.bar.animate({height: h}, 300, function() { P02.Preview.jq.bar.removeAttr("style"); });
            P02.Preview.jq.resNav.animate({opacity: 0}, 200, function() {
                P02.Preview.jq.resNav.removeClass('hidden').addClass('hidden');
                P02.Preview.jq.defNav.removeClass('hidden').animate({opacity: 1}, 200);
            });
        }
        else {
            P02.Preview.jq.resNav.css("opacity", 0).removeClass('hidden').addClass('hidden');
            P02.Preview.jq.defNav.css("opacity", 1.0).removeClass('hidden');
            P02.Preview.jq.bar.removeAttr("style");
        }

        if (P02.Preview.hide.after) { P02.Preview.hide.after(); }
    },

    initialise: function() {
        P02.Preview.jq.bar = $(".screen.map .bottom-nav-bar");
        P02.Preview.jq.cont = $("#selected-event");
        P02.Preview.jq.defNav = P02.Preview.jq.bar.find('.default-nav');
        P02.Preview.jq.resNav = P02.Preview.jq.bar.find('.result-nav');
    },

    maxHeight: function() {
        return parseInt($(".screen.active").innerHeight()*0.7);
    },

    minHeight: function() {
        return Math.max(parseInt(P02.Preview.jq.defNav.innerHeight()), parseInt(P02.Preview.jq.resNav.innerHeight()));
    },

    show: function(anim) {
        if (anim != false) { anim = true; }

        var h = P02.Preview.calcHeight();

        P02.Preview.stopAnim();
        if (anim) {
            P02.Preview.jq.bar.animate({height: h}, 300, function() {
                P02.Preview.jq.cont.data('scroll').updateViewAndContentSize();
            });
            P02.Preview.jq.defNav.animate({opacity: 0}, 200, function() {
                P02.Preview.jq.defNav.removeClass('hidden').addClass('hidden');
                P02.Preview.jq.resNav.removeClass('hidden').animate({opacity: 1}, 200);
            });
        }
        else {
            P02.Preview.jq.defNav.css("opacity", 0).removeClass('hidden').addClass('hidden');
            P02.Preview.jq.resNav.css("opacity", 1.0).removeClass('hidden');
            P02.Preview.jq.bar.css('height', h);
            P02.Preview.jq.cont.data('scroll').updateViewAndContentSize();
        }
        return h;
    },

    stopAnim: function() {
        P02.Preview.jq.bar.stop(true);
        P02.Preview.jq.defNav.stop(true);
        P02.Preview.jq.resNav.stop(true);
    }
};

P02.Preview.hide.goto = null;
P02.Preview.hide.after = null;

P02.Map = {

    topBarHeight: 0,

  showEvent: function(id, anim) {
      Events.get(function(data) {
          $("#selected-event").html(data.html);
          var h = P02.Preview.show(anim);
          Core.map.selectVenueByEventId(id, {padding: [P02.Map.topBarHeight,0,h,0]});
      }, {id: id, html: true});
    },

    showVenue: function(id, anim) {
        Venue.get(function(data) {
            $("#selected-event").html(data.html);
            var h =P02.Preview.show(anim);
            Core.map.selectVenueById(id, {padding: [P02.Map.topBarHeight,0,h,0]});
        }, {id: id, html: true});
    },

    fetchResults: function() {
        if (!Search.checkState("map")) {
            Search.storeState("map");
            Core.map.clearEventMarkers();
            Search.doSearch(function(data) {
                Core.map.populate(data);
                Core.map.zoomToFitAll();
            }, {map: true});
            P02.Map.topBarHeight = parseInt($(".screen.map .top-bar").innerHeight());
        }
    },

    init: function() {
        P02.Preview.hide.after = function() { Core.map.selectNone(); };

        $(".screen.map .bottom-nav-bar a.back").on("click", function () { P02.Preview.hide(); });

        $(".screen.map form").on('submit', function() {
            P02.Preview.hide.goto = null;
            P02.Preview.hide();
            P02.Map.fetchResults();
            return false;
        });
    }
};

P02.Filters = {
    initialise: function() {
        new UI.RangeSlider($(".filter.distance .range"), [0, 5000], UI.NumberFormat.Distance());

        $(".screen.filters .bottom-nav-bar a.apply").on("click", function() {
            var df = $(".filter.distance .range").data("rangeSlider");
            Filters.distance.minRadius = df.values[0];
            Filters.distance.maxRadius = df.values[1];
            if (Screen.history[Screen.history.length -1] == "map") {
                Screen.back(null, function() { P02.Map.fetchResults(); });
            }
            else { Screen.back(null, function() { P02.Search.fetchResults(); }); }
        })
    }
};


Core.screens.home = {
    onShow: function() {
        Search.reset();
    }
};


Core.screens.map = {
    onDisappear: function() {
        P02.Preview.hide.goto = null;
    },

    onShow: function() {
        if (Core.map.needsInitialisation()) {
            Core.map.initialise();
        }
        if (!Core.map.onMarkerClicked) {
            Core.map.onMarkerClicked = function(m) { P02.Map.showVenue(m.loop.venue.id); };
        }
        P02.Map.fetchResults();
    }
};

Core.screens.filters = {
    onShow: function() {
        $(".screen.filters .gm-scrollable").data('scroll').updateViewAndContentSize();
    }
};

Core.screens.search = {
    onShow: function() {
        P02.Search.fetchResults();
    }
};

P02.Search = {

    clearResults: function() {
        var content = $("#events-content");
        content.html("");
        content.data('scroll').updateViewAndContentSize();
    },

    fetchResults: function() {
        if (!Search.checkState("search")) {
            Search.storeState("search");
            P02.Search.clearResults();
            Search.doSearch(function(data) {
                var content = $("#events-content");
                content.html(data.html);
                content.data('scroll').updateViewAndContentSize();
                content.data('scroll').setScroll(0)
            }, {list: true});
        }
    },

    init: function() {
        $("#events-content").on("click", ".event", function(e) {
            var id = $(e.currentTarget).attr("data-id");
            P02.Preview.hide.goto = 'search';
            Screen.goto('map', function() { P02.Map.showEvent(id, false); });
        });

        $(".screen.search form").on('submit', function() {
            P02.Search.fetchResults();
            return false;
        });
    }

};

P02.Menu = {
    hide: function() {
        $("#screen-container").removeClass('show-nav-bar');
    },

    initialise: function() {
        $('.top-bar a.menu-icon').on('click', function() {P02.Menu.toggle(); });
        $('#nav-bar').find('a').on('click', function() { P02.Menu.hide(); });
    },

    show: function() {
        $('#screen-container').removeClass('show-nav-bar').addClass('show-nav-bar');
    },

    toggle: function() {
        if ($("#screen-container").hasClass('show-nav-bar')) { P02.Menu.hide(); }
        else { P02.Menu.show(); }
    }
};

$(document).ready(function() {
    Core.id = 2;
    P02.Home.init();
    P02.Map.init();
    P02.Search.init();
    P02.Menu.initialise();
    P02.Preview.initialise();
    P02.Filters.initialise();
});
