//=require core

GM.Handlers = function(params) {
    this.map = {};
    this.obj = null;
    this.allowed = null;
    this.afterFire = null;

    if (!params) { params = {}; }

    if (params.obj) { this.obj = params.obj; }
    if (params.afterFire) { this.afterFire = params.afterFire; }
    if (params.allowed) {
        this.allowed = ($.type(params.allowed) == 'string') ? params.allowed.split(/\s/) : params.allowed;
        for (var i = 0; i < this.allowed.length; ++i) {
            this.map[(this.allowed[i])] = [];
        }
    }
};

GM.Handlers.prototype = {
    constructor: GM.Handlers,

    fire: function(action) {
        if ($.type(action) == "string") { action = [action]; }
        for (var i = 0; i < action.length; ++i) {
            var alist = this.map[action[i]] || [];
            for (var j = 0; j < alist.length; ++j) { alist[j].func(this.obj); }
        }
        if (this.afterFire) { this.afterFire(this.obj); }
    },

    off: function(action) {
        var a = this.parseActionAndID(action);
        if (a.action == "") {
            /* We want to remove all actions that have matching ids */
            for (action in this.map) {
                if (this.map.hasOwnProperty(action)) {
                    this.removeHandlerByID(this.map[action], a.id);
                }
            }
        }
        else {
            if (this.map[a.action]) {
                if (!a.id) { this.map[a.action] = []; } /* Clear all */
                else { /* Only delete matching */
                    this.removeHandlerByID(this.map[a.action], a.id);
                }
            }
        }
    },

    on: function(action, func) {
        var a = this.parseActionAndID(action);
        if (this.allowed == null && !this.map[a.action]) { this.map[a.action] = []; }
        if (this.map[a.action]) {
            this.map[a.action].unshift({id: a.id, func: func});
            return true;
        }
        else { return false; }
    },

    parseActionAndID: function(action) {
        var idx = action.indexOf('.');
        if (idx == -1) { return {action: action.trim(), id: null}; }
        else { return {action: action.slice(0, idx).trim(), id: action.slice(idx+1).trim() };}
    },

    removeHandlerByID: function(a, id) {
        for (var i = 0; i < a.length; ++i) { if (a[i].id.indexOf(id) == 0) { a.splice(i, 1); } }
    }
};