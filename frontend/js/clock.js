// js/clock.js

const hourHand = document.getElementById('hour-hand');
const minuteHand = document.getElementById('minute-hand');
const secondHand = document.getElementById('second-hand');
const digitalClock = document.getElementById('digital-clock');

function setClock() {
    const now = new Date();

    // Lấy giây, phút, giờ
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    // --- Đồng hồ cơ ---
    // Tính toán độ xoay cho mỗi kim
    const secondsDegrees = ((seconds / 60) * 360) + 90; // +90 để bù lại vị trí ban đầu
    const minutesDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 90;
    const hoursDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30) + 90;

    // Áp dụng độ xoay vào các kim
    secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
    minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
    hourHand.style.transform = `rotate(${hoursDegrees}deg)`;

    // --- Đồng hồ số ---
    // Định dạng thời gian để luôn có 2 chữ số
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    digitalClock.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// Chạy hàm setClock mỗi giây
setInterval(setClock, 1000);

// Chạy lần đầu ngay khi tải trang
setClock();