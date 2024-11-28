document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [footerResponse] = await Promise.all([
            fetch('src/components/footer.html')
        ]);

        const [navbarHtml, footerHtml] = await Promise.all([
            footerResponse.text()
        ]);

        document.getElementById('footer-placeholder').innerHTML = footerHtml;
    } catch (error) {
        console.error('Error loading page components:', error);
    }

    
});



document.addEventListener('DOMContentLoaded', () => {
    fetch('src/components/navbar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('navbar-placeholder').innerHTML = html;
            const script = document.createElement('script');
            script.src = '/js/navbar.js';
            document.body.appendChild(script);
        })
        .catch(error => console.error('Error loading navbar:', error));
});