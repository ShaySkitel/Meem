'use strict'

let gKeywordSearchCountMap = { 'funny': 12, 'cat': 16, 'baby': 2 }

let gElCanvas
let gCtx

let gElDownloadCanvas
let gDownloadCtx

function onEditorInit() {
    gElCanvas = document.querySelector('.canvas-container canvas')
    gCtx = gElCanvas.getContext('2d')
    gElDownloadCanvas = document.querySelector('.downloading-canvas')
    gDownloadCtx = gElDownloadCanvas.getContext('2d')
    setInputValue()
    setCanvasSize()
    renderCanvases()
    window.onresize = () => {
        setCanvasSize()
        renderCanvases()
    }
}

function setCanvasSize() {
    if (window.innerWidth > 518) {
        gElCanvas.width = 500
        gElCanvas.height = 500
        gElDownloadCanvas.height = 500
        gElDownloadCanvas.width = 500
    }
    if (window.innerWidth > 1220) {
        gElCanvas.width = 600
        gElCanvas.height = 600
        gElDownloadCanvas.height = 600
        gElDownloadCanvas.width = 600
    }
    gElCanvas.width = document.querySelector('.canvas-container').offsetWidth
    gElDownloadCanvas.width = document.querySelector('.canvas-container').offsetWidth
    gElCanvas.height = gElCanvas.width
    gElDownloadCanvas.height = gElDownloadCanvas.width
}

function renderCanvases(){
    renderMeme()
    renderMeme(gDownloadCtx, false)
}

function renderMeme(ctx = gCtx, withSelection = true) {
    const memeImgPath = getMemeImg()

    const elImg = new Image()
    elImg.src = memeImgPath

    elImg.onload = () => {
        ctx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
        renderTxt(ctx)
        if(withSelection) renderSelection(getSelectedLine())
        // renderTxt({ txt, txtColor, txtAlign, txtSize }, gElCanvas.width / 2, gElCanvas.height / 2)
    }
}

function renderTxt(ctx) {
    const meme = getMeme()
    meme.lines.forEach((line, idx) => {
        const { txt, color, align, size, font, outlineColor } = meme.lines[idx]

        ctx.lineWidth = size * 0.03
        ctx.strokeStyle = outlineColor
        ctx.fillStyle = color
        ctx.font = `${size}px ${font}`
        ctx.textAlign = align
        ctx.textBaseline = 'top'

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

        ctx.fillText(txt, line.position.x, line.position.y)
        ctx.strokeText(txt, line.position.x, line.position.y)

    })
}

function onChangeTxt(txt) {
    setLineTxt(txt)
    renderCanvases()
}

function onSelectColor(color) {
    setColor(color)
    renderCanvases()
}

function onChangeFontSize(diff) {
    const line = getSelectedLine()
    setFontSize(diff)
    line.selectionPos = {xStart: 0, yStart: line.position.y, xEnd: gElCanvas.width, yEnd: line.size}
    renderCanvases()
}

function onChangeLine() {
    setCurrentLine()
    renderCanvases()
    setInputValue()
}

function setInputValue() {
    if (!gMeme.lines || !gMeme.lines.length) return
    const elInput = document.querySelector('.meme-text')
    const meme = getMeme()
    elInput.value = meme.lines[meme.selectedLineIdx].txt
}

function downloadImage(elLink) {
    const imgData = gElDownloadCanvas.toDataURL('image/png')
    elLink.href = imgData
}

function onSetAlignment(alignment) {
    setLineAlignment(alignment)
    renderCanvases()
}

function onSetFont(font) {
    setLineFont(font)
    renderCanvases()
}

function onSelectOutlineColor(color) {
    setOutlineColor(color)
    renderCanvases()
}

function onDeleteLine() {
    deleteLine()
    setInputValue()
    renderCanvases()
}

function onAddLine() {
    addLine()
    renderCanvases()
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
        renderCanvases()
        setInputValue()
    }
    // console.log(line)
}

function renderSelection(line){
    const {xStart, yStart, xEnd, yEnd} = line.selectionPos
    gCtx.strokeStyle = '#FFFFFF'
    gCtx.strokeRect(xStart, yStart, xEnd, yEnd)
    gCtx.fillStyle = '#00000033'
    gCtx.fillRect(xStart, yStart, xEnd, yEnd)
}