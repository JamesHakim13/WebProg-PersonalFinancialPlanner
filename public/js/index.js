document.addEventListener('DOMContentLoaded', function() {
    // Select ALL links that point to an ID on the page, not just those in the nav
    const scrollLinks = document.querySelectorAll('a[href^="#"]');

    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent the default jump behavior
            e.preventDefault();
            // Get the target element's ID from the href
            const targetId = this.getAttribute('href');
            // Find the target element
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Scroll smoothly to the target element
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Optional: Adjusts vertical alignment after scroll
                });
            } else {
                // Optional: Log an error if the target doesn't exist
                console.warn(`Smooth scroll target not found: ${targetId}`);
            }
        });
    });
});