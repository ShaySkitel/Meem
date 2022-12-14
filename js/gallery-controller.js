'use strict'

function onGalleryInit(){
    renderGallery()
}

function renderGallery(){
    const images = getImgs()
    const strHTMLs = images.map(image => {
        return `<article class="card">
                    <img src="${image.url}">
                </article>`
    })
    const elContainer = document.querySelector('.gallery-container')
    elContainer.innerHTML = strHTMLs.join('')
}