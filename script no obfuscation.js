
let verses = [];
let intervalId = null;
const displayDuration = 600000; // 10 minutes
const verseContainer = document.getElementById("verse-container");
const donateContainer = document.getElementById("donate-container");
const changeVerseButton = document.getElementById("change-verse-button");
const toggleThemeButton = document.getElementById("theme-toggle-button");
let verseOrder = [];
let imageOrder = [];
let currentVerseIndex = 0;
let currentImageIndex = 0;

// Theme toggle logic
toggleThemeButton.addEventListener("click", () => {
    const isLightMode = document.body.classList.contains("light_mode");
    document.body.classList.toggle("light_mode", !isLightMode);
    document.body.classList.toggle("dark_mode", isLightMode);
    localStorage.setItem("themeColor", isLightMode ? "dark_mode" : "light_mode");
    toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";
});

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

// Load verses from JSON
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

    // Display next verse
    const verse = verses[verseOrder[currentVerseIndex]];
    document.querySelector("#verse-container .verse-book").textContent = verse.book;
    document.querySelector("#verse-container .verse-text").textContent = verse.text;
    document.querySelector("#verse-container .verse-lesson").textContent = verse.lesson;

    // Display next image
    const imagePath = `bgimages/${imageOrder[currentImageIndex]}.jpg`;
    document.getElementById("overflowcontainer").style.backgroundImage = `url('${imagePath}')`;

    // Update verse and image indices
    currentVerseIndex = (currentVerseIndex + 1) % verseOrder.length;
    currentImageIndex = (currentImageIndex + 1) % imageOrder.length;

    // Re-randomize orders if needed
    if (currentVerseIndex === 0) randomizeVerses();
    if (currentImageIndex === 0) randomizeImages();
}

// Change verse on button click
changeVerseButton.addEventListener("click", () => {
    clearInterval(intervalId);
    displayNextVerse();
    intervalId = setInterval(displayNextVerse, displayDuration);
});


function displayNextVerse() {
    if (verseOrder.length === 0 || imageOrder.length === 0) return;

    // Fade out the overflow container
    const overflowContainer = document.getElementById("overflowcontainer");
    overflowContainer.style.opacity = 0;

    // Delay to allow fade-out before changing content
    setTimeout(() => {
        // Display next verse
        const verse = verses[verseOrder[currentVerseIndex]];
        document.querySelector("#verse-container .verse-book").textContent = verse.book;
        document.querySelector("#verse-container .verse-text").textContent = verse.text;
        document.querySelector("#verse-container .verse-lesson").textContent = verse.lesson;

        // Display next image
        const imagePath = `bgimages/${imageOrder[currentImageIndex]}.jpg`;
        overflowContainer.style.backgroundImage = `url('${imagePath}')`;

        // Update verse and image indices
        currentVerseIndex = (currentVerseIndex + 1) % verseOrder.length;
        currentImageIndex = (currentImageIndex + 1) % imageOrder.length;

        // Re-randomize orders if needed
        if (currentVerseIndex === 0) randomizeVerses();
        if (currentImageIndex === 0) randomizeImages();

        // Fade in the overflow container
        overflowContainer.style.opacity = 1;
    }, 500); // Adjust delay (in ms) to match the transition duration (1s)
}


// Toggle between verse and donate containers when Bitcoin logo is clicked
const btcToggle = document.getElementById("btcToggle"); // Ensure this ID matches your HTML

btcToggle.addEventListener("click", () => {
    const isVerseVisible = verseContainer.style.display === "block";
    verseContainer.style.display = isVerseVisible ? "none" : "block";
    donateContainer.style.display = isVerseVisible ? "block" : "none";
});

// Show credits-container and hide others when the copyright symbol is clicked
document.getElementById("copyright").onclick = function () {
    verseContainer.style.display = "none";
    donateContainer.style.display = "none";
    document.getElementById("credits-container").style.display = "block"; // Show credits-container
};
// Load theme preference and verses on page load
window.onload = () => {
    loadDataFromLocalStorage();
    loadVerses();
};
