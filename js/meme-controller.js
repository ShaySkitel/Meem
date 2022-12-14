'use strict'

let gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

let gElCanvas
let gCtx

function onEditorInit() {
    gElCanvas = document.querySelector('.canvas-container canvas')
    gCtx = gElCanvas.getContext('2d')
    renderMeme()
    setInputValue()
}

function renderMeme() {
    
    const memeImgPath = getMemeImg()

    const elImg = new Image()
    elImg.src = memeImgPath

    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        renderTxt()
        // renderTxt({ txt, txtColor, txtAlign, txtSize }, gElCanvas.width / 2, gElCanvas.height / 2)
    }
}

function renderTxt() {
    const meme = getMeme()
    meme.lines.forEach((line, idx) => {
        const {txt, color, align, size} = meme.lines[idx]

        gCtx.strokeStyle = 'black'
        gCtx.fillStyle = color
        gCtx.font = `${size}px Impact`
        gCtx.textAlign = align
        gCtx.textBaseline = align
        
        if(idx === 0){
            gCtx.fillText(txt, gElCanvas.width / 2, 40)
            gCtx.strokeText(txt, gElCanvas.width / 2, 40)
        } else {
            gCtx.fillText(txt, gElCanvas.width / 2, gElCanvas.height - 20)
            gCtx.strokeText(txt, gElCanvas.width / 2, gElCanvas.height - 20)
        }
    })
}

function onChangeTxt(txt) {
    setLineTxt(txt)
    renderMeme()
}

function onSelectColor(color) {
    setColor(color)
    renderMeme()
}

function onChangeFontSize(diff) {
    setFontSize(diff)
    renderMeme()
}

function onChangeLine(){
    setCurrentLine()
    renderMeme()
    setInputValue()
}

function setInputValue(){
    const elInput = document.querySelector('.meme-text')
    const meme = getMeme()
    elInput.value = meme.lines[meme.selectedLineIdx].txt
}