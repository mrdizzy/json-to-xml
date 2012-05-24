var vows = require('vows'),
    jsonToXml = require('./../index.js'),
    fs = require('fs'),
    assert = require('assert');

function readFixture(filename, cb) {
    fs.readFile(__dirname + '/fixtures/' + filename, 'utf-8', function(err, res) {
        cb(err, res);
    });
}

vows.describe('JSON to XML Parser').addBatch({
    "when given a flat object": {
        topic: {
            name: "David",
            age: 15,
            town: "Shanklin",
            postcode: "PO37 7LU"
        },
        "we get the equivalent XML": function(topic) {
            var xml = jsonToXml(topic);
            readFixture('flat_object.xml', function(err, res) {
                assert.equal(xml, res);
            });
        }
    },
    "when given a deeply nested object": {
        topic: {
            html: {
                b: {
                    i: "Hello"
                },
                p: {
                    i: {
                        b: {
                            del: "Paragraph here!"
                        }
                    }
                },
                form: {
                    input: {
                        bold: "David"
                    }
                }

            }
        },
        "we get the correct XML": function(topic) {
            var xml = jsonToXml(topic);
            readFixture('deeply_nested_object.xml', function(err, res) {
                assert.equal(xml, res);
            });
        }
    },
    "when given an array of values": {
        topic: {
            names: {
                name: ["David", "Martine", "Lewis", "John"]
            }
        },
        "we get the correct XML": function(topic) {
            var xml = jsonToXml(topic);
            readFixture('array_of_values.xml', function(err, res) {
                assert.equal(xml, res);
            });
        }
    },
    "when given a deeply nested object containing arrays of values": {
        topic: {
            html: {
                p: {
                    b: "Paragraph"
                },
                table: {
                    tr: {
                        td: ["Cell 1", "Cell 2", "Cell 3",
                        {
                            p: {
                                i: "A deeply nested Cell"
                            },
                            i: {
                                b: "Again deeply nested"
                            }

                        }, "Cell 4", "Cell 5"]

                    }
                },
                arrayOfValues: ["Value 2", "Value 2", "Value 3"]
            }
        },
        "the correct XML should be returned": function(topic) {
            var xml = jsonToXml(topic);
            readFixture('deeply_nested_with_array_of_values.xml', function(err, res) {
                assert.equal(xml, res)

            })
        }
    },
    "when given undefined values": {
        topic: {
            html: {
                p: "Paragraph",
                hr: null
            }
        },
        "we should get empty self-closing elements": function(topic) {
            var xml = jsonToXml(topic);
            readFixture('empty_self_closing_elements.xml', function(err, res) {
                assert.equal(xml, res);
            })
        }
    },
    "when given keys beginning with a hyphen": {
        topic: {
            html: {
            "-name": "David",
            "-age": 15,
            p: "Paragraph",
            i: {
                b:
                "Bold text"
            }
            }
        },
        "we should get elements with attributes": function(topic){
            var xml = jsonToXml(topic);
            readFixture('attributes.xml', function(err,res) {
              assert.equal(xml, res);  
            })
        }
    },
    "when given keys beginning with #text": {
        topic: {
            html: {
                form: {
                    "-method": "GET",
                    "-url": "http://www.dizzy.co.uk",
                    "#text": "Text inside form"
                }
            }
        },
        "we should get a text node": function(topic){
            var xml = jsonToXml(topic);
            readFixture('text_node.xml', function(err,res) {
                assert.equal(xml, res)
            
            })
        }
        
    }
}).run();