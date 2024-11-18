let flashcards = [];
let currentIndex = 0;

// Add Flashcard Button Event Listener
document.getElementById('add-card-btn').addEventListener('click', async function () {
    const frontText = document.getElementById('front-text').value;
    const backText = document.getElementById('back-text').value;

    if (frontText && backText) {
        try {
            showLoading(true); // Show loading status
            const backImage = await generateAIImage(backText); // Get the AI image
            addFlashcard(frontText, backText, backImage);
            clearForm();
            showFlashcard(currentIndex); // Show the first card after adding
            updateCounter();
        } catch (error) {
            console.error('Failed to generate AI image:', error);
            alert('Failed to generate image. Please try again.');
        } finally {
            showLoading(false); // Hide loading status
        }
    } else {
        alert('Please fill in both front and back text.');
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
function addFlashcard(frontText, backText, backImage) {
    const flashcard = {
        frontText: frontText,
        backText: backText,
        backImage: backImage
    };
    flashcards.push(flashcard);
}

// Clear form fields
function clearForm() {
    document.getElementById('front-text').value = '';
    document.getElementById('back-text').value = '';
}

// Show flashcard based on index
function showFlashcard(index) {
    const flashcardDisplay = document.getElementById('flashcard-display');
    flashcardDisplay.innerHTML = ''; // Clear current display

    if (flashcards.length > 0) {
        const card = flashcards[index];
        const flashcard = document.createElement('div');
        flashcard.classList.add('flashcard');
        
        const front = document.createElement('div');
        front.classList.add('front');
        front.innerHTML = `<p>${card.frontText}</p>`;
        
        const back = document.createElement('div');
        back.classList.add('back');
        back.innerHTML = `<p>${card.backText}</p>`;
        if (card.backImage) {
            const img = document.createElement('img');
            img.src = card.backImage;
            img.alt = 'Generated Image';
            back.appendChild(img);
        }

        // Append front and back to flashcard
        flashcard.appendChild(front);
        flashcard.appendChild(back);

        // Add flip functionality
        flashcard.addEventListener('click', function() {
            flashcard.classList.toggle('flipped');
        });

        // Show the new flashcard
        flashcardDisplay.appendChild(flashcard);
    }
}

// Next and Previous button functionality
document.getElementById('next-btn').addEventListener('click', function() {
    if (currentIndex < flashcards.length - 1) {
        currentIndex++;
        showFlashcard(currentIndex);
        updateCounter();
    } else {
        alert("You've reached the last card.");
    }
});

document.getElementById('prev-btn').addEventListener('click', function() {
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
