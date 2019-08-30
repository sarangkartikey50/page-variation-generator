const utility = require("./utility");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs')


fs.readFile('./config.json', function(err, data) {
  if(err) throw err
  const config = JSON.parse(data)
  JSDOM.fromURL(config.url, {
    runScripts: "dangerously"
  }).then(dom => {
    utility.manipulateDomData(dom, config)
  })
})
