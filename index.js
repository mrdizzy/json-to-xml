// Example
// -------
// 
// Takes a JavaScript object and recursively converts it into XML.
//
// **Input:**
//
//     {
//         customers: {
//             customer: [{
//                 "-name": "David Pettifer",
//                 "-age": 32,
//                 addresses: {
//                     address: [{
//                         house_number: 22,
//                         street: "Brook Road",
//                         postcode: "PO37 7LU"
//                     }, {
//                         house_number: 45,
//                         street: "Kents Hill Road",
//                         postcode: "SS7 5PJ"
//                     }, {
//                         house_number: 30,
//                         street: "Melbourne Street",
//                         postcode: "PO30 1SP"
//                     }]
//                 }
//             }, {
//                 "-name": "Valerie Sayce",
//                 "-age": 45,
//                 addresses: {
//                     address: [{
//                         house_number: 34,
//                         street: "Albert Road",
//                         postcode: "PL3 2JQ"
//                     }, {
//                         house_number: 113,
//                         street: "Winston Street",
//                         postcode: "SX3 9JB"
//                     }]
//                 }
//             }]
//         }
//     }
//
// **Output:**
//
//     <?xml version="1.0" encoding="UTF-8" ?>
//     <customers>
//       <customer name="David Pettifer" age="32">
//         <addresses>
//           <address>
//             <house_number>22</house_number> 
//             <street>Brook Road</street>
//             <postcode>PO37 7LU</postcode>
//           </address>
//           <address>
//             <house_number>45</house_number>
//             <street>Kents Hill Road</street>
//             <postcode>SS7 5PJ</postcode>
//           </address> 
//           <address>
//             <house_number>30</house_number>
//            <street>Melbourne Street</street>
//             <postcode>PO30 1SP</postcode>
//           </address>
//         </addresses>
//       </customer>
//       <customer name="Valerie Sayce" age="45">
//         <addresses>
//           <address>
//             <house_number>34</house_number>
//             <street>Albert Road</street>
//             <postcode>PL3 2JQ</postcode>
//           </address>
//           <address>
//             <house_number>113</house_number>
//             <street>Winston Street</street>
//             <postcode>SX3 9JB</postcode>
//           </address>
//         </addresses>
//       </customer>
//     </customers>
//
// * `xmlDecl`: Constant used for the xml declaration
// * `attr_prefix`: Constant used to prefix attributes
var xmlDecl = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>",
	attr_prefix = '-'

function writeXml(tree) {
	var xml = hashToXml(null, tree);
	return xmlDecl + xml;
};

// Takes a Javascript object and recursively iterates over its properties,
// ignoring any inherited properties, converting them into XML elements. 
//
//   * `name` is the name of the root element, used when recursively passing objects whose property values are themselves objects
//   * `tree` is an _object_ whose property names will be the names of the element, and whose property values will be the values of that element

function hashToXml(name, tree) {
	var elem = [];
	var attr = [];
	for (var key in tree) {
		if (!tree.hasOwnProperty(key)) continue;
		var val = tree[key];

		// Check to see if the property name begins with `attr_prefix` (which defaults to `-`), if it does then this name/value pair 
		// should be an attribute on the XML element, e.g. `age="15"`
		if (key.charAt(0) != attr_prefix) {

			// If the property value is a null or undefined value, then we have a self-closing element, such as
			// `<br/>`
			if (typeof(val) == "undefined" || val == null) {
				elem[elem.length] = "<" + key + " />";
			}

			// Check to see if the proeprty value is an `Array`, if it is then we handle it with the
			// `arrayToXml()` method, passing it the property name which is used for the root element that will 
			// contain this array object
			else if (typeof(val) == "object" && val.constructor == Array) {
				elem[elem.length] = arrayToXml(key, val);
			}

			// Check to see if the property value is an `Object`, if it is then we call `hashToXml()` recursively
			else if (typeof(val) == "object") {
				elem[elem.length] = hashToXml(key, val);
			}

			// Otherwise we have a standard key value pair, e.g. <name>David</name>
			else {
				elem[elem.length] = scalarToXml(key, val);
			}
		}

		// Create attributes on an element, such as `name="David"`
		else {
			attr[attr.length] = " " + (key.substring(1)) + '="' + (escapeXml(val)) + '"';
		}
	}
	var joinedAttrs = attr.join("");
	var joinedElements = elem.join("");

	// Check to see if there is a root element
	if (typeof(name) == "undefined" || name == null) {
	}

	// If the `elem` array contains elements, then add these elements to the root element
	else if (elem.length > 0) {
		joinedElements = "<" + name + joinedAttrs + ">" + joinedElements + "</" + name + ">";
	}
	// Otherwise the root element is just a self-closing element
	else {
		joinedElements = "<" + name + joinedAttrs + " />";
	}
	return joinedElements;
};

// This method takes an array and converts it into a series of XML elements

function arrayToXml(name, array) {
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
		return "<" + name + ">" + escapeXml(text) + "</" + name + ">";
	}
};

function escapeXml(text) {
	return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

module.exports = writeXml;