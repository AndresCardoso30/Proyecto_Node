const CONTAINER = document.getElementById("container");
const ADD_BLOG = document.getElementById("agregar");
const PAGES_URL = "http://localhost:3000/pages";
const UPLOAD_URL = "http://localhost:3000/upload";  

function showInfo(data) {
    let htmlContentToAppend = "";
    for (let page of data) {
        htmlContentToAppend += `
            <div class="card mb-3" data-id="${page.id}">
                <div class="row no-gutters" onclick="redirectToPage(${page.id})">
                    <div class="col-md-4">
                        <img class="card-img-top" src="${page.image}" alt="Card image cap">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <p class="card-text">${page.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    CONTAINER.innerHTML = htmlContentToAppend;
}

function redirectToPage(pageId) {
    window.location.href = `pages.html?id=${pageId}`;
}



function getNextPageId() {
    const CONTAINER = document.getElementById('container');
    const pages = CONTAINER.querySelectorAll('.card');

    
    if (pages.length === 0) {
        return 1;
    }

    const maxId = Array.from(pages).reduce((max, page) => {
        const id = parseInt(page.getAttribute('data-id'), 10);
        return id > max ? id : max;
    }, 0);

    return maxId + 1;
}

function saveBlog() {
    const imageInput = document.getElementById("imageInput");
    const descriptionInput = document.getElementById("descriptionInput");
    const contentInput = document.getElementById("contentInput");

    const formData = new FormData();
    formData.append("image", imageInput.files[0]);
    formData.append("description", descriptionInput.value);
    formData.append("content", contentInput.value);

    
    fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data.message);

            // Después de cargar la imagen, se guarda la información del blog
            const imageName = data.image;
            const newPage = {
                id: getNextPageId(),
                image: `/img/${imageName}`, 
                description: descriptionInput.value,
                content: contentInput.value,
            };

            
            fetch(PAGES_URL, {
                method: "POST",
                body: JSON.stringify(newPage),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log("Blog saved:", data);
                    fetchData(showInfo, PAGES_URL);
                    $('#exampleModal').modal('hide'); 
                })
                .catch((error) => console.error("Error saving blog:", error));
        })
        .catch((error) => {
            console.error("Error al cargar la imagen:", error);
        });
}



ADD_BLOG.addEventListener("click", saveBlog);


window.addEventListener("load", () => {
    fetch("http://localhost:3000/index.html", {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (!response.ok) {
        
        window.location.href = "login.html";
      }
    })
    .catch((error) => console.error("Error de autenticación:", error));

    fetchData(showInfo, PAGES_URL);
});

document.addEventListener("DOMContentLoaded", function () {
  
    const LOGOUT_BUTTON = document.querySelector("nav button");
    LOGOUT_BUTTON.addEventListener("click", function () {

      localStorage.removeItem("token");
    
      window.location.href = "login.html";
    });
  
    
  });
  