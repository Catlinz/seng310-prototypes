

var Filters = {
    distance: null,
    cover: null,
    date: null,
    age: null,

    updateUIAfterSearch: function(stats) {},

    setParams: function(params) {
        params = Filters.distance.setParams(params);
        params = Filters.cover.setParams(params);
        params = Filters.date.setParams(params);
        params = Filters.age.setParams(params);
        return params;
    },

    hashCode: function() {
        var str = Filters.distance.str() + Filters.cover.str() + Filters.date.str() + Filters.age.str();
        return str.hashCode()
    },

    initialise: function() {
        Filters.distance = new Filters.DistanceFilter();
        Filters.cover = new Filters.CoverChargeFilter();
        Filters.date = new Filters.DateFilter();
        Filters.age = new Filters.AgeFilter();
    },

    DistanceFilter: function(center, maxRadiusMetres, minRadiusMetres) {
        this.center = center || {lat: 0, lng: 0};
        this.maxRadius = maxRadiusMetres || 100000;
        this.minRadius = minRadiusMetres || 0;
    },

    CoverChargeFilter: function(min, max) {
        this.min = min || 0;
        this.max = max || 0;
    },

    DateFilter: function() {
        this.days = [0];
        this.start = null;
        this.end = null;
    },

    AgeFilter: function() {
        this.hideAdultOnly = false;
    }
};

Filters.DistanceFilter.prototype = {
    constructor: Filters.DistanceFilter,

    str: function() {
        if (this.isValid()) {
            return 'DF' + this.center.lat + ' ' + this.center.lng + ' ' + this.maxRadius + ' ' + this.minRadius
        }
        else { return 'DF' }
    },

    isValid: function() { return this.minRadius != this.maxRadius; },

    reset: function() { this.maxRadius = 100000;  this.minRadius = 0;  this.center = {lat: 0, lng: 0}; },

    setParams: function(params) {
        params['DistanceFilter'] = true;
        params['DistanceFilter.center.lat'] = this.center.lat;
        params['DistanceFilter.center.lng'] = this.center.lng;
        if (this.isValid()) {
            params['DistanceFilter.maxRadius'] = this.maxRadius;
            params['DistanceFilter.minRadius'] = this.minRadius;
        }
        return params;
    }
};

Filters.CoverChargeFilter.prototype = {
    constructor: Filters.CoverChargeFilter,

    str: function() {
        if (this.isValid()) { return 'CCF' + this.min + ' ' + this.max }
        else { return 'CCF' }
    },

    isValid: function() { return this.min < this.max; },
    reset: function() { this.min = 0; this.max = 0; },

    setParams: function(params) {
        params['CoverChargeFilter'] = true;
        if (this.isValid()) {
            params['CoverChargeFilter.min'] = this.min;
            params['CoverChargeFilter.max'] = this.max;
        }
        return params;
    }
};

Filters.DateFilter.prototype = {
    constructor: Filters.DateFilter,

    str: function() {
        if (this.isValid()) { return 'DTF' + this.days.toString() + ' ' + this.start + ' ' +this.end}
        else { return 'DTF'}
    },

    isValid: function() { return this.days.length > 0 || (this.start != null && this.end != null); },
    reset: function() { this.days = [0];  this.start = null;  this.end = null; },

    setParams: function(params) {
        if (this.isValid()) {
            params['DateFilter'] = true;
            if (this.start != null && this.end != null) {
                params['DateFilter.start'] = this.start;
                params['DateFilter.end'] = this.end;
            }
            else {
                params['DateFilter.days'] = this.days;
            }
        }
        return params;
    }
};

Filters.AgeFilter.prototype = {
    constructor: Filters.AgeFilter,

    str: function() { return 'AF'+this.hideAdultOnly; },
    isValid: function() { return true; },
    reset: function() { this.hideAdultOnly = true; },

    setParams: function(params) {
        params['AgeFilter'] = true;
        params['AgeFilter.hideAdultOnly'] = this.hideAdultOnly;
        return params;
    }
};










UI.DateFilter = function(selector) {
    var jq = $(selector);
    this.dom = {
        root: jq,
        days: jq.find('.day-chooser a'),
        start: jq.find('input.date-start'),
        end: jq.find('input.date-end')
    };

    this.days = [];

    this.start = null;
    this.end = null;

    this.initialise();
};

UI.DateFilter.isValidDate = function(date) {
    var n = Date.parse(date);
    return (n == n);
};

UI.DateFilter.prototype = {
    constructor: UI.DateFilter,

    deselectDays: function() {
        this.days = [];
        this.dom.days.removeClass('selected');
    },

    initialise: function() {
        this.initialiseDayChooser();
        this.initialiseDateRange();
    },

    initialiseDateRange: function() {
        this.start = null;
        this.end = null;

        var _this = this;
        this.dom.start.on('change', function() { _this.setStartOfRange($(this).val()); });
        this.dom.end.on('change', function() { _this.setEndOfRange($(this).val()) });
    },

    initialiseDayChooser: function() {
        this.days = [];

        var now = new Date();
        var day = now.getDay();

        for (var i = 0; i < 7; ++i) {
            $(this.dom.days[(day + i) % 7]).data("dayOffset", i)
        }

        this.dom.days.removeClass('selected');
        this.toggleDay(this.dom.days[day]);

        var _this = this;
        this.dom.days.on('click', function() { _this.toggleDay(this); })
    },

    reset: function() {
        this.dom.days.removeClass('selected');
        this.dom.end.val("");
        this.dom.start.val("");
        this.start = null;
        this.end = null;
        this.days = [];
    },

    setDays: function(days) {
        this.days = (days || []).slice(0);
        this.dom.days.removeClass('selected');
        var _this = this;
        this.dom.days.each(function(i, elem) {
            if (_this.days.indexOf($(elem).data('dayOffset')) != -1) {
                $(elem).addClass('selected');
            }
        });
    },

    setEndOfRange: function(date) {
        if (UI.DateFilter.isValidDate(date)) {
            this.end = date;
            if (!this.start) {
                this.start = date;
                this.dom.start.val(date)
            }
            this.deselectDays();
        }
    },

    setStartOfRange: function(date) {
        if (UI.DateFilter.isValidDate(date)) {
            this.start = date;
            if (!this.end) {
                this.end = date;
                this.dom.end.val(date)
            }
            this.deselectDays();
        }
    },

    toggleDay: function(sel) {
        var jq = $(sel);
        var offset = parseInt(jq.data('dayOffset'));
        var len = this.days.length;
        for (var i = 0; i < len; ++i) {
            if (this.days[i] == offset) { this.days.splice(i, 1);  break;}
            else if (this.days[i] > offset) { this.days.splice(i, 0, offset);  break; }
        }
        if (len == this.days.length) { this.days.push(offset); }

        jq.removeClass('selected');
        if (len < this.days.length) { jq.addClass('selected'); }

        this.unsetDateRange();
    },

    unsetDateRange: function() {
        this.start = null;
        this.end = null;
        this.dom.start.val("");
        this.dom.end.val("")
    }
};




