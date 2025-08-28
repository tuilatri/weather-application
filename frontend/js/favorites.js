// js/favorites.js

function getFavorites() {
    return JSON.parse(localStorage.getItem('weatherFavorites')) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
}

function addFavorite(city) {
    const favorites = getFavorites();
    const normalizedCity = city.toLowerCase();
    
    // Kiểm tra xem thành phố đã tồn tại chưa (không phân biệt hoa thường)
    if (!favorites.some(fav => fav.toLowerCase() === normalizedCity)) {
        favorites.push(city);
        saveFavorites(favorites);
    }
}

function removeFavorite(city) {
    let favorites = getFavorites();
    const normalizedCity = city.toLowerCase();
    
    // Lọc ra thành phố cần xóa (không phân biệt hoa thường)
    favorites = favorites.filter(fav => fav.toLowerCase() !== normalizedCity);
    saveFavorites(favorites);
}

function isFavorite(city) {
    const favorites = getFavorites();
    const normalizedCity = city.toLowerCase();
    return favorites.some(fav => fav.toLowerCase() === normalizedCity);
}