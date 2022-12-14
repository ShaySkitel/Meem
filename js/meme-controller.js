'use strict'

let gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }
let gImgs = [{ id: 1, url: '../images/1.jpg', keywords: ['funny', 'cat'] }];
let gElCanvas
let gCtx

let gMeme = {
    selectedImgId: 5,
    selectedLineIdx: 0,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 20,
            align: 'left',
            color: 'red'
        }
    ]
}

function onInit() {
    gElCanvas = document.querySelector('.canvas-container canvas')
    gCtx = gElCanvas.getContext('2d')
}

function renderMeme() {
    const elImg = new Image()
    elImg.src = gImgs[0].url

    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        renderTxt('Placeholder', gElCanvas.width / 2, gElCanvas.height / 2)
    }
}

function renderTxt(text, x, y) {
    gCtx.lineWidth = 2
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = 'white'
    gCtx.font = '40px Impact'
    gCtx.textAlign = 'center'
    gCtx.textBaseline = 'middle'

    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}