var searchInput = document.getElementById("searchInput");
var statusSelect = document.getElementById("statusSelect");
var genderSelect = document.getElementById("genderSelect");
var speciesSelect = document.getElementById("speciesSelect");
var resultsList = document.getElementById("resultsList");
var pagination = document.getElementById("pagination");
var btnBurger = document.getElementById("btnBurger");
var paginas = undefined;
var arrayFiltros = [];
var currentPage = 1;
var urlFiltro = '';

function cargaPersonajes(page,filter) {
    if(filter==='') {
        fetch(`https://rickandmortyapi.com/api/character/?page=${page}`)
          .then(response => response.json())
            .then(data => {
                paginas = data.info.pages;
                resultsList.innerHTML = ""; // Limpio resultados anteriores
                data.results.forEach(character => {
                    var characterItem = document.createElement("div");
                    characterItem.className = "character-item";
                    characterItem.innerHTML = `
                        <h3>${character.name}</h3>
                        <img class="character-image" src="${character.image}" alt="${character.name}">
                        <p>Status: ${character.status}</p>
                        <p>Species: ${character.species}</p>
                        <p>Gender: ${character.gender || "N/A"}</p>
                    `;
                    resultsList.appendChild(characterItem);
                });
                mostrarPaginacion(page, paginas, filter);
            })
            .catch(error => console.error('Error fetching characters:', error));
    }
    else if(filter) {
        fetch(`https://rickandmortyapi.com/api/character/?page=${page}&${filter}`)
          .then(response => response.json())
            .then(data => {
                paginas = data.info.pages;
                resultsList.innerHTML = ""; // Limpio resultados anteriores
                data.results.forEach(character => {
                    var characterItem = document.createElement("div");
                    characterItem.className = "character-item";
                    characterItem.innerHTML = `
                        <h3>${character.name}</h3>
                        <img class="character-image" src="${character.image}" alt="${character.name}">
                        <p>Status: ${character.status}</p>
                        <p>Species: ${character.species}</p>
                        <p>Gender: ${character.gender || "N/A"}</p>
                    `;
                    resultsList.appendChild(characterItem);
                });
                mostrarPaginacion(page, paginas, filter);
            })
            .catch(error => console.error('Error fetching characters:', error));
    }
    
}


// Función para renderizar la paginación
function mostrarPaginacion(current, total, urlFiltro) {
    pagination.innerHTML = "";
    var pagDiv = document.createElement("div");
    pagDiv.className = "pagination";

    let arrowBack = document.createElement("a");
    arrowBack.innerHTML = "&lt;";
    if (current > 1) {
        arrowBack.addEventListener("click", function() {
            currentPage--;
            cargaPersonajes(currentPage, urlFiltro);
        });
    } else {
        arrowBack.style.pointerEvents = "none";
        arrowBack.style.color = "#bbb";
    }
    pagDiv.appendChild(arrowBack);

    for (let i = current; i <= current + 2 && i <= total; i++) {
        let pageBtn = document.createElement("a");
        pageBtn.textContent = i;
        if (i === current) {
            pageBtn.className = "active";
        }
        pageBtn.addEventListener("click", function() {
            currentPage = i;
            cargaPersonajes(currentPage, urlFiltro);
        });
        pagDiv.appendChild(pageBtn);
    }

    let arrow = document.createElement("a");
    arrow.innerHTML = "&gt;";
    if (current < total) {
        arrow.addEventListener("click", function() {
            currentPage++;
            cargaPersonajes(currentPage, urlFiltro);
        });
    } else {
        arrow.style.pointerEvents = "none";
        arrow.style.color = "#bbb";
    }
    pagDiv.appendChild(arrow);

    pagination.appendChild(pagDiv);
}

btnBurger.addEventListener("click", function() {
    var nav = document.querySelector("ul");
    var li = document.querySelectorAll("li");
    nav.classList.toggle("menu-desplegado");
    li.forEach(function(item) {
        item.classList.toggle("active-li");
    });

});

searchInput.addEventListener("keyup", function() {
    var searchTerm = searchInput.value;
    var typeFilter = 'name';
    var propFilter = [searchTerm, typeFilter];
    sumarFiltros(propFilter);
});


genderSelect.addEventListener("change", function() {
    var selectedGender = genderSelect.value;
    var typeFilter = 'gender';
    var propFilter = [selectedGender, typeFilter];
    sumarFiltros(propFilter);
});

statusSelect.addEventListener("change", function() {
    var selectedStatus = statusSelect.value;
    var typeFilter = 'status';
    var propFilter = [selectedStatus, typeFilter];
    sumarFiltros(propFilter);
});

speciesSelect.addEventListener("change", function() {
    var selectedSpecies = speciesSelect.value;
    var typeFilter = 'species';
    var propFilter = [selectedSpecies, typeFilter];
    sumarFiltros(propFilter);
});

///?page=2&name=rick&status=alive"  -----   formato de url para guiarme/

function sumarFiltros(params) {
    var [filtro, typeFilter] = params;
    var bandera = true;
    urlFiltro = '';
    arrayFiltros.forEach(([prop, type], index) => {
        if(type == typeFilter) {
            arrayFiltros[index][0] = filtro; // Actualizar el filtro existente
            bandera = false;
        }
    });
    if(bandera) {
        arrayFiltros.push(params);
    }
    arrayFiltros.forEach(([prop, type]) => {
        urlFiltro +=`${type}=${prop}&`;
    });
    urlFiltro = urlFiltro.slice(0, -1); // Elimino el último '&' que se generó en la creacion del urlFiltro
    cantFiltros = arrayFiltros.length;
    cargaPersonajes(currentPage,urlFiltro);
}

document.addEventListener("DOMContentLoaded", function() {
    cargaPersonajes(currentPage,urlFiltro);
});

