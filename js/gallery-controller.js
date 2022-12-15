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
    resetMeme()
    setImg(id)
    renderCanvases()
    openEditor()
    window.scrollTo(0, 0)
}

function openEditor(){
    document.body.classList.toggle('editor-open')
    document.querySelector('.main-nav .gallery-btn').classList.toggle('active')
}

function onGallerySelect(elLink){
    if(document.body.classList.contains('editor-open')) {
        document.body.classList.remove('editor-open')
        elLink.classList.toggle('active')
    }
}

function onSearch(query){
    setSearch(query)
    renderGallery()
}