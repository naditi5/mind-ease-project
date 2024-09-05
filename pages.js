document.addEventListener("DOMContentLoaded", function() {
    const quotesLink = document.getElementById('quotesLink');
    const videosLink = document.getElementById('videosLink');
    const blogsLink = document.getElementById('blogsLink');
    const headingContainer = document.getElementById('headingContainer');
    const iframe = document.getElementById('iframeContent');

    quotesLink.addEventListener('click', function(event) {
        event.preventDefault();
        headingContainer.style.display = 'none';
        iframeContent.src = quotesLink.getAttribute('data-page');
    });

    videosLink.addEventListener('click', function(event) {
        event.preventDefault();
        headingContainer.style.display = 'none';
        iframeContent.src = videosLink.getAttribute('data-page');
    });

    blogsLink.addEventListener('click', function(event) {
        event.preventDefault();
        headingContainer.style.display = 'none';
        iframeContent.src = blogsLink.getAttribute('data-page');
    });
});

