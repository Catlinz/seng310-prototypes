var UI = window.UI || {};

UI.isPrevSibling = function(elem, sibling) {
    sibling = $(sibling);
    var pr = $(elem).prev();
    return (pr.length > 0 && sibling.length > 0 && pr[0] == sibling[0]);
};

UI.isNextSibling = function(elem, sibling) {
    sibling = $(sibling);
    var nx = $(elem).next();
    return (nx.length > 0 && sibling.length > 0 && nx[0] == sibling[0]);
};