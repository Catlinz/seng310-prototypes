//=require core

var UI = window.UI || {};

UI.Checkbox = function(selector) {
    var ch = $(selector);

    var label = (ch.prev('label').length > 0) ? ch.prev('label') : ch.next('label');
    if (label.length == 0) { label = null; }
    var check_pos = (label && UI.isNextSibling(ch, label)) ? "right" : left;

    var root = ch.wrap('<div class="input-checkbox ch_'+check_pos+'"></div>').parent();
    root.append('<a class="check"><div class="fill"></div></a>');
    this.dom = {
        root: root,
        input: ch,
        check: root.find(".check"),
        label: label
    };

    if (label) {
        label.detach();
        root.prepend(label);
    }

    this.dom.input.hide();

    var _this = this;
    this.dom.input.on('change', function(e) { _this.checked(e.target.checked, true); });
    this.dom.check.on('click', function() { _this.checked(!_this.dom.input[0].checked); });
};

UI.Checkbox.prototype = {
    constructor: UI.Checkbox,

    checked: function(checked, fromInput) {
        if (checked != undefined) {
            this.dom.root.removeClass('checked');
            if (checked) { this.dom.root.addClass('checked') }
            if (!fromInput) { this.dom.input[0].checked = checked }
        }
        return this.dom.input[0].checked;
    }

};