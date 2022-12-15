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
}

function setCanvasSize() {
    if (window.innerWidth > 518) {
        gElCanvas.width = 500
        gElCanvas.height = 500
    }
    if (window.innerWidth > 1220) {
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
        renderSelection(getSelectedLine())
        // renderTxt({ txt, txtColor, txtAlign, txtSize }, gElCanvas.width / 2, gElCanvas.height / 2)
    }
}

function renderTxt() {
    const meme = getMeme()
    meme.lines.forEach((line, idx) => {
        const { txt, color, align, size, font, outlineColor } = meme.lines[idx]

        gCtx.lineWidth = size * 0.03
        gCtx.strokeStyle = outlineColor
        gCtx.fillStyle = color
        gCtx.font = `${size}px ${font}`
        gCtx.textAlign = align
        gCtx.textBaseline = 'top'

        if (!line.position) {
            switch (idx) {
                case 0:
                    line.position = { x: gElCanvas.width / 2, y: 20 }
                    line.selectionPos = {xStart: 0, yStart: line.position.y, xEnd: gElCanvas.width, yEnd: line.size}
                    break
                case 1:
                    line.position = { x: gElCanvas.width / 2, y: gElCanvas.height - 40 }
                    line.selectionPos = {xStart: 0, yStart: line.position.y, xEnd: gElCanvas.width, yEnd: line.size}
                    break
                default:
                    line.position = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
                    line.selectionPos = {xStart: 0, yStart: line.position.y, xEnd: gElCanvas.width, yEnd: line.size}
                    break
            }
        }

        gCtx.fillText(txt, line.position.x, line.position.y)
        gCtx.strokeText(txt, line.position.x, line.position.y)

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
    const line = getSelectedLine()
    setFontSize(diff)
    line.selectionPos = {xStart: 0, yStart: line.position.y, xEnd: gElCanvas.width, yEnd: line.size}
    renderMeme()
}

function onChangeLine() {
    setCurrentLine()
    renderMeme()
    setInputValue()
}

function setInputValue() {
    if (!gMeme.lines || !gMeme.lines.length) return
    const elInput = document.querySelector('.meme-text')
    const meme = getMeme()
    elInput.value = meme.lines[meme.selectedLineIdx].txt
}

function downloadImage(elLink) {
    const imgData = gElCanvas.toDataURL('image/png')
    elLink.href = imgData
}

function onSetAlignment(alignment) {
    setLineAlignment(alignment)
    renderMeme()
}

function onSetFont(font) {
    setLineFont(font)
    renderMeme()
}

function onSelectOutlineColor(color) {
    setOutlineColor(color)
    renderMeme()
}

function onDeleteLine() {
    deleteLine()
    setInputValue()
    renderMeme()
}

function onAddLine() {
    addLine()
    renderMeme()
}

function onCanvasClicked(ev) {
    const { offsetX, offsetY } = ev
    const line = gMeme.lines.find(line => {
        return (
            offsetY >= line.position.y && offsetY <= line.position.y + line.size
        )
    })
    
    if (line) {
        selectLine(line)
        renderMeme()
        setInputValue()
    }
    // console.log(line)
}

function renderSelection(line){
    const {xStart, yStart, xEnd, yEnd} = line.selectionPos
    gCtx.strokeStyle = '#000000'
    gCtx.strokeRect(xStart, yStart, xEnd, yEnd)
    gCtx.fillStyle = '#00000033'
    gCtx.fillRect(xStart, yStart, xEnd, yEnd)
}