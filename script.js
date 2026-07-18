// ============================================
// 1. НАСТРОЙКИ — ЭТО ТВОЙ ГЛАВНЫЙ РЕДАКТОР
// ============================================

// 👇 СЮДА ИМЯ ПОДРУГИ (оно появится на обложке!)
const friendName = 'АННА';

// 👇 ВСЕ ТВОИ ФОТО (пропиши названия файлов)
const imageFiles = [
    'cover.jpg',
    'photo1.jpg',
    'photo2.jpg',
    'photo3.jpg',
    'photo4.jpg',
    'photo5.jpg',
    'photo6.jpg',
    'photo7.jpg',
    'photo8.jpg',

];

// 👇 ВСЕ ТВОИ ВИДЕО
const videoFiles = [
    'video1.mp4',
    'video2.mp4',
    'video3.mp4',
    'video4.mp4',
    'video5.mp4',
    'video6.mp4',
];

const IMAGES_PER_PAGE = 9;


// ============================================
// 2. ПОДСТАВЛЯЕМ ИМЯ НА ОБЛОЖКУ
// ============================================
document.getElementById('coverName').textContent = friendName;


// ============================================
// 3. ОБЛОЖКА (первое фото из списка)
// ============================================
if (imageFiles.length > 0) {
    document.getElementById('coverImage').src = `images/${imageFiles[0]}`;
}


// ============================================
// 4. ГАЛЕРЕЯ
// ============================================
let currentPage = 1;
const galleryFiles = imageFiles.slice(1);
const totalPages = Math.ceil(galleryFiles.length / IMAGES_PER_PAGE);

function renderGallery(page) {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';
    grid.style.opacity = '0';

    const start = (page - 1) * IMAGES_PER_PAGE;
    const end = Math.min(start + IMAGES_PER_PAGE, galleryFiles.length);
    const pageFiles = galleryFiles.slice(start, end);

    if (pageFiles.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#999;">Фото скоро появятся ✨</p>';
    } else {
        pageFiles.forEach((file, index) => {
            const img = document.createElement('img');
            img.src = `images/${file}`;
            img.alt = `Фото ${start + index + 1}`;
            img.loading = 'lazy';
            img.dataset.index = start + index;
            img.addEventListener('click', () => openModal(start + index));
            grid.appendChild(img);
        });
    }

    document.getElementById('pageInfo').textContent = `${page} / ${totalPages || 1}`;
    document.getElementById('prevPage').disabled = page === 1;
    document.getElementById('nextPage').disabled = page === totalPages || totalPages === 0;

    setTimeout(() => { grid.style.opacity = '1'; }, 50);
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) { currentPage--; renderGallery(currentPage); }
});
document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) { currentPage++; renderGallery(currentPage); }
});


// ============================================
// 5. ВИДЕО
// ============================================
function renderVideos() {
    const grid = document.getElementById('videoGrid');
    grid.innerHTML = '';
    if (videoFiles.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:#999;">Видео скоро появятся 🎬</p>';
        return;
    }
    videoFiles.forEach(file => {
        const video = document.createElement('video');
        video.controls = true;
        video.className = 'video-player';
        const source = document.createElement('source');
        source.src = `videos/${file}`;
        source.type = 'video/mp4';
        video.appendChild(source);
        grid.appendChild(video);
    });
}


// ============================================
// 6. МОДАЛЬНЫЙ СЛАЙДЕР
// ============================================
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImage');
const caption = document.getElementById('modalCaption');
const counter = document.getElementById('modalCounter');
const closeBtn = document.getElementById('modalClose');
const prevBtn = document.getElementById('modalPrev');
const nextBtn = document.getElementById('modalNext');
let currentModalIndex = 0;

function openModal(index) {
    currentModalIndex = index;
    modal.style.display = 'block';
    updateModal();
    document.body.style.overflow = 'hidden';
}

function updateModal() {
    const file = galleryFiles[currentModalIndex];
    if (file) {
        modalImg.src = `images/${file}`;
        modalImg.alt = `Фото ${currentModalIndex + 1}`;
        caption.textContent = `Момент #${currentModalIndex + 1}`;
        counter.textContent = `${currentModalIndex + 1} / ${galleryFiles.length}`;
    }
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentModalIndex > 0) { currentModalIndex--; updateModal(); }
});
nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentModalIndex < galleryFiles.length - 1) { currentModalIndex++; updateModal(); }
});

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft' && currentModalIndex > 0) { currentModalIndex--; updateModal(); }
        if (e.key === 'ArrowRight' && currentModalIndex < galleryFiles.length - 1) { currentModalIndex++; updateModal(); }
    }
});


// ============================================
// 7. АВТОВОСПРОИЗВЕДЕНИЕ ВИДЕО
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.video-player').forEach(video => {
        video.addEventListener('mouseenter', function() { this.play(); });
        video.addEventListener('mouseleave', function() {
            this.pause();
            this.currentTime = 0;
        });
    });
});


// ============================================
// 8. ЗАПУСК
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    renderGallery(currentPage);
    renderVideos();

    console.log('%c✦ VOGUE ✦ Специально для тебя!', 'font-size:24px; color:#d4af37; font-weight:bold;');
    console.log(`%c${friendName}, это твой личный журнал! ❤️`, 'font-size:16px; color:#555;');
});