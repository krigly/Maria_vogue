// ============================================
// 1. НАСТРОЙКИ
// ============================================

const friendName = 'АННА';

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
    'photo9.jpg',
    'photo10.jpg',
    'photo11.jpg',
    'photo12.jpg',
    'photo13.jpg',
    'photo14.jpg',
    'photo15.jpg',
    'photo16.jpg',
    'photo17.jpg',
    'photo18.jpg',
    'photo19.jpg',
    'photo20.jpg',
    'photo21.jpg',
    'photo22.jpg',
    'photo23.jpg',
    'photo24.jpg',
    'photo25.jpg',
    'photo26.jpg',
];

const videoFiles = [
    'video1.mp4',
    'video2.mp4',
    'video3.mp4',
    'video4.mp4',
    'video5.mp4',
    'video6.mp4',
    'video7.mp4',
    'video8.mp4',
    'video9.mp4',
    'video10.mp4',
    'video11.mp4',
    'video12.mp4',
    'video13.mp4',
    'video14.mp4',
    'video15.mp4',

    // 👇 ДОБАВЛЯЙ НОВЫЕ ВИДЕО СЮДА
];

const ITEMS_PER_PAGE = 15;  // элементов на страницу


// ============================================
// 2. ОБЛОЖКА
// ============================================
document.getElementById('coverName').textContent = friendName;

if (imageFiles.length > 0) {
    document.getElementById('coverImage').src = `images/${imageFiles[0]}`;
}


// ============================================
// 3. ПЕРЕМЕШИВАЕМ ФОТО И ВИДЕО В ОДИН МАССИВ
// ============================================

// Создаём массив всех элементов с типами
let allItems = [];

// Добавляем фото (кроме обложки)
imageFiles.slice(1).forEach((file, index) => {
    allItems.push({
        type: 'image',
        file: file,
        id: `img_${index}`
    });
});

// Добавляем видео
videoFiles.forEach((file, index) => {
    allItems.push({
        type: 'video',
        file: file,
        id: `vid_${index}`
    });
});

// 🔀 ПЕРЕМЕШИВАЕМ (рандомный порядок)
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

allItems = shuffleArray(allItems);

// Размеры для хаоса
const sizes = ['size-small', 'size-medium', 'size-large', 'size-xlarge'];


// ============================================
// 4. ГАЛЕРЕЯ (масонри с фото и видео)
// ============================================
let currentPage = 1;
const totalPages = Math.ceil(allItems.length / ITEMS_PER_PAGE);

function renderGallery(page) {
    const grid = document.getElementById('galleryGrid');
    grid.innerHTML = '';
    grid.style.opacity = '0';

    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = Math.min(start + ITEMS_PER_PAGE, allItems.length);
    const pageItems = allItems.slice(start, end);

    if (pageItems.length === 0) {
        grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:#999; padding:40px;">Контент скоро появится ✨</p>`;
    } else {
        pageItems.forEach((item, index) => {
            const wrapper = document.createElement('div');

            // Случайный размер
            const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];
            const isVideo = item.type === 'video';

            wrapper.className = `gallery-item-wrapper ${sizeClass}`;
            if (isVideo) {
                wrapper.classList.add('is-video');
            }

            if (isVideo) {
                // ===== ВИДЕО =====
                const video = document.createElement('video');
                video.muted = true;
                video.autoplay = true;
                video.loop = true;
                video.playsInline = true;
                video.className = 'gallery-video';
                video.dataset.index = start + index;

                const source = document.createElement('source');
                source.src = `videos/${item.file}`;
                source.type = 'video/mp4';

                video.appendChild(source);
                wrapper.appendChild(video);

                // Бейдж "VIDEO"
                const badge = document.createElement('div');
                badge.className = 'video-badge';
                badge.textContent = '🎬 VIDEO';
                wrapper.appendChild(badge);

            } else {
                // ===== ФОТО =====
                const img = document.createElement('img');
                img.src = `images/${item.file}`;
                img.alt = `Фото ${start + index + 1}`;
                img.loading = 'lazy';
                img.className = 'gallery-item';
                img.dataset.index = start + index;
                img.addEventListener('click', () => openModal(start + index));

                wrapper.appendChild(img);

                // Наслоение
                const overlay = document.createElement('div');
                overlay.className = 'overlay';
                overlay.textContent = `Момент #${start + index + 1}`;
                wrapper.appendChild(overlay);
            }

            grid.appendChild(wrapper);
        });
    }

    document.getElementById('pageInfo').textContent = `${page} / ${totalPages || 1}`;
    document.getElementById('prevPage').disabled = page === 1;
    document.getElementById('nextPage').disabled = page === totalPages || totalPages === 0;

    setTimeout(() => { grid.style.opacity = '1'; }, 50);
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderGallery(currentPage);
        // Прокручиваем к галерее
        document.querySelector('.gallery-section').scrollIntoView({ behavior: 'smooth' });
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderGallery(currentPage);
        document.querySelector('.gallery-section').scrollIntoView({ behavior: 'smooth' });
    }
});


// ============================================
// 5. МОДАЛЬНЫЙ СЛАЙДЕР (только для фото)
// ============================================
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImage');
const caption = document.getElementById('modalCaption');
const counter = document.getElementById('modalCounter');
const closeBtn = document.getElementById('modalClose');
const prevBtn = document.getElementById('modalPrev');
const nextBtn = document.getElementById('modalNext');

// Список только фото (для слайдера)
const onlyImages = allItems.filter(item => item.type === 'image');
let currentModalIndex = 0;

function openModal(index) {
    // Находим индекс в массиве только фото
    const imgIndex = onlyImages.findIndex((item, i) => {
        const globalIndex = allItems.indexOf(item);
        return globalIndex === index;
    });

    if (imgIndex === -1) return;

    currentModalIndex = imgIndex;
    modal.style.display = 'block';
    updateModal();
    document.body.style.overflow = 'hidden';
}

function updateModal() {
    const item = onlyImages[currentModalIndex];
    if (item) {
        modalImg.src = `images/${item.file}`;
        modalImg.alt = `Фото ${currentModalIndex + 1}`;
        caption.textContent = `Момент #${currentModalIndex + 1}`;
        counter.textContent = `${currentModalIndex + 1} / ${onlyImages.length}`;
    }
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentModalIndex > 0) {
        currentModalIndex--;
        updateModal();
    }
});

nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (currentModalIndex < onlyImages.length - 1) {
        currentModalIndex++;
        updateModal();
    }
});

closeBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        if (e.key === 'Escape') {
            closeModal();
        }
        if (e.key === 'ArrowLeft' && currentModalIndex > 0) {
            currentModalIndex--;
            updateModal();
        }
        if (e.key === 'ArrowRight' && currentModalIndex < onlyImages.length - 1) {
            currentModalIndex++;
            updateModal();
        }
    }
});


// ============================================
// 6. ЗАПУСК
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    renderGallery(currentPage);

    console.log('%c✦ VOGUE ✦ Специально для тебя!', 'font-size:24px; color:#d4af37; font-weight:bold;');
    console.log(`%c${friendName}, это твой личный журнал! ❤️`, 'font-size:16px; color:#555;');
    console.log(`%c📸 Фото: ${imageFiles.length - 1} | 🎬 Видео: ${videoFiles.length}`, 'font-size:14px; color:#888;');
});