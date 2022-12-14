'use strict'

function onGalleryInit(){
    renderGallery()
}

function renderGallery(){
    const images = getImgs()
    const strHTMLs = images.map(image => {
        return `<article onclick="onImgSelect(${image.id})" class="card">
                    <img src="${image.url}">
                </article>`
    })
    const elContainer = document.querySelector('.gallery-container')
    elContainer.innerHTML = strHTMLs.join('')
}

function onImgSelect(id){
    setImg(id)
    renderMeme()
    openEditor()
}

function openEditor(){
    document.body.classList.toggle('editor-open')
}

function onGallerySelect(){
    if(document.body.classList.contains('editor-open')) {
        document.body.classList.remove('editor-open')
    }
}