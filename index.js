const utility = require("./utility");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

JSDOM.fromFile("./test.html", {
  runScripts: "dangerously"
}).then(dom => {
  utility.manipulateDomData(dom)
})
