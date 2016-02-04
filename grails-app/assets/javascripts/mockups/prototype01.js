//=require_self

var P01 = {};
P01.Map = {
    addEventToDrawer: function(event) {
        var html = $('<div class="event"><a class="event-id">'+event.code+'</a><a class="title">'+event.title+' <span class="locale">'+event.locale+'</span></a><a class="location">'+event.address+'</a><a class="time">'+event.hours[0]+' - '+event.hours[1]+'</a><a class="directions">Directions</a></div>');
        $("#events-content").append(html);
        $("#events-content").data('scroll').updateViewAndContentSize();
    },

    addEventsToDrawer: function(list) {
        for (var i = 0; i < list.length; ++i) {
            P01.Map.addEventToDrawer(list.at(i));
        }
    },

    clearEventDrawer: function() {
        $("#events-content").html("");
        $("#events-content").data('scroll').updateViewAndContentSize();
    }
};

Core.screens.map = {
    onShow: function() {
        if (!Core.map) {
            Core.map = new Map('map');
            Core.map.addEventMarkers(Core.events);
            P01.Map.addEventsToDrawer(Core.events);
        }
        if (!Core.map.onMarkerClicked) {
            Core.map.onMarkerClicked = function(code) { console.log(code); EventDrawer.select(code); };
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
        P01.Search.clearEventList();
        P01.Search.addEventsToList(Core.events);
        $(".screen.search .gm-scrollable").data('scroll').updateViewAndContentSize();
    }
};

var EventDrawer = {
    show: function() {
        var e = $("#event-list");
        e.removeClass('expanded').addClass('expanded');
        var h = parseInt(Screen.height() * 0.67);
        e.animate({height: h}, 300, function() {
            e.find('.gm-scroll_wrapper').css({height: h - e.find('.toggle').innerHeight()});
            $('#events-content').data('scroll').updateViewAndContentSize()
        });
    },

    backToList: function() {
        var el = $("#event-list");
        el.removeClass('show-selected');
        if (el.hasClass('hide-after-select')) {
            el.removeClass('hide-after-select');
            EventDrawer.hide();
        }
        else {
            EventDrawer.show();
        }
        Core.map.clearEventMarkers();
        Core.map.addEventMarkers(Core.events);
        Core.map.centerOnLocation();
    },

    select: function(code) {
        var se = $('#selected-event').find('.event');
        var e = Core.events.at(code);
        se.find('.event-id').text(code);
        se.find('.title').html(e.title+' <span class="locale">'+e.locale+'</span>');
        se.find('.location').text(e.address);
        se.find('.time').text(e.hours[0] + ' - ' + e.hours[1]);

        var el = $("#event-list");
        var h = parseInt($("#selected-event").innerHeight());
        var classes = 'show-selected expanded';
        if (!el.hasClass('expanded') || el.hasClass('hide-after-select')) { classes = classes + ' hide-after-select'; }
        el.removeClass(classes).addClass(classes).animate({height: h}, 300);
        Core.map.clearEventMarkers();
        Core.map.addEventMarker(e);
        Core.map.centerOnMarker();
    },

    hide: function(after) {
        var e = $("#event-list");
        var h = e.find('.toggle').innerHeight();
        e.animate({height: h}, 300, function() {
            $("#event-list").removeClass('expanded');
            if (after) { after(); }
        });
    },

    toggle: function() {
        if ($('#event-list').hasClass('expanded')) { EventDrawer.hide(); }
        else { EventDrawer.show(); }
    },

    init: function() {
        $('#event-list').find('.toggle').on("click", function() { EventDrawer.toggle(); });
        $('#selected-event').find('.back').on('click', function() { EventDrawer.backToList(); });
        $("#events-content").on("click", "a", function(e) {
            var t = $(e.target);
            if (t.hasClass("event-id")) { EventDrawer.select(t.text()); }
            else { EventDrawer.select($(e.target).parents('.event').find('.event-id').text()); }
        });
    }
};

var Search = {
    init: function() {
        var s = $("#search-bar, #search-bar-nomap");
        s.find('input').on("change keyup", function() {
            if ($(this).val().trim() == "") {
                $(this).parents(".search-bar").find('.clear-search').removeClass('visible');
            }
            else {
                $(this).parents(".search-bar").find('.clear-search').removeClass('visible').addClass('visible');
            }
        });

        $(s).find(".clear-search").on("click", function() {

            var i = $(this).parents(".search-bar").find('input');
            i.val("");
            i.change();
            i.blur();

        })
    }
};

P01.Search = {
    addEventToList: function(event) {
        var html = $('<div class="event"><a class="event-id">'+event.code+'</a><a class="title">'+event.title+' <span class="locale">'+event.locale+'</span></a><a class="location">'+event.address+'</a><a class="time">'+event.hours[0]+' - '+event.hours[1]+'</a><a class="directions">Directions</a></div>');
        $("#events-content-nomap").append(html);
        $("#events-content-nomap").data('scroll').updateViewAndContentSize();
    },

    addEventsToList: function(list) {
        for (var i = 0; i < list.length; ++i) {
            P01.Search.addEventToList(list.at(i));
        }
    },

    clearEventList: function() {
        $("#events-content-nomap").html("");
        $("#events-content-nomap").data('scroll').updateViewAndContentSize();
    },

    init: function() {
        $("#events-content-nomap").on("click", "a", function(e) {
            var t = $(e.target);
            var code = (t.hasClass("event-id")) ? t.text() : $(e.target).parents('.event').find('.event-id').text();
            Screen.goto('map', function() {
                EventDrawer.select(code);
            });
        });
    }
};

$(document).ready(function() {
    Core.events.on("add", function() {
        Core.map.clearEventMarkers();
        Core.map.addEventMarkers(Core.events);

        P01.Map.clearEventDrawer();
        P01.Map.addEventsToDrawer(Core.events);

        P01.Search.clearEventList();
        P01.Search.addEventsToList(Core.events);
    });

    EventDrawer.init();
    Search.init();
    P01.Search.init();
});
