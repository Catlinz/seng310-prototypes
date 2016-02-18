//=require_self

var P02 = {};

P02.Home = {
    init: function() {
        $(".screen.home form").on('submit', function() {
            $(".loop-search-input").blur();
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
        Events.venue(function(data) {
            $("#selected-event").html(data.html);
            var h =P02.Preview.show(anim);
            Core.map.selectVenueById(id, {padding: [P02.Map.topBarHeight,0,h,0]});
        }, {id: id, html: true});
    },

    fetchResults: function() {
        if (Events.shouldFetch('map')) {
            Core.map.clearEventMarkers();
            Events.map(function(data) {
                Events.filters.store('map');
                Core.map.populate(data.venues);
                Core.map.zoomToFitAll();
            });
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
    distance: null,
    cover: null,
    date: null,
    age: null,

    valuesHaveBeenInitialised: false,

    initialise: function() {
        P02.Filters.distance = new UI.RangeSlider(
            $(".filter.distance .range"),
            UI.NumberRange.RealExp(Events.filters.saved.distance.range.min, Events.filters.saved.distance.range.max),
            UI.NumberFormat.Distance()
        );
        P02.Filters.distance.on("change", function(o) {
            Events.filters.temp.distance.set(o.values[0], o.values[1]);
        });

        P02.Filters.cover = new UI.RangeSlider($(".filter.cover .range"), Events.filters.saved.cover.range, UI.NumberFormat.Price());
        P02.Filters.cover.on("change", function(o) {
            Events.filters.temp.cover.set(o.values[0], o.values[1]);
        });

        P02.Filters.date = new UI.DateFilter(".filter.date");
        P02.Filters.date.on("change", function(o) {
            Events.filters.temp.date.set(o.days, o.start, o.end);
        });

        P02.Filters.age = new UI.Checkbox(".filter.age input");
        P02.Filters.age.on("change", function(o) {
            Events.filters.temp.age.set(o.checked());
        });

        $(".screen.filters .bottom-nav-bar a.apply").on("click", function() {
            Events.filters.save();
            Screen.back();
        });

        $(".screen.filters .bottom-nav-bar a.cancel").on("click", function() {
            Events.filters.restore();
            P02.Filters.restoreValuesFromFilters();
            Screen.back();
        });

        Events.filters.saved.on("update.P02.Filters", function() {
            //P02.Filters.restoreValuesFromFilters()
        });
    },

    restoreValuesFromFilters: function() {

        P02.Filters.distance.set(
            Events.filters.saved.distance.minRadius, Events.filters.saved.distance.maxRadius,
            Events.filters.saved.distance.range.min, Events.filters.saved.distance.range.max
        );
        P02.Filters.cover.set(
            Events.filters.saved.cover.min, Events.filters.saved.cover.max,
            Events.filters.saved.cover.range.min, Events.filters.saved.cover.range.max
        );

        P02.Filters.date.set(Events.filters.saved.date.days, Events.filters.saved.date.start, Events.filters.saved.date.end);
        P02.Filters.age.checked(Events.filters.saved.age.hideAdultOnly);
    }
};


Core.screens.home = {
    onShow: function() {
        Events.setFilterDefaults();
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
        Events.filters.temp.copy(Events.filters.saved);
        P02.Filters.restoreValuesFromFilters();
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
        if (Events.shouldFetch("search")) {
            P02.Search.clearResults();
            Events.list(function(data) {
                Events.filters.store("search");
                var content = $("#events-content");
                content.html(data.html);
                content.data('scroll').updateViewAndContentSize();
                content.data('scroll').setScroll(0)
            });
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
