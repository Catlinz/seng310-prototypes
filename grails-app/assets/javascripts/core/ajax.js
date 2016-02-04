//=require core
//=require msg

GM.Ajax = { queue: [], requestInProgress: false };

GM.Ajax.Request = function(url, data, optional) {
    this.url = url;
    var _complete = optional.complete;
    var _success = optional.success;
    var _error = optional.error;
    optional.complete = function(jqXHR, textStatus) { GM.Ajax.doSendNextRequest();  if (_complete) { _complete(jqXHR, textStatus); }};
    optional.success = function(data, textStatus, jqXHR) { GM.Ajax.checkForJSONErrorOrWarning(data);  if (_success) { _success(data, textStatus, jqXHR); }};
    optional.error = function(jqXHR, textStatus, errorThrown) { GM.Ajax.handleError(jqXHR, textStatus, errorThrown);  if (_error) { _error(jqXHR, textStatus, errorThrown); }};
    this.options = optional;
    this.options.data = data;
};

GM.Ajax.checkForJSONErrorOrWarning = function(params) {
    if (params.error) {
        GM.Msg.error(params.error);
    }
    else if (params.warning) {
        GM.Msg.warn(params.warning)
    }
};

GM.Ajax.doSendNextRequest = function() {
    if (GM.Ajax.queue.length > 0) {
        var request = GM.Ajax.queue.pop();
        $.ajax(request.url, request.options);
    }
    else { GM.Ajax.requestInProgress = false; }
};

/** optional properties are:
 * error: function(jqXHR, String textStatus, String errorThrown)
 * complete: function(jqXHR, String textStatus)
 * success: function(data, String textStatus, jqXHR)
 */
GM.Ajax.get = function(url, data, optional) {
    if (!optional) { optional = {}; }
    if (!data) { data = {}; }
    optional.method = 'GET';
    GM.Ajax.queue.push(new GM.Ajax.Request(url, data, optional));
    if (!GM.Ajax.requestInProgress) {
        GM.Ajax.requestInProgress = true;
        GM.Ajax.doSendNextRequest();
    }
};

GM.Ajax.handleError = function(jqXHR, textStatus, errorThrown) {
    var title = jqXHR.status + " - " + errorThrown;
    var msg = "";
    if (jqXHR.responseJSON) {
        if (jqXHR.responseJSON.exception) {
            msg = msg + 'Exception: <i>' + jqXHR.responseJSON.exception + '</i><br />';
        }
        if (jqXHR.responseJSON.path) {
            msg = msg + 'Path: <i>' + jqXHR.responseJSON.path + '</i><br />';
        }
        if (jqXHR.responseJSON.message) {
            msg = msg + '&quot;' + jqXHR.responseJSON.message + '&quot;';
        }
    }
    GM.Msg.error({title: title, msg: msg})
};

/** optional properties are:
 * error: function(jqXHR, String textStatus, String errorThrown)
 * complete: function(jqXHR, String textStatus)
 * success: function(data, String textStatus, jqXHR)
 */
GM.Ajax.post = function(url, data, optional) {
    if (!optional) { optional = {}; }
    if (!data) { data = {}; }
    optional.method = 'POST';
    GM.Ajax.queue.push(new GM.Ajax.Request(url, data, optional));
    if (!GM.Ajax.requestInProgress) {
        GM.Ajax.requestInProgress = true;
        GM.Ajax.doSendNextRequest();
    }
};