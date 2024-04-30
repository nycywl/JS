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
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        const championsData = Object.values(data.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
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
    } else if (sortInput === 'health') { //生命排序
        filteredChampions.sort((a, b) => b.stats.hp - a.stats.hp);
    } else if (sortInput === 'mana') { //魔力排序
        filteredChampions.sort((a, b) => b.stats.mp - a.stats.mp);
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
    try {
        // 從 localStorage 中取得收藏列表
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        // 檢查角色是否已經存在於收藏列表中
        if (!favorites.includes(champion.id)) {
            // 如果不存在，則將角色添加到收藏列表中
            favorites.push(champion.id);
            // 將更新後的收藏列表存儲到 localStorage 中
            localStorage.setItem('favorites', JSON.stringify(favorites));
            // 更新收藏列表的顯示
            displayFavorites();
            alert(`${champion.name} 已加入收藏`);
        } else {
            alert(`${champion.name} 已在收藏列表中`);
        }
    } catch (error) {
        console.error('Error adding to favorites:', error);
    }
}

// 刪除收藏
function removeFromFavorites(championId) {
    try {
        // 從 localStorage 中取得收藏列表
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        // 找到要刪除的角色在收藏列表中的索引
        const index = favorites.indexOf(championId);
        if (index !== -1) {
            // 如果找到了，則從收藏列表中刪除該角色
            favorites.splice(index, 1);
            // 將更新後的收藏列表存儲到 localStorage 中
            localStorage.setItem('favorites', JSON.stringify(favorites));
            // 更新收藏列表的顯示
            displayFavorites();
        }
    } catch (error) {
        console.error('Error removing from favorites:', error);
    }
}

// 顯示收藏列表
function displayFavorites() {
    try {
        const favoritesList = document.getElementById('favorites-list');
        favoritesList.innerHTML = '';

        // 從 localStorage 中取得收藏列表
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        // 根據收藏列表中的角色 ID，查找並顯示相應的角色名稱
        favorites.forEach(id => {
            const champion = champions.find(c => c.id === id);
            if (champion) {
                const listItem = document.createElement('li');
                listItem.innerText = champion.name;
                // 添加按鈕來刪除收藏
                const removeBtn = document.createElement('button');
                removeBtn.innerText = '刪除';
                removeBtn.addEventListener('click', () => removeFromFavorites(champion.id));
                listItem.appendChild(removeBtn);
                favoritesList.appendChild(listItem);
            }
        });
    } catch (error) {
        console.error('Error displaying favorites:', error);
    }
}



// 搜索和篩選功能的事件監聽
document.getElementById('search').addEventListener('input', displayChampions);
document.getElementById('filter').addEventListener('change', displayChampions);
document.getElementById('sort').addEventListener('change', displayChampions);

// 載入初始資料
loadChampions();
displayFavorites();