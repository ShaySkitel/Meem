'use strict'

function onGalleryInit() {
    renderKeywordFilters()
    renderGallery()
}

function renderKeywordFilters() {
    const keywordsMap = getKeywordsMap()
    const keyWords = Object.keys(keywordsMap)
    const strHTMLs = keyWords.map(keyword => {
        const keywordSize = keywordsMap[keyword] * 1.5 > 30 ? 30 : keywordsMap[keyword] * 1.5
        return `<li>
                    <a style="font-size: ${keywordSize}px;" onclick="onKeywordFilter('${keyword}')" href="#">${keyword}</a>
                </li>`
    })
    document.querySelector('.keywords-filter').innerHTML = strHTMLs.join('')
}

function renderGallery() {
    const images = getImgs()
    const strHTMLs = images.map(image => {
        return `<article onclick="onImgSelect(${image.id})" class="card">
                    <img src="${image.url}">
                </article>`
    })
    strHTMLs.unshift(`<article class="card import-file">Import Image<input type="file" class="file-input" name="image" onchange="onImgInput(event)"></article>`)
    const elContainer = document.querySelector('.gallery-container')
    elContainer.innerHTML = strHTMLs.join('')
}

function onKeywordFilter(keyword) {
    const keywordsMap = getKeywordsMap()
    setSearch(keyword)
    keywordsMap[keyword]++
    renderKeywordFilters()
    document.querySelector('.search-input').value = keyword
    renderGallery()
}

function onImgSelect(id) {
    resetMeme()
    setImg(id)
    renderCanvases()
    openEditor()
    window.scrollTo(0, 0)
}

function openEditor() {
    document.body.classList.toggle('editor-open')
    document.querySelector('.main-nav .gallery-btn').classList.toggle('active')
}

function onGallerySelect(elLink) {
    if (document.body.classList.contains('editor-open')) {
        document.body.classList.remove('editor-open')
        elLink.classList.toggle('active')
    }
}

function onSearch(query) {
    setSearch(query)
    renderGallery()
}

function onImgInput(ev) {
    loadImageFromInput(ev)
}

function loadImageFromInput(ev) {
    const reader = new FileReader()
    // After we read the file
    reader.onload = (event) => {
        let img = new Image() // Create a new html img element
        img.src = event.target.result // Set the img src to the img file we read
        // Run the callBack func, To render the img on the canvas
        img.onload = () => {
            const imgObj = addImg(img)
            setImg(imgObj.id)
            setCanvasSize()
            resetMeme(imgObj.id)
            renderCanvases()
            openEditor()
            renderGallery()
        }
    }

    reader.readAsDataURL(ev.target.files[0]) // Read the file we picked

}