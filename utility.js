const path = require('path')
const fs = require('fs')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

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
const manipulateDomData = (dom, config) => {
    let { attributes, totalPages, url } = config
    deletePages()
    const attributeSet = new Set()
    findAttributes(dom.window.document.body, attributeSet)
    attributes = generateAttributeCountArray(attributeSet, attributes, totalPages)
    fs.writeFile('./attribute.json', JSON.stringify({ attributes }, null, 2), (err) => {
        if(err) throw err
    })
    for(let i=1; i<=totalPages; i++){
        JSDOM.fromURL(url, {
            runScripts: "dangerously"
        }).then(newDom => { 
            Array.from(newDom.window.document.body.children).forEach(child => {
                traverseChildren(child, attributes, i)
            })
            createHTMLFile(i, newDom.serialize())
        })
    }
}
const traverseChildren = (child, attributes, page) => {
    attributes.forEach(attr => {
        if(attr.pages.includes(page)){
            if(child.getAttribute(attr.name)){
                const attributeValue = Math.random().toString(36).substring(7)
                child.setAttribute(attr.name, attributeValue)
            }
        }
    })
    Array.from(child.children).forEach(newChild => {
        traverseChildren(newChild, attributes, page)
    })
}
const findAttributes = (element, set) => {
    element.getAttributeNames().forEach(attr => set.add(attr))
    Array.from(element.children).forEach(child => findAttributes(child, set))
}
const generateAttributeCountArray = (attributeSet, configAttributes, totalPages) => {
    return Array.from(attributeSet).map(attr => {
        const found = configAttributes.find(attribute => attribute.name === attr)
        if(found){
            return {
                ...found,
                pages: generateRandomNumbers(found.count, 0, totalPages)
            }
        } else {
            const count =  Math.floor((Math.random()*totalPages + 1))
            return {
                name: attr,
                count,
                pages: generateRandomNumbers(count, 0, totalPages)
            }
        }
    })
}
const deletePages = () => {
    const directory = 'pages';
    fs.readdir(directory, (err, files) => {
    if (err) throw err;
    for (const file of files) {
        fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
        });
    }
    });
}
module.exports = {
    generateRandomNumbers,
    createHTMLFile,
    manipulateDomData,
    findAttributes,
    deletePages
}