document.addEventListener('DOMContentLoaded', function() {
    const API_KEY = 'AIzaSyA2CZ4cFWJ4hT2sLGRb0WT9ypW5VU0PGoc';
    const searchForm = document.getElementById('searchForm');
    const queryInput = document.getElementById('query');
    const searchButton = document.getElementById('searchButton');
    const videoContainer = document.getElementById('videoContainer');
    
    const mentalHealthKeywords = [
        'stress', 'anxiety', 'depression', 'mental health', 'well-being', 'therapy', 
        'counseling', 'mindfulness', 'self-care', 'emotional health', 'support', 
        'psychology', 'mood boosting', 'relief', 'help', 'health', 'issues', 
        'self-love', 'positive', 'self-talk', 'self-improvement'
    ];

    // Event listener for form submission
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const query = queryInput.value.toLowerCase();
        if (mentalHealthKeywords.some(keyword => query.includes(keyword))) {
            searchVideos(query);
        } else {
            videoContainer.innerHTML = '<p>Please enter a search term related to mental health.</p>';
        }
    });

    // Event listener for Enter key press in the input field
    queryInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchButton.click();
        }
    });

    // Function to search for videos based on the query
    function searchVideos(query) {
        fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${query}&key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                videoContainer.innerHTML = '';
                const filteredItems = data.items.filter(item => {
                    const title = item.snippet.title.toLowerCase();
                    const description = item.snippet.description.toLowerCase();
                    return mentalHealthKeywords.some(keyword => title.includes(keyword) || description.includes(keyword));
                });
                if (filteredItems.length === 0) {
                    videoContainer.innerHTML = '<p>No mental health related videos found. Please try again with a different term.</p>';
                } else {
                    filteredItems.forEach(item => {
                        const videoDiv = document.createElement('div');
                        videoDiv.className = 'video';

                        const iframe = document.createElement('iframe');
                        iframe.src = `https://www.youtube.com/embed/${item.id.videoId}`;
                        iframe.allowFullscreen = true;

                        const title = document.createElement('p');
                        title.textContent = item.snippet.title;

                        videoDiv.appendChild(iframe);
                        videoDiv.appendChild(title);
                        videoContainer.appendChild(videoDiv);
                    });
                }
            })
            .catch(error => console.error('Error fetching videos:', error));
    }
});
