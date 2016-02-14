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

P02.Map = {
    onHideResultGoBack: false,

    doShowResult: function(id, noAnim) {
        var se_div = $("#selected-event");
        var bn = $(".screen.map .bottom-nav-bar");
        var nav_hide = bn.find(".default-nav");
        var nav_show = bn.find(".result-nav");

        var h = parseInt(se_div.innerHeight()) + parseInt(bn.find(".default-nav").innerHeight());

        bn.stop(true);
        nav_hide.stop(true);
        nav_show.stop(true);
        if (noAnim) {
            nav_hide.css("opacity", 0).removeClass('hidden').addClass('hidden');
            nav_show.css("opacity", 1.0).removeClass('hidden');
            bn.css('height', h);
        } else {
            bn.animate({height: h}, 300);
            nav_hide.animate({opacity: 0}, 200, function() {
                nav_hide.removeClass('hidden').addClass('hidden');
                nav_show.removeClass('hidden').animate({opacity: 1}, 200);
            });
        }

        Core.map.selectEventMarker(id);
    },

  showResult: function(id, noAnim) {
      Events.get({id: id, html: true}, function(data) {
          $("#selected-event").html(data.html);
          P02.Map.doShowResult(id, noAnim)
      });
    },

    hideResult: function(noAnim) {
        if (P02.Map.onHideResultGoBack) {
            P02.Map.onHideResultGoBack = false;
            Screen.goto('search', function() { P02.Map.hideResult(true); });
        }
        else {
            var bn = $(".screen.map .bottom-nav-bar");
            var nav_show = bn.find(".default-nav");
            var nav_hide = bn.find(".result-nav");

            var h = Math.max(parseInt(nav_hide.innerHeight()), parseInt(nav_show.innerHeight()));
            bn.stop(true);
            nav_hide.stop(true);
            nav_show.stop(true);

            if (noAnim) {
                nav_hide.css("opacity", 0).removeClass('hidden').addClass('hidden');
                nav_show.css("opacity", 1.0).removeClass('hidden');
                bn.removeAttr("style");
            } else {
                bn.animate({height: h}, 300, function() { bn.removeAttr("style"); });
                nav_hide.animate({opacity: 0}, 200, function() {
                    nav_hide.removeClass('hidden').addClass('hidden');
                    nav_show.removeClass('hidden').animate({opacity: 1}, 200);
                });
            }

            Core.map.showAllEventMarkers();
            //Core.map.centerOnLocation();
        }
    },

    fetchResults: function() {
        if (!Search.checkState("map")) {
            Search.storeState("map");
            Core.map.clearEventMarkers();
            Search.doSearch(function(data) {
                Core.map.populate(data.events);
                Core.map.zoomToFitEventsAndLocation();
            });
        }
    },

    init: function() {
        $(".screen.map .bottom-nav-bar a.back").on("click", function () { P02.Map.hideResult(); });

        $(".screen.map form").on('submit', function() {
            P02.Map.onHideResultGoBack = false;
            P02.Map.hideResult();
            P02.Map.fetchResults();
            return false;
        });
    }
};

Core.screens.home = {
    onShow: function() {
        Search.reset();
    }
};


Core.screens.map = {
    onDisappear: function() {
        P02.Map.onHideResultGoBack = false;
    },

    onShow: function() {
        if (Core.map.needsInitialisation()) {
            Core.map.initialise();
        }
        if (!Core.map.onMarkerClicked) {
            Core.map.onMarkerClicked = function(id) { P02.Map.showResult(id); };
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
            Search.doSearch({html: true}, function(data) {
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
            P02.Map.onHideResultGoBack = true;
            Screen.goto('map', function() { P02.Map.showResult(id, true); });
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
});
