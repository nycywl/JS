const apiUrl = "https://ddragon.leagueoflegends.com/cdn/10.22.1/data/zh_TW/champion.json";
const imageBaseUrl = "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/";

// DOM 元素
const championListElement = document.getElementById("champion-list");
const searchBar = document.getElementById("search-bar");
const sortOptions = document.getElementById("sort-options");
const tagOptions = document.getElementById("tag-options");
const pagingBar = document.getElementById("paging-bar");
const favoriteListElement = document.getElementById("favorite-list");
const championTemplate = document.getElementById("champion-template").content;
const championDetailsElement = document.getElementById("champion-details");
const detailsNameElement = document.getElementById("details-name");
const detailsImageElement = document.getElementById("details-image");
const detailsDescriptionElement = document.getElementById("details-description");
const radarChartElement = document.getElementById("radar-chart");
const backButton = document.getElementById("back-button");
const pageTitle = document.getElementById("page-title");
const homeButton = document.getElementById("home-button");

let currentChampion = null;
let champions = [];
let currentPage = 1;
const itemsPerPage = 10;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// 載入 API 資料
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        champions = Object.values(data.data);
        displayChampions();
        displayFavorites();
    })
    .catch(error => console.error('Error fetching champion data:', error));

// 顯示所有英雄，根據搜索條件和篩選選項過濾
function displayChampions() {
    const searchTerm = searchBar.value.toLowerCase();
    const sortBy = sortOptions.value;
    const selectedTag = tagOptions.value;

    championListElement.innerHTML = "";
    championDetailsElement.style.display = "none";
    pageTitle.textContent = "英雄聯盟圖鑑";

    let filteredChampions = champions.filter(champion => {
        const matchesSearch = champion.name.toLowerCase().includes(searchTerm);
        const matchesTag = selectedTag === "all" || champion.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
    });

    filteredChampions.sort((a, b) => b.info[sortBy] - a.info[sortBy]);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredChampions.length);

    for (let i = startIndex; i < endIndex; i++) {
        const champion = filteredChampions[i];
        const championCard = createChampionCard(champion);
        championListElement.appendChild(championCard);
    }

    updatePagingBar(filteredChampions.length);
    homeButton.style.display = "inline";
}

// 創建角色卡片
function createChampionCard(champion) {
    const card = championTemplate.cloneNode(true);
    const nameElement = card.querySelector(".champion-name");
    const imageElement = card.querySelector(".champion-image");
    const favoriteButton = card.querySelector(".favorite-button");

    nameElement.textContent = champion.name;
    imageElement.src = `${imageBaseUrl}${champion.id}_0.jpg`;

    if (favorites.find(favorite => favorite.id === champion.id)) {
        favoriteButton.textContent = "取消收藏";
    } else {
        favoriteButton.textContent = "收藏";
    }

    favoriteButton.addEventListener("click", () => {
        toggleFavorite(champion);
        if (favorites.find(favorite => favorite.id === champion.id)) {
            favoriteButton.textContent = "取消收藏";
        } else {
            favoriteButton.textContent = "收藏";
        }
    });

    card.querySelector(".champion-card").addEventListener("click", () => {
        showChampionDetails(champion);
    });

    return card;
}

// 顯示角色詳細信息
function showChampionDetails(champion) {
    detailsNameElement.textContent = '';
    detailsImageElement.src = '';
    detailsDescriptionElement.textContent = '';
    const previousStatsElement = championDetailsElement.querySelector("#details-stats");
    if (previousStatsElement) {
        previousStatsElement.remove();
    }

    pageTitle.textContent = "英雄詳細資料";
    championListElement.innerHTML = "";
    pagingBar.innerHTML = "";
    championDetailsElement.style.display = "block";

    detailsNameElement.textContent = `英雄名稱 (Name): ${champion.name}`;
    detailsImageElement.src = `${imageBaseUrl}${champion.id}_0.jpg`;
    detailsDescriptionElement.textContent = `介紹 (Blurb): ${champion.blurb}`;

    const statsElement = document.createElement("ul");
    statsElement.id = "details-stats";
    statsElement.innerHTML = `
        <li><strong>屬性 (Stats):</strong> 攻擊力: ${champion.info.attack}, 防禦力: ${champion.info.defense}, 魔法: ${champion.info.magic}</li>
        <li><strong>難度 (Difficulty):</strong> ${champion.info.difficulty}</li>
        <li><strong>類型 (Tags):</strong> ${champion.tags.join(", ")}</li>
    `;
    championDetailsElement.appendChild(statsElement);

    // 更新雷達圖
    if (radarChartElement.chart) {
        radarChartElement.chart.data.datasets[0].data = [
            champion.info.attack,
            champion.info.defense,
            champion.info.magic,
            champion.info.difficulty
        ];
        radarChartElement.chart.update();
    } else {
        const data = {
            labels: ["攻擊", "防禦", "魔法", "困難"],
            datasets: [{
                data: [
                    champion.info.attack,
                    champion.info.defense,
                    champion.info.magic,
                    champion.info.difficulty
                ],
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)"
            }]
        };

        const config = {
            type: "radar",
            data: data,
            options: {
                scales: {
                    r: {
                        suggestedMin: 0,
                        suggestedMax: 10
                    }
                }
            }
        };

        radarChartElement.chart = new Chart(radarChartElement, config);
    }

    backButton.onclick = () => {
        displayChampions();
        displayFavorites();
        homeButton.style.display = "inline";
    };

    displayFavorites();
    homeButton.style.display = "none";
}

// 分頁器
function updatePagingBar(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    pagingBar.innerHTML = "";

    let startPage = currentPage - halfVisiblePages;
    let endPage = currentPage + halfVisiblePages;

    if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(maxVisiblePages, totalPages);
    } else if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        const firstPageButton = document.createElement("button");
        firstPageButton.textContent = "1";
        firstPageButton.addEventListener("click", () => {
            currentPage = 1;
            displayChampions(); // 顯示第一頁
        });
        pagingBar.appendChild(firstPageButton);

        const startEllipsis = document.createElement("span");
        startEllipsis.textContent = "...";
        pagingBar.appendChild(startEllipsis);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;

        if (i === currentPage) {
            pageButton.disabled = true;
        }

        pageButton.addEventListener("click", () => {
            currentPage = i;
            displayChampions(); // 顯示選定頁碼的英雄列表
        });

        pagingBar.appendChild(pageButton);
    }

    if (endPage < totalPages) {
        const endEllipsis = document.createElement("span");
        endEllipsis.textContent = "...";
        pagingBar.appendChild(endEllipsis);

        const lastPageButton = document.createElement("button");
        lastPageButton.textContent = totalPages;
        lastPageButton.addEventListener("click", () => {
            currentPage = totalPages;
            displayChampions();
        });
        pagingBar.appendChild(lastPageButton);
    }
}

// 收藏角色
function toggleFavorite(champion) {
    const index = favorites.findIndex(favorite => favorite.id === champion.id);
    if (index === -1) {
        favorites.push(champion);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
}

// 顯示收藏的角色清單
function displayFavorites() {
    favoriteListElement.innerHTML = "";
    favorites.forEach(champion => {
        const championCard = createChampionCard(champion);
        const favoriteButton = championCard.querySelector(".favorite-button");
        favoriteButton.classList.add("favorite");
        favoriteListElement.appendChild(championCard);
    });
}

// 搜尋欄位事件監聽器
searchBar.addEventListener("input", () => {
    currentPage = 1;
    displayChampions();
});

// 排序選項事件監聽器
sortOptions.addEventListener("change", () => {
    currentPage = 1;
    displayChampions();
});

// 類型篩選選項事件監聽器
tagOptions.addEventListener("change", () => {
    currentPage = 1;
    displayChampions();
});

// 首頁按鈕事件監聽器
homeButton.addEventListener("click", () => {
    currentPage = 1;
    searchBar.value = "";
    sortOptions.selectedIndex = 0;
    tagOptions.selectedIndex = 0;
    displayChampions();
    displayFavorites();
    homeButton.style.display = "none";
});

// 初始化
displayChampions();
displayFavorites();
