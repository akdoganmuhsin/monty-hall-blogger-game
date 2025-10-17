document.addEventListener('DOMContentLoaded', () => {
    // ---- DOM ELEMENTLERİ ----
    const doors = document.querySelectorAll('.door');
    const messageEl = document.getElementById('game-message');
    const triesEl = document.getElementById('tries-counter');
    const resetButton = document.getElementById('reset-button');

    // ---- OYUN DEĞİŞKENLERİ ----
    let gameState = 'PICKING'; // PICKING, REVEALING, FINAL_CHOICE, GAME_OVER
    let doorsContent = []; // '🚗', '🐐', '🐐'
    let playerInitialChoice = null;
    let carLocation = null;
    let openedByHost = null;
    let triesLeft = 3;

    // ---- OYUNU BAŞLATMA ----
    function initGame() {
        gameState = 'PICKING';
        playerInitialChoice = null;
        openedByHost = null;

        // Arabanın yerini rastgele belirle
        carLocation = Math.floor(Math.random() * 3);
        doorsContent = ['🐐', '🐐', '🐐'];
        doorsContent[carLocation] = '🚗';

        // Kapıları görsel olarak sıfırla
        doors.forEach((door, index) => {
            door.classList.remove('opened', 'selected');
            door.querySelector('.door-back').textContent = doorsContent[index];
        });

        messageEl.textContent = 'Lütfen bir kapı seçin.';
        resetButton.style.display = 'none';
        updateTriesCounter();
    }

    // ---- KAPIYA TIKLAMA OLAYI ----
    doors.forEach((door, index) => {
        door.addEventListener('click', () => handleDoorClick(index));
    });
    
    resetButton.addEventListener('click', () => {
        triesLeft = 3;
        initGame();
    });

    function handleDoorClick(index) {
        if (gameState === 'PICKING') {
            handleInitialPick(index);
        } else if (gameState === 'FINAL_CHOICE') {
            handleFinalDecision(index);
        }
    }

    // ---- OYUN AKIŞI FONKSİYONLARI ----
    function handleInitialPick(index) {
        playerInitialChoice = index;
        doors[index].classList.add('selected');
        gameState = 'REVEALING';
        messageEl.textContent = 'Harika bir seçim! Şimdi sunucu bir kapı açacak...';
        
        // Sunucunun kapı açması için gecikme
        setTimeout(hostOpensDoor, 1500);
    }

    function hostOpensDoor() {
        let doorToOpen;
        do {
            doorToOpen = Math.floor(Math.random() * 3);
        } while (doorToOpen === playerInitialChoice || doorToOpen === carLocation);

        openedByHost = doorToOpen;
        doors[doorToOpen].classList.add('opened'); // Kapıyı aç

        gameState = 'FINAL_CHOICE';
        messageEl.textContent = 'Seçiminizi değiştirmek ister misiniz?';
    }

    function handleFinalDecision(finalChoiceIndex) {
        if (finalChoiceIndex === openedByHost) return; // Açık kapıya tıklamayı engelle

        const isWinner = (finalChoiceIndex === carLocation);
        
        // Sonucu göster
        revealAllDoors();

        if (isWinner) {
            messageEl.textContent = 'Tebrikler, arabayı buldunuz! 🚗';
        } else {
            messageEl.textContent = 'Maalesef, bu bir keçiydi! 🐐';
        }

        triesLeft--;
        updateTriesCounter();
        gameState = 'GAME_OVER';

        if (triesLeft > 0) {
            setTimeout(initGame, 3000); // 3 saniye sonra yeni tur
        } else {
            messageEl.textContent = 'Oyun bitti! Stratejinizin sonucunu gördünüz.';
            resetButton.style.display = 'block';
        }
    }

    function revealAllDoors() {
        doors.forEach(door => door.classList.add('opened'));
    }

    function updateTriesCounter() {
        triesEl.textContent = `Kalan Hak: ${triesLeft}`;
    }

    // ---- OYUNU İLK KEZ BAŞLAT ----
    initGame();
});
