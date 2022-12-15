'use strict'

let gSearchQuery = ''
let gKeywordSearchCountMap = { 'funny': 12, 'puppy': 16, 'baby': 8, 'president': 10}
let gImgs = [
    { id: 1, url: 'images/1.jpg', keywords: ['funny', 'trump', 'man', 'president', 'united states'] },
    { id: 2, url: 'images/2.jpg', keywords: ['cute', 'dog', 'puppy', 'puppies', 'labrador'] },
    { id: 3, url: 'images/3.jpg', keywords: ['cute', 'baby', 'dog', 'puppy', 'sleep'] },
    { id: 4, url: 'images/4.jpg', keywords: ['laptop', 'cat', 'sleep', 'cute'] },
    { id: 5, url: 'images/5.jpg', keywords: ['baby', 'strong', 'serious', 'funny'] },
    { id: 6, url: 'images/6.jpg', keywords: ['funny'] },
    { id: 7, url: 'images/7.jpg', keywords: ['baby', 'funny', 'surprised'] },
    { id: 8, url: 'images/8.jpg', keywords: ['funny'] },
    { id: 9, url: 'images/9.jpg', keywords: ['funny', 'baby'] },
    { id: 10, url: 'images/10.jpg', keywords: ['funny', 'united states', 'president', 'man', 'obama'] },
    { id: 11, url: 'images/11.jpg', keywords: ['man', 'men'] },
    { id: 12, url: 'images/12.jpg', keywords: ['funny', 'cat'] },
    { id: 13, url: 'images/13.jpg', keywords: ['funny', 'cat'] },
    { id: 14, url: 'images/14.jpg', keywords: ['funny', 'cat'] },
    { id: 15, url: 'images/15.jpg', keywords: ['funny', 'cat'] },
    { id: 16, url: 'images/16.jpg', keywords: ['funny', 'cat'] },
    { id: 17, url: 'images/17.jpg', keywords: ['president', 'serious', 'russia'] },
    { id: 18, url: 'images/18.jpg', keywords: ['funny', 'cat'] }
];

let gMeme

function getKeywordsMap(){
    return gKeywordSearchCountMap
}

function resetMeme(){
    gMeme = {
        selectedImgId: 1,
        selectedLineIdx: 0,
        lines: [
            {
                txt: 'Placeholder',
                size: 40,
                align: 'center',
                color: 'white',
                outlineColor: 'black',
                font: 'Impact'
            },
            {
                txt: 'Placeholder',
                size: 40,
                align: 'center',
                color: 'white',
                outlineColor: 'black',
                font: 'Impact'
            }
        ]
    }
}

function getMeme() {
    return gMeme
}

function getMemeImg() {
    return gImgs.find(img => img.id === gMeme.selectedImgId).url
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function getImgs() {
    if (!gSearchQuery) return gImgs
    return gImgs.filter(img => {
        // return img.keywords.includes(gSearchQuery)
        return img.keywords.some(keyword => keyword.includes(gSearchQuery))
    })
}


function setImg(id) {
    gMeme.selectedImgId = id
}

function setColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff
}

function setCurrentLine() {
    if (!gMeme.lines[gMeme.selectedLineIdx + 1]) {
        gMeme.selectedLineIdx = 0
        return
    }
    gMeme.selectedLineIdx++
}

function setSearch(query) {
    gSearchQuery = query.toLowerCase()
}

function setLineAlignment(alignment) {
    gMeme.lines[gMeme.selectedLineIdx].align = alignment
}

function setLineFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font
}

function setOutlineColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].outlineColor = color
}

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    setCurrentLine()
}

function addLine(txt = 'Placeholder', size = 40) {
    const newLine = {
        txt,
        size,
        align: 'center',
        color: 'white',
        outlineColor: 'black',
        font: 'Impact'
    }
    gMeme.lines.push(newLine)
}

function getSelectedLine(){
    return gMeme.lines[gMeme.selectedLineIdx]
}

function selectLine(selectedLine){
    const lineIdx = gMeme.lines.findIndex(line => line === selectedLine)
    gMeme.selectedLineIdx = lineIdx
}

function getMemeLines(){
    return gMeme.lines
}