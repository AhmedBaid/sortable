const url ="https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json";

// variable global
let allHeroes = [];
let searchInput = "";
let value = 20;
let currentPage = 1;
let sortOrder = "asc"; 


// the function of displaying
const updateDisplay = () => {
    let filtered = allHeroes;
    if (searchInput !== "") {
        filtered = allHeroes.filter((hero) =>
            hero.name.toLowerCase().includes(searchInput)
        );
    }
    let count = value === "all results" ? filtered.length : parseInt(value);
    const totalPages = Math.ceil(filtered.length / count);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;
    const start = (currentPage - 1) * count
    const end = start + count
    const show = filtered.slice(start,end);
    
    parsedata(show);
    createPagination(filtered, count);
};

// the function of createpagination
const createPagination = (all, count) => {
    let pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";
    const totalPages = Math.ceil(all.length / count);
    for (let i = 1; i <= totalPages; i++) {
    let btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) {
        btn.classList.add("active")
        btn.setAttribute("disabled",true)
    }
    btn.addEventListener("click", () => {
        currentPage = i;
        updateDisplay();
    });
    pagination.appendChild(btn);
    }
};

// event for select
document.getElementById("select").addEventListener("change", (e) => {
    value = e.target.value;
    console.log(typeof value);
    
    updateDisplay();
});
// event for search
document.getElementById("search").addEventListener("input", (e) => {
    searchInput = e.target.value.toLowerCase();
    updateDisplay();
});


document.getElementById("name-header").addEventListener("click", () => {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";
    allHeroes.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });
    const arrow = document.getElementById("name-arrow");
    arrow.textContent = sortOrder === "asc" ? "↑" : "↓";
    currentPage = 1;
    updateDisplay();
});



// the function of parsedata
const parsedata = (heroes) => {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    heroes.forEach((hero) => {
    const tr = document.createElement("tr");

    tr.innerHTML =` 
        <td><img src="${hero.images.xs}" /></td>
        <td>${hero.name}</td>
        <td>${hero.biography.fullName}</td>
        <td>${hero.powerstats.combat}</td>
        <td>${hero.powerstats.durability}</td>
        <td>${hero.powerstats.intelligence}</td>
        <td>${hero.powerstats.power}</td>
        <td>${hero.powerstats.speed}</td>
        <td>${hero.powerstats.strength}</td>
        <td>${hero.appearance.race}</td>
        <td>${hero.appearance.gender}</td>
        <td>${hero.appearance.height[1]}</td>
        <td>${hero.appearance.weight[1]}</td>
        <td>${hero.biography.placeOfBirth}</td>
        <td>${hero.biography.alignment}</td>`
    ;

    tbody.appendChild(tr);
    });
};

fetch(url)
    .then((res) => res.json())
    .then((data) => {
    allHeroes = data;
    updateDisplay();
    });
