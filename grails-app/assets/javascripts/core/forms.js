//=require core
if (GM.Forms == undefined) { GM.Forms = {}; }

GM.Forms.formatAllGMInputs = function() {
    var inputs = $('.gm-input, input[type="text"], input[type="email"], input[type="search"], textarea');
    var num_inputs = inputs.length;

    for (var i = 0; i < num_inputs; ++i) {
        GM.Forms.formatGMInput(inputs[i]);
    }
};

GM.Forms.formatGMInput = function(input) {
    var label = $(input).siblings("label")[0] || null;
    if (label != null) {
        $(input).on("focus", function(e) {
            $(label).hide();
            $(label).parents(".gm-input").addClass("focused")
        });
        $(input).on("blur", function(e) {
            $(label).parents(".gm-input").removeClass("focused");
            if ($(input).val() == "") {
                $(label).show();
            }
        });
        $(label).on("click", function(e) { $(input).focus(); });
        if ($(input).val() != "") {
            $(label).hide();
        }
    }
};

GM.Forms.checkLabel = function(input) {
    var label = $(input).siblings("label");
    if ($(input).val().trim() != "") { label.hide(); }
    else { label.show(); }
};

$(document).ready(function() {
    GM.Forms.formatAllGMInputs();
});