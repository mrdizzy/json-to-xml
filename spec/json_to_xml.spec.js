var vows = require('vows'),
    jsonToXml = require('./../index.js');

var html = {
    html: {
        b: {
            i: "Hello"
        },
        p: "Paragraph",
        table: {
            tr: {
                td: [ "cell1", "cell2", "cell3", "cell4", { p: "Hello" } ]
            },
        }
    },
    form: {
        input: {
            "-type": "text",
            "-value": "name",
            "#text": "Hello"
        }
    }
};


console.log(jsonToXml(html));