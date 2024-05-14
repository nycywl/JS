const apiUrl = "https://ddragon.leagueoflegends.com/cdn/10.22.1/data/zh_TW/champion.json";
const imageBaseUrl = "https://ddragon.leagueoflegends.com/cdn/img/champion/loading/";

let champions = [];
let currentPage = 1;
const itemsPerPage = 10;

// DOM 元素
const championListElement = document.getElementById("champion-list");
const searchBar = document.getElementById("search-bar");
const sortOptions = document.getElementById("sort-options");
const filterOptions = document.getElementById("filter-options");
const pagingBar = document.getElementById("paging-bar");
const favoriteListElement = document.getElementById("favorite-list");
const championTemplate = document.getElementById("champion-template").content;
const championDetailsElement = document.getElementById("champion-details");
const detailsNameElement = document.getElementById("details-name");
const detailsImageElement = document.getElementById("details-image");
const radarChartElement = document.getElementById("radar-chart");
const backButton = document.getElementById("back-button");

// 收藏的角色
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// 載入 API 資料
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        champions = Object.values(data.data);
        displayChampions();
        displayFavorites();
    });

// 顯示所有英雄
function displayChampions() {
    championListElement.innerHTML = "";
    const filteredChampions = filterChampions(champions);
    const sortedChampions = sortChampions(filteredChampions);
    const pagedChampions = paginateChampions(sortedChampions);

    pagedChampions.forEach(champion => {
        const championCard = createChampionCard(champion);
        championListElement.appendChild(championCard);
    });

    updatePagingBar(sortedChampions.length);
}

// 根據分頁顯示角色
function paginateChampions(champions) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return champions.slice(startIndex, startIndex + itemsPerPage);
}

// 創建角色卡片
function createChampionCard(champion) {
    const card = championTemplate.cloneNode(true);
    const nameElement = card.querySelector(".champion-name");
    const imageElement = card.querySelector(".champion-image");
    const favoriteButton = card.querySelector(".favorite-button");

    nameElement.textContent = champion.name;
    imageElement.src = `${imageBaseUrl}${champion.id}_0.jpg`;

    // 檢查是否已收藏該英雄
    if (favorites.find(favorite => favorite.id === champion.id)) {
        favoriteButton.textContent = "取消收藏";
    } else {
        favoriteButton.textContent = "收藏";
    }

    // 點擊收藏按鈕時的事件處理函數
    favoriteButton.addEventListener("click", () => {
        toggleFavorite(champion);
        // 更新按鈕文字
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
    championDetailsElement.style.display = "block";
    detailsNameElement.textContent = champion.name;
    detailsImageElement.src = `${imageBaseUrl}${champion.id}_0.jpg`;

    // 繪製雷達圖
    const stats = champion.stats;
    const data = {
        labels: ["生命值", "法力", "攻擊", "防禦", "攻速", "移動速度"],
        datasets: [{
            data: [
                stats.hp,
                stats.mp,
                stats.attackdamage,
                stats.armor,
                stats.attackspeed,
                stats.movespeed
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
                    suggestedMax: Math.max(...data.datasets[0].data) + 100
                }
            }
        }
    };

    new Chart(radarChartElement, config);

    backButton.addEventListener("click", () => {
        championDetailsElement.style.display = "none";
        // 返回首頁
        currentPage = 1;
        displayChampions();
    });
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
            displayChampions();
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
            displayChampions();
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

// 角色篩選
function filterChampions(champions) {
    const filterOption = filterOptions.value;
    return champions.filter(champion => {
        if (!filterOption) {
            return true;
        }
        return champion.tags.includes(filterOption);
    });
}

// 角色排序
function sortChampions(champions) {
    const sortOption = sortOptions.value;
    return champions.slice().sort((a, b) => {
        if (!sortOption) {
            return 0;
        }
        if (a[sortOption] < b[sortOption]) {
            return -1;
        } else if (a[sortOption] > b[sortOption]) {
            return 1;
        }
        return 0;
    });
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

// 顯示收藏的角色
function displayFavorites() {
    favoriteListElement.innerHTML = "";
    favorites.forEach(champion => {
        const card = createChampionCard(champion);
        favoriteListElement.appendChild(card);
    });
}

// 監聽篩選和排序選擇
sortOptions.addEventListener("change", displayChampions);
filterOptions.addEventListener("change", displayChampions);
searchBar.addEventListener("input", displayChampions);
