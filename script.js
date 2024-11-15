// Ensure all DOM elements are correctly retrieved
const verseContainer = document.getElementById("verse-container");
const donateContainer = document.getElementById("donate-container");
const creditsContainer = document.getElementById("credits-container");
const changeVerseButton = document.getElementById("change-verse-button");
const toggleThemeButton = document.getElementById("theme-toggle-button");
const btcToggle = document.getElementById("btcToggle");
const copyright = document.getElementById("copyright");
const settings = document.getElementById("settings");
const musicContainer = document.getElementById("musicContainer");
const gearIcon = document.getElementById("gear-icon");
const cookieIcon = document.getElementById("cookie-icon");
const cookieContainer = document.getElementById("cookie-container");
const cookieOkButton = document.getElementById("cookie-ok-button");

const audioPlayer = document.getElementById('audio-player');
const musicIcon = document.getElementById('music-icon');
const totalSongs = 12;
let songsPlayed = JSON.parse(localStorage.getItem('songsPlayed')) || [];

// Function to get a random song
function getRandomSong() {
    if (songsPlayed.length === totalSongs) {
        songsPlayed = [];
    }

    let randomSong;
    do {
        randomSong = Math.floor(Math.random() * totalSongs) + 1;
    } while (songsPlayed.includes(randomSong));

    songsPlayed.push(randomSong);
    localStorage.setItem('songsPlayed', JSON.stringify(songsPlayed));
    return `./music/${randomSong}.mp3`;
}

// Play a random song when the music icon is clicked
musicIcon.addEventListener('click', () => {
    const songSrc = getRandomSong();
    audioPlayer.src = songSrc;
    audioPlayer.play()
        .then(() => {
            console.log(`Playing song: ${songSrc}`);
        })
        .catch(error => {
            console.error('Error playing the song:', error);
        });
});

// Stop the music and reset when clicking on the speaker icon
const speakerIcon = document.getElementById("speaker-icon");
speakerIcon.addEventListener("click", () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        speakerIcon.textContent = "volume_up";
    } else {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        speakerIcon.textContent = "volume_off";
    }
});

let verses = [];
let verseOrder = [];
let imageOrder = [];
let currentVerseIndex = 0;
let currentImageIndex = 0;
let intervalId = null;
const displayDuration = 600000; // 10 minutes

// Function to show only the verse container
function showVerseContainer() {
    verseContainer.style.display = "block";
    donateContainer.style.display = "none";
    creditsContainer.style.display = "none";
    settings.style.display = "none";
    cookieContainer.style.display = "none";
}

// Function to show only the donate container
function showDonateContainer() {
    donateContainer.style.display = "block";
    verseContainer.style.display = "none";
    creditsContainer.style.display = "none";
    settings.style.display = "none";
    cookieContainer.style.display = "none";
}

// Function to show only the credits container
function showCreditsContainer() {
    creditsContainer.style.display = "block";
    verseContainer.style.display = "none";
    donateContainer.style.display = "none";
    settings.style.display = "none";
    cookieContainer.style.display = "none";
}

// Function to show only the settings container
function showSettingsContainer() {
    settings.style.display = "block";
    verseContainer.style.display = "block";
    donateContainer.style.display = "none";
    creditsContainer.style.display = "none";
    cookieContainer.style.display = "none";
}

// Function to show only the cookie container
function showCookieContainer() {
    cookieContainer.style.display = "block";
    settings.style.display = "block"; // Keep settings visible when cookie container is shown
    verseContainer.style.display = "none";
    donateContainer.style.display = "none";
    creditsContainer.style.display = "none";
}

// Function to determine the default container to show
function initializeContainerDisplay() {
    const hasSeenCookieMessage = localStorage.getItem("hasSeenCookieMessage");
    if (hasSeenCookieMessage) {
        showVerseContainer(); // Show verse container if cookie message has been seen
    } else {
        showCookieContainer(); // Show cookie container on first visit
    }
}

// Event listener for the OK button in the cookie container
cookieOkButton.addEventListener("click", () => {
    localStorage.setItem("hasSeenCookieMessage", "true"); // Mark cookie message as seen
    showVerseContainer();
});

// Toggle the settings container visibility
function toggleSettings() {
    const isSettingsVisible = settings.style.display === "block";
    if (isSettingsVisible) {
        settings.style.display = "none";
        showVerseContainer();
    } else {
        showSettingsContainer();
    }
}

// Add event listeners once DOM is fully loaded
window.onload = () => {
    // Load initial theme and verses
    loadDataFromLocalStorage();
    loadVerses();

    // Initialize default container display
    initializeContainerDisplay();

    // Attach event listeners
    changeVerseButton.addEventListener("click", () => {
        clearInterval(intervalId); // Stop the interval first
        displayNextVerse();
        intervalId = setInterval(displayNextVerse, displayDuration); // Restart interval
    });

    toggleThemeButton.addEventListener("click", () => {
        const isLightMode = document.body.classList.contains("light_mode");
        document.body.classList.toggle("light_mode", !isLightMode);
        document.body.classList.toggle("dark_mode", isLightMode);
        localStorage.setItem("themeColor", isLightMode ? "dark_mode" : "light_mode");
        toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
    });

    btcToggle.addEventListener("click", () => {
        const isDonateVisible = donateContainer.style.display === "block";
        if (isDonateVisible) {
            showVerseContainer();
        } else {
            showDonateContainer();
        }
    });

    gearIcon.addEventListener("click", toggleSettings);

    cookieIcon.addEventListener("click", showCookieContainer);

    copyright.addEventListener("click", () => {
        const isCreditsVisible = creditsContainer.style.display === "block";
        if (isCreditsVisible) {
            showVerseContainer();
        } else {
            showCreditsContainer();
        }
    });
};

// Load theme preference from localStorage
function loadDataFromLocalStorage() {
    const savedTheme = localStorage.getItem("themeColor");
    if (savedTheme === "dark_mode") {
        document.body.classList.add("dark_mode");
        toggleThemeButton.innerText = "light_mode";
    } else {
        document.body.classList.add("light_mode");
        toggleThemeButton.innerText = "dark_mode";
    }
}

// Load verses from JSON file
async function loadVerses() {
    try {
        const response = await fetch("KJVBibleScriptures.json");
        verses = await response.json();
        randomizeVerses();
        randomizeImages();
        displayNextVerse(); // Display a verse and image on load
        intervalId = setInterval(displayNextVerse, displayDuration);
    } catch (error) {
        console.error("Error loading verses:", error);
    }
}

// Randomize verse order
function randomizeVerses() {
    verseOrder = [...Array(verses.length).keys()];
    for (let i = verseOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [verseOrder[i], verseOrder[j]] = [verseOrder[j], verseOrder[i]];
    }
    currentVerseIndex = 0;
}

// Randomize image order (1 to 19 images)
function randomizeImages() {
    imageOrder = Array.from({ length: 19 }, (_, i) => i + 1);
    for (let i = imageOrder.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [imageOrder[i], imageOrder[j]] = [imageOrder[j], imageOrder[i]];
    }
    currentImageIndex = 0;
}

// Display the next verse and image
function displayNextVerse() {
    if (verseOrder.length === 0 || imageOrder.length === 0) return;

    const verse = verses[verseOrder[currentVerseIndex]];
    const imagePath = `bgimages/${imageOrder[currentImageIndex]}.jpg`;

    document.querySelector("#verse-container .verse-book").textContent = verse.book || "Unknown Book";
    document.querySelector("#verse-container .verse-text").textContent = verse.text || "No verse text available.";
    document.querySelector("#verse-container .verse-lesson").textContent = verse.lesson || "No lesson available.";

    const overflowContainer = document.getElementById("overflowcontainer");
    overflowContainer.style.backgroundImage = `url('${imagePath}')`;

    currentVerseIndex = (currentVerseIndex + 1) % verseOrder.length;
    currentImageIndex = (currentImageIndex + 1) % imageOrder.length;

    if (currentVerseIndex === 0) randomizeVerses();
    if (currentImageIndex === 0) randomizeImages();
}
