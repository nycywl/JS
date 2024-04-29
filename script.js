// API URL
const apiURL = 'https://ddragon.leagueoflegends.com/cdn/10.22.1/data/zh_TW/champion.json';
// 圖片樣板網址
const imageURLTemplate = 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/';

// 定義變數
let champions = [];
let currentPage = 1;
const itemsPerPage = 10;
const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// 初始載入英雄資料
async function loadChampions() {
    const response = await fetch(apiURL);
    const data = await response.json();
    champions = Object.values(data.data);
    displayChampions();
}

// 顯示英雄列表
function displayChampions() {
    const championsList = document.getElementById('champions-list');
    championsList.innerHTML = '';

    const filteredChampions = filterAndSortChampions();
    const pagedChampions = paginate(filteredChampions);

    pagedChampions.forEach(champion => {
        const card = document.createElement('div');
        card.className = 'champion-card';
        card.innerHTML = `
            <img src="${imageURLTemplate}${champion.id}_0.jpg" alt="${champion.name}">
            <h3>${champion.name}</h3>
            <p>特性: ${champion.tags.join(', ')}</p>
        `;
        card.addEventListener('click', () => showChampionDetail(champion));
        championsList.appendChild(card);
    });

    displayPagination(filteredChampions.length);
}

// 分頁顯示
function paginate(filteredChampions) {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredChampions.slice(startIndex, endIndex);
}

// 顯示分頁器
function displayPagination(totalItems) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.innerText = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            displayChampions();
        });
        pagination.appendChild(pageBtn);
    }
}

// 搜索和篩選英雄
function filterAndSortChampions() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const filterInput = document.getElementById('filter').value;
    const sortInput = document.getElementById('sort').value;
    //過濾英雄列表
    let filteredChampions = champions.filter(champion => {
        // 檢查英雄名稱是否匹配搜索框中的值
        const nameMatch = champion.name.toLowerCase().includes(searchInput);
        // 檢查英雄的特性標籤是否包含選中的篩選條件
        const filterMatch = filterInput ? champion.tags.includes(filterInput) : true;
        // 返回同時滿足名稱匹配和篩選匹配的英雄
        return nameMatch && filterMatch;
    });
    // 排序英雄列表
    if (sortInput === 'name') {
        filteredChampions.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortInput === 'attack') {
        filteredChampions.sort((a, b) => b.stats.attack - a.stats.attack);
    }else if (sortInput === 'defense') {
        filteredChampions.sort((a, b) => b.stats.defense - a.stats.defense);
    } else if (sortInput === 'support') {
        filteredChampions.sort((a, b) => b.stats.support - a.stats.support);
    }
    return filteredChampions;
}

// 顯示英雄詳細資訊
function showChampionDetail(champion) {
    const detailSection = document.getElementById('champion-detail');
    const backBtn = document.getElementById('back-btn');
    const addToFavoritesBtn = document.getElementById('add-to-favorites');
    const championName = document.getElementById('champion-name');
    const championImage = document.getElementById('champion-image');
    const championRadar = document.getElementById('champion-radar');

    // 顯示英雄名稱和圖片
    championName.innerText = champion.name;
    championImage.src = `${imageURLTemplate}${champion.id}_0.jpg`;

    // 顯示英雄數值
    const data = {
        labels: ['攻擊', '防禦', '魔法', '難度'],
        datasets: [{
            label: '數值',
            data: [champion.stats.attack, champion.stats.defense, champion.stats.magic, champion.stats.difficulty],
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
            pointBorderColor: '#fff',
            pointRadius: 4
        }]
    };

    const options = {
        scales: {
            r: {
                beginAtZero: true
            }
        }
    };

    new Chart(championRadar, {
        type: 'radar',
        data: data,
        options: options
    });

    // 添加收藏功能
    if (favorites.includes(champion.id)) {
        addToFavoritesBtn.innerText = '已收藏';
        addToFavoritesBtn.disabled = true;
    } else {
        addToFavoritesBtn.innerText = '加入收藏';
        addToFavoritesBtn.disabled = false;
        addToFavoritesBtn.onclick = () => addToFavorites(champion);
    }

    detailSection.style.display = 'block';
    backBtn.onclick = () => {
        detailSection.style.display = 'none';
        championRadar.getContext('2d').clearRect(0, 0, championRadar.width, championRadar.height);
    };
}

// 加入收藏
function addToFavorites(champion) {
    if (!favorites.includes(champion.id)) {
        favorites.push(champion.id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
        alert(`${champion.name} 已加入收藏`);
    }
}

// 顯示收藏列表
function displayFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';

    favorites.forEach(id => {
        const champion = champions.find(c => c.id === id);
        const listItem = document.createElement('li');
        listItem.innerText = champion.name;
        favoritesList.appendChild(listItem);
    });
}

// 搜索和篩選功能的事件監聽
document.getElementById('search').addEventListener('input', displayChampions);
document.getElementById('filter').addEventListener('change', displayChampions);
document.getElementById('sort').addEventListener('change', displayChampions);

// 載入初始資料
loadChampions();
displayFavorites();