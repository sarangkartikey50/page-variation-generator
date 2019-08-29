const path = require('path')
const fs = require('fs')
const generateRandomNumbers = (size, min, max) => {
    const arr = []
    size = max - size
    while(arr.length < size){
        var r = Math.floor(Math.random()*max) + 1;
        if(arr.indexOf(r) === -1 && r >= min && r <= max) arr.push(r);
    }
    return arr
}
const createHTMLFile = (name, data) => {
    const filePath = path.join(__dirname, `pages/${name}.html`);
    fs.open(filePath, "w", function(err, file) {
      if (err) console.error(err)
    })
    fs.writeFile(filePath, data, function (err) {
      if (err) throw err;
    })
};
const manipulateDomData = (dom) => {
    fs.readFile('./config.json', function(err, data) {
        if(err) throw err
        const config = JSON.parse(data)
        let { totalPages, attributes } = config
        attributes = attributes.map(attr => {
            return {
                ...attr,
                pages: generateRandomNumbers(attr.count, 0, totalPages)
            }
        })
        console.log(attributes)
        for(let i=1; i<=totalPages; i++){
            const newDom = dom
            Array.from(newDom.window.document.body.children).forEach(child => {
                attributes.forEach(attr => {
                    if(attr.pages.includes(i)){
                        if(child.getAttribute(attr.name)){
                            const attributeValue = Math.random().toString(36).substring(7)
                            child.setAttribute(attr.name, attributeValue)
                        }
                    }
                })
            })
            createHTMLFile(i, dom.serialize())
        }
    })
}

module.exports = {
    generateRandomNumbers,
    createHTMLFile,
    manipulateDomData
}