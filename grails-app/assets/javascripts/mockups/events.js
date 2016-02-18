//=require ../core/ajax
//=require filters

var Events = {
    filters: {
        saved: new Filters(),
        temp: new Filters(),
        state: {},

        restore: function() { Events.filters.temp.copy(Events.filters.saved); },
        save: function() { Events.filters.saved.copy(Events.filters.temp); },
        setLocation: function(latlng) {
            Events.filters.saved.distance.center = latlng;
            Events.filters.temp.distance.center = latlng;
        },
        setSearchText: function(value) {
            Events.filters.saved.text.value = value;
            Events.filters.temp.text.value = value;
        },
        store: function(id) { Events.filters.state[id] = Events.filters.saved.hashCode(); }
    },

    getParams: function(params) {
        if (!params) { params = {}; }
        params = Events.filters.saved.setParams(params);
        params.p = Core.id;
        return params;
    },

    getSuccessFunc: function(success) {
        return function(data) {
            Events.filters.saved.updateAfterFetch(data);
            if (success) { success(data); }
        };
    },

    get: function(success, params) { /* { html:<T|F>, details:<T|F>, id: } */
        if (!params) { params = {}}
        params.p = Core.id;
        GM.Ajax.get('/events/get', params, {
            success: function(data) { if (success) { success(data); } }
        });
    },

    setFilterDefaults: function() {
        GM.Ajax.get('/events/filterDefaults', {}, {
            success: function(data) {
                if (data.DistanceFilter) { data.DistanceFilter.center = Core.map.location; }
                if (!data.TextFilter) { data.TextFilter = {value: ""}; }
                Events.filters.saved.setToDefaults(data);
                Events.filters.restore();
                Search.synchroniseInputs();
            }
        })
    },

    list: function(success) {
        GM.Ajax.get('/events/list', Events.getParams(), {
            success: Events.getSuccessFunc(success)
        });
    },

    map: function(success) {
        GM.Ajax.get('/events/map', Events.getParams(), {
            success: Events.getSuccessFunc(success)
        });
    },

    shouldFetch: function(id) {
        return !(Events.filters.state[id] && Events.filters.state[id] == Events.filters.saved.hashCode());
    },

    venue: function(success, params) { /* { html:<T|F>, details:<T|F>, id: } */
        GM.Ajax.get('/venue/get', Events.getParams(params), {
            success: Events.getSuccessFunc(success)
        });
    }
};