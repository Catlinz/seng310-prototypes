//=require_self

var P02 = {};
P02.Map = {
    onHideResultGoBack: false,

  showResult: function(code, noAnim) {
        var se_div = $("#selected-event");
        var se = se_div.find('.event');
        var e = Core.events.at(code);
        se.find('.event-id').text(code);
        se.find('.title').html(e.title+' <span class="locale">'+e.locale+'</span>');
        se.find('.location').text(e.address);
        se.find('.time').text(e.hours[0] + ' - ' + e.hours[1]);

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

        Core.map.selectEventMarker(Core.events.indexOf(code));
    },

    hideResult: function(noAnim) {
        if (P02.Map.onHideResultGoBack) {
            P02.Map.onHideResultGoBack = false;
            Screen.back(null, function() { P02.Map.hideResult(true); });
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
            Core.map.centerOnLocation();
        }
    },

    init: function() {
        $(".screen.map .bottom-nav-bar a.back").on("click", function () { P02.Map.hideResult(); });
    }
};

Core.screens.map = {
    onShow: function() {
        if (!Core.map) {
            Core.map = new Map('map');
            Core.map.addEventMarkers(Core.events);
        }
        if (!Core.map.onMarkerClicked) {
            Core.map.onMarkerClicked = function(code) { P02.Map.showResult(code); };
        }
    }
};

Core.screens.filters = {
    onShow: function() {
        $(".screen.filters .gm-scrollable").data('scroll').updateViewAndContentSize();
    }
};

Core.screens.search = {
    onShow: function() {
        P02.Search.clearEventList();
        P02.Search.addEventsToList(Core.events);
        $(".screen.search .gm-scrollable").data('scroll').updateViewAndContentSize();
    }
};

var Search = {
    init: function() {
        var s = $(".search-bar");
    }
};

P02.Search = {
    addEventToList: function(event) {
        var html = $('<div class="event"><a class="event-id">'+event.code+'</a><a class="title">'+event.title+' <span class="locale">'+event.locale+'</span></a><a class="location">'+event.address+'</a><a class="time">'+event.hours[0]+' - '+event.hours[1]+'</a><a class="directions">Directions</a></div>');
        var content = $("#events-content");
        content.append(html);
        content.data('scroll').updateViewAndContentSize();
    },

    addEventsToList: function(list) {
        for (var i = 0; i < list.length; ++i) {
            P02.Search.addEventToList(list.at(i));
        }
    },

    clearEventList: function() {
        var content = $("#events-content");
        content.html("");
        content.data('scroll').updateViewAndContentSize();
    },

    init: function() {
        $("#events-content").on("click", "a", function(e) {
            var t = $(e.target);
            var code = (t.hasClass("event-id")) ? t.text() : $(e.target).parents('.event').find('.event-id').text();
            P02.Map.onHideResultGoBack = true;
            Screen.goto('map', function() { P02.Map.showResult(code, true); });
        });
    }
};

$(document).ready(function() {
    Core.events.on("add", function() {
        Core.map.clearEventMarkers();
        Core.map.addEventMarkers(Core.events);

        P02.Search.clearEventList();
        P02.Search.addEventsToList(Core.events);
    });

    Search.init();
    P02.Map.init();
    P02.Search.init();
});
