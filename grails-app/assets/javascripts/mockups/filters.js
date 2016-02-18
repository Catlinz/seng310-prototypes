//=require ../core/event

function Filters() {
    this.distance = new Filters.DistanceFilter(0, 100000);
    this.cover = new Filters.CoverChargeFilter(0, 100);
    this.date = new Filters.DateFilter([0]);
    this.age = new Filters.AgeFilter(false);
    this.text = new Filters.TextFilter();
    this.h = new GM.Handlers({obj: this});
    this.LoopType = Filters.Type;
}
Filters.Type = "Filters";

Filters.prototype = {
    constructor: Filters,

    copy: function(from) {
        this.distance.copy(from.distance);
        this.cover.copy(from.cover);
        this.date.copy(from.date);
        this.age.copy(from.age);
        this.text.copy(from.text);
    },

    fire: function(action) { this.h.fire(action); },

    hashCode: function() {
        var str = this.distance.str() + this.cover.str() + this.date.str() + this.age.str() + this.text.str();
        return str.hashCode()
    },

    off: function(action) { this.h.off(action); },
    on: function(action, func) { return this.h.on(action, func); },

    setParams: function(params) {
        params = this.distance.setParams(params);
        params = this.cover.setParams(params);
        params = this.date.setParams(params);
        params = this.age.setParams(params);
        params = this.text.setParams(params);
        return params;
    },

    setToDefaults: function(values) {
        if (values.DistanceFilter) { this.distance.copy(values.DistanceFilter); }
        if (values.CoverChargeFilter) { this.cover.copy(values.CoverChargeFilter); }
        if (values.DateFilter) { this.date.copy(values.DateFilter); }
        if (values.AgeFilter) { this.age.copy(values.AgeFilter); }
        if (values.TextFilter) { this.text.copy(values.TextFilter); }
        this.fire("update");
    },

    updateAfterFetch: function(data) {
        this.fire("update");
    }
};

Filters.DistanceFilter = function(minRange, maxRange) {
    this.range = {min: minRange, max: maxRange};
    this.center = {lat: 0, lng: 0};
    this.minRadius = minRange;
    this.maxRadius = maxRange;
    this.LoopType = Filters.DistanceFilter.Type;
};
Filters.DistanceFilter.Type = "DistanceFilter";
Filters.DistanceFilter.prototype = {
    constructor: Filters.DistanceFilter,
    str: function() { return 'DF'+this.center.lat+' '+this.center.lng+' '+this.maxRadius+' '+this.minRadius; },
    isValid: function() { return this.minRadius != this.maxRadius; },

    copy: function(from) {
        this.range = {min: from.range.min, max: from.range.max};
        this.center = {lat: from.center.lat, lng: from.center.lng};
        this.minRadius = from.minRadius;  this.maxRadius = from.maxRadius;
    },

    set: function(min, max, center, range) {
        if (min != undefined && min != null) { this.minRadius = min; }
        if (max != undefined && max != null) { this.maxRadius = max; }
        if (center) { this.center = {lat: center.lat, lng: center.lng}; }
        if (range) { this.range = {min: range.min, max: range.max}; }
    },

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

Filters.CoverChargeFilter = function(minRange, maxRange) {
    this.range = {min: minRange, max: maxRange};
    this.min = minRange;
    this.max = maxRange;
    this.LoopType = Filters.CoverChargeFilter.Type;
};
Filters.CoverChargeFilter.Type = "CoverChargeFilter";
Filters.CoverChargeFilter.prototype = {
    constructor: Filters.CoverChargeFilter,
    str: function() { return 'CCF' + this.min + ' ' + this.max },
    isValid: function() { return this.min < this.max; },

    copy: function(from) {
        this.range = {min: from.range.min, max: from.range.max};
        this.min = from.min;  this.max = from.max;
    },

    set: function(min, max, range) {
        if (min != undefined && min != null) { this.min = min; }
        if (max != undefined && max != null) { this.max = max; }
        if (range) { this.range = {min: range.min, max: range.max}; }
    },

    setParams: function(params) {
        params['CoverChargeFilter'] = true;
        if (this.isValid()) {
            params['CoverChargeFilter.min'] = this.min;
            params['CoverChargeFilter.max'] = this.max;
        }
        return params;
    }
};

Filters.DateFilter = function(days, start, end) {
    this.days = days || [];
    this.start = start || null;
    this.end = end || null;
    this.LoopType = Filters.DateFilter.Type;
};
Filters.DateFilter.Type = "DateFilter";
Filters.DateFilter.prototype = {
    constructor: Filters.DateFilter,
    str: function() { return 'DTF' + this.days.toString() + ' ' + this.start + ' ' +this.end; },
    isValid: function() { return this.days.length > 0 || (this.start != null && this.end != null); },

    copy: function(from) {
        this.days = from.days.slice(0);
        this.start = from.start;  this.end = from.end;
    },

    set: function(days, start, end) {
        if (days && days.length > 0) {
            this.days = days;
            this.start = null;  this.end = null;
        }
        else {
            this.days = [];
            this.start = start || null;
            this.end = end || null;
        }
    },

    setParams: function(params) {
        if (this.isValid()) {
            params['DateFilter'] = true;
            if (this.start != null && this.end != null) {
                params['DateFilter.start'] = this.start;
                params['DateFilter.end'] = this.end;
            }
            else { params['DateFilter.days'] = this.days; }
        }
        return params;
    }
};

Filters.AgeFilter = function(hideAdultOnly) {
    this.hideAdultOnly = hideAdultOnly || false;
    this.LoopType = Filters.AgeFilter.Type;
};
Filters.AgeFilter.Type = "AgeFilter";
Filters.AgeFilter.prototype = {
    constructor: Filters.AgeFilter,
    str: function() { return 'AF'+this.hideAdultOnly; },
    isValid: function() { return true; },
    copy: function(from) { this.hideAdultOnly = from.hideAdultOnly; },

    set: function(hideAdultOnly) {
        this.hideAdultOnly = hideAdultOnly;
    },

    setParams: function(params) {
        params['AgeFilter'] = true;
        params['AgeFilter.hideAdultOnly'] = this.hideAdultOnly;
        return params;
    }
};

Filters.TextFilter = function() {
    this.value = "";
    this.LoopType = Filters.TextFilter.Type;
};
Filters.TextFilter.Type = "TextFilter";
Filters.TextFilter.prototype = {
    constructor: Filters.TextFilter,
    str: function() { return 'TF'+this.value.trim(); },
    isValid: function() { return this.value.trim() != ""; },
    copy: function(from) { this.value = from.value; },

    setParams: function(params) {
        if (this.isValid()) {
            params['TextFilter'] = true;
            params['TextFilter.value'] = this.value.trim();
        }
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

    this.h = new GM.Handlers({obj: this});

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

    fire: function(action) { this.h.fire(action); },

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

    off: function(action) { this.h.off(action); },
    on: function(action, func) { return this.h.on(action, func); },

    reset: function() {
        this.dom.days.removeClass('selected');
        this.dom.end.val("");
        this.dom.start.val("");
        this.start = null;
        this.end = null;
        this.days = [];
    },

    set: function(days, start, end) {
        if (days && days.length > 0) {
            this.setDays(days);
            this.unsetDateRange();
        }
        else {
            this.deselectDays();
            this.start = start;
            this.end = end;
            this.dom.start.val(start);
            this.dom.end.val(end);
        }
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
            this.fire("change");
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
            this.fire("change");
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
        this.fire("change");
    },

    unsetDateRange: function() {
        this.start = null;
        this.end = null;
        this.dom.start.val("");
        this.dom.end.val("")
    }
};




