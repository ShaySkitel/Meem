'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

let gElCanvas
let gCtx

let gElDownloadCanvas
let gDownloadCtx
let gDraggingLine

function onEditorInit() {
    resetMeme()
    gElCanvas = document.querySelector('.canvas-container canvas')
    gCtx = gElCanvas.getContext('2d')
    gElDownloadCanvas = document.querySelector('.downloading-canvas')
    gDownloadCtx = gElDownloadCanvas.getContext('2d')
    // setInputValue()
    setCanvasSize()
    renderCanvases()
    addEventListeners()
}

function addEventListeners() {
    window.onresize = () => {
        setCanvasSize()
        renderCanvases()
    }

    gElCanvas.addEventListener('mousedown', onDown)
    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('mouseup', onUp)

    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('touchmove', onMove)
    gElCanvas.addEventListener('touchend', onUp)

    gElCanvas.addEventListener('click', onCanvasClicked)
}

function onDown(ev) {
    const { offsetX, offsetY } = getEvPos(ev)
    const line = findSelectedLine(offsetX, offsetY)
    if (line) {
        line.isDragging = true
        gDraggingLine = line
    }
}

function onMove(ev) {
    if (!gDraggingLine) return
    const { offsetX, offsetY } = getEvPos(ev)
    if (gDraggingLine.isDragging) {
        gDraggingLine.position.x = offsetX
        gDraggingLine.position.y = offsetY - (gDraggingLine.size / 2)
        gDraggingLine.selectionPos = { xStart: 0, yStart: gDraggingLine.position.y, xEnd: gElCanvas.width, yEnd: gDraggingLine.size }
        renderCanvases()
        // { x: gElCanvas.width / 2, y: 20 }
    }
}

function onUp() {
    if (!gDraggingLine) return
    gDraggingLine.isDragging = false
    gDraggingLine = null
}

function setCanvasSize() {
    const imgUrl = getMemeImg()
    const img = new Image()
    img.src = imgUrl

    if (window.innerWidth > 518) {
        gElCanvas.width = 500
        gElCanvas.height = img.height * 500 / img.width
        gElDownloadCanvas.height = img.height * 500 / img.width
        gElDownloadCanvas.width = 500
    }
    if (window.innerWidth > 1220) {
        gElCanvas.width = 600
        gElCanvas.height = img.height * 600 / img.width
        gElDownloadCanvas.height = img.height * 600 / img.width
        gElDownloadCanvas.width = 600
    }
    
    gElCanvas.width = document.querySelector('.canvas-container').offsetWidth
    gElDownloadCanvas.width = document.querySelector('.canvas-container').offsetWidth
    gElCanvas.height = img.height * gElCanvas.width / img.width
    gElDownloadCanvas.height = img.height * gElDownloadCanvas.width / img.width
}

function renderCanvases() {
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
        if (withSelection) renderSelection(getSelectedLine())
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
                    line.position = { x: gElCanvas.width / 2, y: 10 }
                    line.selectionPos = { xStart: 0, yStart: line.position.y, xEnd: gElCanvas.width, yEnd: line.size }
                    break
                case 1:
                    line.position = { x: gElCanvas.width / 2, y: gElCanvas.height - 50 }
                    line.selectionPos = { xStart: 0, yStart: line.position.y, xEnd: gElCanvas.width, yEnd: line.size }
                    break
                default:
                    line.position = { x: gElCanvas.width / 2, y: gElCanvas.height / 2 }
                    line.selectionPos = { xStart: 0, yStart: line.position.y, xEnd: gElCanvas.width, yEnd: line.size }
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
    line.selectionPos = { xStart: 0, yStart: line.position.y, xEnd: gElCanvas.width, yEnd: line.size }
    renderCanvases()
}

function onChangeLine() {
    setCurrentLine()
    renderCanvases()
    
    setInputValue()
}

function setInputValue() {
    if (!gMeme.lines || !gMeme.lines.length) return
    const line = getSelectedLine()
    const elInput = document.querySelector('.meme-text')
    if(line.txt === 'Placeholder') {
        elInput.value = ''
        focusTxtInput()
        return
    }
    const meme = getMeme()
    elInput.value = meme.lines[meme.selectedLineIdx].txt
    focusTxtInput()
}

function focusTxtInput(){
    document.querySelector('.meme-text').focus()
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

    const line = findSelectedLine(offsetX, offsetY)

    if (line) {
        selectLine(line)
        renderCanvases()
        setInputValue()
    } else {
        renderMeme(gCtx, false)
    }
    // console.log(line)
}

function findSelectedLine(offsetX, offsetY) {
    const memeLines = getMemeLines()
    return memeLines.find(line => {
        return (
            offsetY >= line.position.y && offsetY <= line.position.y + line.size
        )
    })
}

function renderSelection(line) {
    if(!line) return
    const { xStart, yStart, xEnd, yEnd } = line.selectionPos
    gCtx.strokeStyle = '#FFFFFF'
    gCtx.strokeRect(xStart, yStart, xEnd, yEnd)
    gCtx.fillStyle = '#00000033'
    gCtx.fillRect(xStart, yStart, xEnd, yEnd)
}

function getEvPos(ev) {
    // Gets the offset pos , the default pos
    let pos = {
        offsetX: ev.offsetX,
        offsetY: ev.offsetY,
    }
    // Check if its a touch ev
    if (TOUCH_EVS.includes(ev.type)) {
        //soo we will not trigger the mouse ev
        ev.preventDefault()
        //Gets the first touch point
        ev = ev.changedTouches[0]
        //Calc the right pos according to the touch screen
        let rect = gElCanvas.getBoundingClientRect()
        pos = {
            offsetX: ev.clientX - rect.left,
            offsetY: ev.clientY - rect.top
        }
        onCanvasClicked(pos)
    }
    return pos
}

function onAddSticker(sticker){
    addLine(sticker, 80)
    renderCanvases()
}

function onShare(){
    const imgDataUrl = gElDownloadCanvas.toDataURL('image/jpeg') // Gets the canvas content as an image format

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        // Encode the instance of certain characters in the url
        const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`)
    }
    // Send the image to the server
    shareImg(imgDataUrl, onSuccess)
}