'use strict'

let gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

let gElCanvas
let gCtx

function onInit() {
    gElCanvas = document.querySelector('.canvas-container canvas')
    gCtx = gElCanvas.getContext('2d')
    renderMeme()
}

function renderMeme() {
    const meme = getMeme()
    const memeImg = getMemeImg()

    const txt = meme.lines[meme.selectedLineIdx].txt
    const txtColor = meme.lines[meme.selectedLineIdx].color
    const txtAlign = meme.lines[meme.selectedLineIdx].align
    const txtSize = meme.lines[meme.selectedLineIdx].size

    const elImg = new Image()
    elImg.src = memeImg

    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        renderTxt({txt, txtColor, txtAlign, txtSize}, gElCanvas.width / 2, gElCanvas.height / 2)
    }
}

function renderTxt({txt, txtColor, txtAlign, txtSize}, x, y) {
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = txtColor
    gCtx.font = `${txtSize}px Impact`
    gCtx.textAlign = txtAlign
    gCtx.textBaseline = txtAlign

    gCtx.fillText(txt, x, y)
    gCtx.strokeText(txt, x, y)
}