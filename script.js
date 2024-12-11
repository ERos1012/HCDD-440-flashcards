let flashcards = [];
let currentIndex = 0;

// Add Flashcard Button Event Listener
document.getElementById('add-card-btn').addEventListener('click', async function () {
    const term = document.getElementById('term').value; // Updated ID
    const definition = document.getElementById('definition').value; // Updated ID

    if (term && definition) {
        try {
            showLoading(true); // Show loading status
            const frontImage = await generateAIImage(term); // Generate image based on the term
            addFlashcard(term, definition, frontImage);
            clearForm();
            showFlashcard(currentIndex); // Display the current card
            updateCounter();
        } catch (error) {
            console.error('Failed to generate AI image:', error);
            alert('Failed to generate image. Please try again.');
        } finally {
            showLoading(false); // Hide loading status
        }
    } else {
        alert('Please fill in both term and definition.');
    }
});

// Function to toggle loading status visibility
function showLoading(isLoading) {
    const loadingStatus = document.getElementById('loading-status');
    loadingStatus.style.display = isLoading ? 'block' : 'none';
}

// Function to generate AI image using Pollinations API
async function generateAIImage(text) {
    try {
        const prompt = encodeURIComponent(text);
        const url = `https://image.pollinations.ai/prompt/${prompt}?width=512&height=512&nologo=true`;

        // Fetching the image
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        // Return the image URL
        return url;
    } catch (error) {
        throw new Error('Error generating image from Pollinations AI.');
    }
}

// Add Flashcard to the list
function addFlashcard(term, definition, frontImage) {
    const flashcard = {
        term: term, // Updated property names for clarity
        definition: definition,
        frontImage: frontImage, // Store generated image for the front
    };
    flashcards.push(flashcard);
}

// Clear form fields
function clearForm() {
    document.getElementById('term').value = ''; // Updated ID
    document.getElementById('definition').value = ''; // Updated ID
}

document.getElementById('card-mode').addEventListener('change', function () {
    showFlashcard(currentIndex);
});


// Show flashcard based on index and mode
function showFlashcard(index) {
    const flashcardDisplay = document.getElementById('flashcard-display');
    flashcardDisplay.innerHTML = ''; // Clear current display

    if (flashcards.length > 0) {
        const card = flashcards[index];
        const flashcard = document.createElement('div');
        flashcard.classList.add('flashcard');

        // Get the current display mode from the dropdown
        const mode = document.getElementById('card-mode').value;

        const front = document.createElement('div');
        front.classList.add('front');
        const back = document.createElement('div');
        back.classList.add('back');

        // Logic to show content based on selected mode
        if (mode === 'term') {
            // Term on the front, definition on the back
            front.innerHTML = `<p>${card.term}</p>`;
            if (card.frontImage) {
                const img = document.createElement('img');
                img.src = card.frontImage;
                img.alt = 'Generated Image';
                front.appendChild(img);
            }
            back.innerHTML = `<p>${card.definition}</p>`;
        } else if (mode === 'definition') {
            // Definition on the front, term and image on the back
            front.innerHTML = `<p>${card.definition}</p>`;
            back.innerHTML = `<p>${card.term}</p>`;
            if (card.frontImage) {
                const img = document.createElement('img');
                img.src = card.frontImage;
                img.alt = 'Generated Image';
                back.appendChild(img);
            }
        }

        // Add front and back to the flashcard
        flashcard.appendChild(front);
        flashcard.appendChild(back);

        // Add flip functionality
        flashcard.addEventListener('click', function () {
            flashcard.classList.toggle('flipped');
        });

        // Display the flashcard
        flashcardDisplay.appendChild(flashcard);
    }
}


// Next and Previous button functionality
document.getElementById('next-btn').addEventListener('click', function () {
    if (currentIndex < flashcards.length - 1) {
        currentIndex++;
        showFlashcard(currentIndex);
        updateCounter();
    } else {
        alert("You've reached the last card.");
    }
});

document.getElementById('prev-btn').addEventListener('click', function () {
    if (currentIndex > 0) {
        currentIndex--;
        showFlashcard(currentIndex);
        updateCounter();
    } else {
        alert("You're already on the first card.");
    }
});

// Update counter
function updateCounter() {
    const counterText = document.getElementById('counter-text');
    counterText.textContent = `Card ${currentIndex + 1} of ${flashcards.length}`;
}
