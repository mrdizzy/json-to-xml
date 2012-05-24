var xmlDecl = '<?xml version="1.0" encoding="UTF-8" ?>',
    attr_prefix = '-'

function writeXml(tree) {
    var xml = hashToXml(null, tree);
    return xmlDecl + xml;
};

function hashToXml(name, tree) {
        var elem = [];
        var attr = [];
        for (var key in tree) {
            if (!tree.hasOwnProperty(key)) continue;
            var val = tree[key];
            if (key.charAt(0) != attr_prefix) {
                if (typeof(val) == "undefined" || val == null) {
                    elem[elem.length] = "<" + key + " />";
                }
                else if (typeof(val) == "object" && val.constructor == Array) {
                    elem[elem.length] = arrayToXml(key, val);
                }
                else if (typeof(val) == "object") {
                    elem[elem.length] = hashToXml(key, val);
                }
                else {
                    elem[elem.length] = scalarToXml(key, val);
                }
            }
            else {
                attr[attr.length] = " " + (key.substring(1)) + '="' + (escapeXml(val)) + '"';
            }
        }
        var jattr = attr.join("");
        var jelem = elem.join("");
        if (typeof(name) == "undefined" || name == null) {
            // no tag
        }
        else if (elem.length > 0) {
            if (jelem.match(/\n/)) {
                jelem = "<" + name + jattr + ">\n" + jelem + "</" + name + ">"; // newline if spacing
            }
            else {
                jelem = "<" + name + jattr + ">" + jelem + "</" + name + ">"; // newline if spacing
            }
        }
        else {
            jelem = "<" + name + jattr + " />"; // newline if spacing
        }
        return jelem;
    };


var arrayToXml = function(name, array) {
        var out = [];
        for (var i = 0; i < array.length; i++) {
            var val = array[i];
            if (typeof(val) == "undefined" || val == null) {
                out[out.length] = "<" + name + " />";
            }
            else if (typeof(val) == "object" && val.constructor == Array) {
                out[out.length] = arrayToXml(name, val);
            }
            else if (typeof(val) == "object") {
                out[out.length] = hashToXml(name, val);
            }
            else {
                out[out.length] = scalarToXml(name, val);
            }
        }
        return out.join("");
    };

function scalarToXml(name, text) {
        if (name == "#text") {
            return escapeXml(text);
        }
        else {
            return "<" + name + ">" + escapeXml(text) + "</" + name + ">"; // newline if spacing
        }
    };


function escapeXml(text) {
    return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

module.exports = writeXml;