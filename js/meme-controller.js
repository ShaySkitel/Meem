'use strict'

let gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

let gElCanvas
let gCtx

function onEditorInit() {
    gElCanvas = document.querySelector('.canvas-container canvas')
    gCtx = gElCanvas.getContext('2d')
    setInputValue()
    setCanvasSize()
    renderMeme()
    window.onresize = () => {
        setCanvasSize()
        renderMeme()
    }

    gElCanvas.onmouseup = () => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
    
        // Calculate the bounding rectangle of the selected text
        const rect = range.getBoundingClientRect();
    
        // Draw a rectangle around the selected text
        gCtx.strokeStyle = "red";
        gCtx.strokeRect(rect.left, rect.top, rect.width, rect.height);
    }
}

function setCanvasSize(){
    if(window.innerWidth > 518) {
        gElCanvas.width = 500
        gElCanvas.height = 500
    } 
     if(window.innerWidth > 1220) {
        gElCanvas.width = 700
        gElCanvas.height = 700
    }
    gElCanvas.width = document.querySelector('.canvas-container').offsetWidth
    gElCanvas.height = gElCanvas.width
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
        const {txt, color, align, size, font} = meme.lines[idx]

        gCtx.lineWidth = size * 0.03
        gCtx.strokeStyle = 'black'
        gCtx.fillStyle = color
        gCtx.font = `${size}px ${font}`
        gCtx.textAlign = align
        
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

function downloadImage(elLink){
    const imgData = gElCanvas.toDataURL('image/png')
    elLink.href = imgData
}

function onSetAlignment(alignment){
    setLineAlignment(alignment)
    renderMeme()
}

function onSetFont(font){
    setLineFont(font)
    renderMeme()
}