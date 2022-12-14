'use strict'

let gImgs = [{ id: 1, url: 'images/1.jpg', keywords: ['funny', 'cat'] }];

let gMeme = {
    selectedImgId: 1,
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

function getMeme(){
    return gMeme
}

function getMemeImg(){
    return gImgs.find(img => img.id === gMeme.selectedImgId).url
}

function setLineTxt(txt){
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}