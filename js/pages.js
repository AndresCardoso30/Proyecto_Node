const PAGE_URL = "http://localhost:3000/pages/";

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

const INFO_CONTAINER = document.getElementById("pagesContainer");

function showBlog(page) {
    let htmlContentToAppend = "";
    htmlContentToAppend += `
        <img class="card-img-top" src="${page.image}" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${page.description}</h5>
            <p class="card-text">${page.content}</p>
        </div>
    `;

    INFO_CONTAINER.innerHTML = htmlContentToAppend;
}


const pageId = getParameterByName("id");

window.addEventListener('load', function(){
    fetch(`${PAGE_URL}${pageId}`)
    .then((response) => response.json())
    .then((data) => {
        showBlog(data);
    })
    .catch((error) => console.error("Error al obtener detalles del blog:", error));
})




