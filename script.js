const url =
  "https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json";

let allHeroes = [];
let currentPage = 1;
let currentNumber = 20;
let searchInput = "";
let currentSortColumn = "name";
let currentSortOrder = "asc";

// get the value of the column to sort
const getvalue = (hero, column) => {
  switch (column) {
    case "name": {
      const name = hero.name;
      return !name || name === "-" ? null : name;
    }

    case "full": {
      const full = hero.biography.fullName;
      return !full || full === "-" ? null : full;
    }

    case "race": {
      const race = hero.appearance.race;
      return !race || race === "-" ? null : race;
    }

    case "gender": {
      const gender = hero.appearance.gender;
      return !gender || gender === "-" ? null : gender;
    }

    case "height": {
      const height = hero.appearance.height?.[1];
      if (!height || height === "-" || height === "0") return null;
      if (height.includes("cm")) return parseFloat(height);
      if (height.includes("m")) return parseFloat(height) * 100;
      return null;
    }

    case "weight": {
      const weight = hero.appearance.weight?.[1];
      if (!weight || weight === "-" || weight === "0") return null;
      if (weight.includes("kg")) return parseFloat(weight);
      if (weight.toLowerCase().includes("ton"))
        return parseFloat(weight) * 1000;
      return null;
    }

    case "birth": {
      const placeOfBirth = hero.biography.placeOfBirth;
      return !placeOfBirth || placeOfBirth === "-" ? null : placeOfBirth;
    }

    case "alignment": {
      const alignment = hero.biography.alignment;
      return !alignment || alignment === "-" ? null : alignment;
    }

    case "combat":
    case "durability":
    case "intelligence":
    case "power":
    case "speed":
    case "strength": {
      const stat = hero.powerstats[column];
      return stat == null || stat === "-" || stat === "null"
        ? null
        : parseInt(stat);
    }

    default:
      return null;
  }
};

// function of parser (show the data)
const parsedata = (heroes) => {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  heroes.forEach((hero) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><img src="${hero.images.xs}" alt="${hero.name}"/></td>
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
      <td>${hero.biography.alignment}</td>
    `;

    tbody.appendChild(tr);
  });
};

// function of paginate
const createPagination = (all, count) => {
  let pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(all.length / count);
  for (let i = 1; i <= totalPages; i++) {
    let btn = document.createElement("button");
    btn.textContent = i;

    if (i === currentPage) {
      btn.setAttribute("disabled", true);
    }

    btn.addEventListener("click", () => {
      currentPage = i;
      updateDisplay();
    });

    pagination.appendChild(btn);
  }
};

// function of display (update)
const updateDisplay = () => {
  let filtered = allHeroes;
  // search
  if (searchInput !== "") {
    filtered = allHeroes.filter((hero) =>
      hero.name.toLowerCase().includes(searchInput)
    );
  }

  
  const count =
  currentNumber === "all result" ? filtered.length : parseInt(currentNumber);
  const totalPages = Math.ceil(filtered.length / count);
  if (currentPage > totalPages) currentPage = totalPages; 
  if (currentPage < 1) currentPage = 1;
  
  const start = (currentPage - 1) * count;
  const end = start + count;
  const toShow = filtered.slice(start, end);
  
  //  Sort
  if (currentSortColumn) {
    toShow.sort((a, b) => {
      const valA = getvalue(a, currentSortColumn);
      const valB = getvalue(b, currentSortColumn);

      if (valA == null || valA === "") return 1;
      if (valB == null || valB === "") return -1;

      const isNumeric = typeof valA === "number" && typeof valB === "number";

      if (isNumeric) {
        return currentSortOrder === "asc" ? valA - valB : valB - valA;
      }

      return currentSortOrder === "asc"
        ? valA.toString().localeCompare(valB)
        : valB.toString().localeCompare(valA);
    });
  }
  parsedata(toShow);
  createPagination(filtered, count);
};

//  Search event
document.getElementById("site-search").addEventListener("input", (e) => {
  searchInput = e.target.value.toLowerCase();
  currentPage = 1;
  updateDisplay();
});

//  Select event
document.getElementById("select").addEventListener("change", (e) => {
  currentNumber = e.target.value;
  currentPage = 1;
  updateDisplay();
});

//  sort event
document.querySelectorAll("th[id]").forEach((th) => {
  th.addEventListener("click", () => {
    const column = th.id;

    if (currentSortColumn === column) {
      currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
    } else {
      currentSortColumn = column;
      currentSortOrder = "asc";
    }

    updateDisplay();
  });
});

// function of fetch data
fetch(url)
  .then((res) => res.json())
  .then((data) => {
    allHeroes = data;
    updateDisplay();
  });
