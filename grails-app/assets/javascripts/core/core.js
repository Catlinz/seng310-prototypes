//=require jquery-2.1.3.js
if (window.GM == undefined) { window.GM = {}; }

GM.notNull = function(arg) { return (arg != undefined && arg != null); };

GM.hasAttr = function(elem, attr) {
    var jqElem = $(elem);
    return (jqElem.length == 1 && jqElem.attr(attr) && jqElem.attr(attr).trim().length > 0)
};

/**
 * Returns true if target is either in one of the elements or is
 * one of the elements.
 */
GM.targetIsInElement = function(target, elements) {
    if (!target.jquery) { target = $(target); }
    return (target.is(elements) || target.parents().is(elements));
};

GM.PageBlock = {
    hide: function(time) {
        var pb = $('#gm-page-block');
        if (pb.length == 0) { return }

        pb.stop(true);
        pb.animate({opacity: 0}, time, function() {
            $('body').removeClass('gm-page-block');
        });
    },

    show: function(time) {
        var pb = $('#gm-page-block');
        if (pb.length == 0) {
            $('body').append($('<div id="gm-page-block"></div>'));
            pb = $('#gm-page-block');
        }
        pb.stop(true);
        $('body').removeClass('gm-page-block').addClass('gm-page-block');
        pb.animate({opacity: 0.7}, time);

    }
};

// usage: log('inside coolFunc',this,arguments);
// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
GM.log = function(){
    GM.log.history = GM.log.history || [];   // store logs to an array for reference
    GM.log.history.push(arguments);
    if(window.console){
        console.log( Array.prototype.slice.call(arguments) );
    }
};