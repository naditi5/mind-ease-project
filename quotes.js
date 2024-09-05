const quoteContainer = document.getElementById('quote-container');
const getNewQuotesButton = document.getElementById('get-new-quotes');

// Function to fetch quotes from API and render them
async function getQuotes(category, quotes = 18) {
    getNewQuotesButton.style.display = 'none';
    quoteContainer.innerHTML = ''; // Clear previous quotes

    for (let i = 0; i < quotes; i++) {
        try {
            const response = await fetch(`https://api.api-ninjas.com/v1/quotes?category=${category.toLowerCase()}`, {
                method: 'GET',
                headers: {
                    'X-Api-Key': 'J4xZrNiGpHA7ifjP5SzrJA==sWULiIfGmNdHaHrv'
                }
            });
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            const quote = data[0].quote;  // Adjusted to access the first quote in the returned array
            const author = data[0].author; // Adjusted to access the first author in the returned array

            // Create a new quote element
            const quoteElement = document.createElement('div');
            quoteElement.className = 'quote';
            quoteElement.innerHTML = `
                <p>${quote}</p>
                <p>— ${author}</p>
            `;

            // Add the quote element to the container
            quoteContainer.appendChild(quoteElement);
        } catch (error) {
            console.error('Error fetching the quote:', error);
        }
    }
    getNewQuotesButton.style.display = 'block';
    quoteContainer.style.display = 'grid';
}

// Function to load content based on the button clicked
function loadContent(category) {
    getQuotes(category).then(() => getNewQuotesButton.style.display = 'block');  // Show button after fetching
}

// Function to handle button click and fetch new quotes
function handleGetNewQuotesClick() {
    // Fetch quotes based on the last clicked category button
    const lastClickedCategory = document.querySelector('.category .active');
    if (lastClickedCategory) {
        const category = lastClickedCategory.textContent.trim();
        getQuotes(category).then(() => getNewQuotesButton.style.display = 'block');  // Show button after fetching
    }
}

// Add event listener to get new quotes button
getNewQuotesButton.addEventListener('click', handleGetNewQuotesClick);

// Add event listeners to category buttons
document.querySelectorAll('#category .navy-button').forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('#category .navy-button').forEach(btn => btn.classList.remove('active'));
        // Add active class to the clicked button
        this.classList.add('active');
        // Load content for the clicked category
        loadContent(this.textContent.trim());
    });
});
