// Load HTML sections
async function loadHTML(file, elementId) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Failed to load ${file}`);
        const text = await response.text();
        document.getElementById(elementId).innerHTML = text;
    } catch (error) {
        console.error(error);
    }
}

// Load header and footer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadHTML('/public/sections/header.html', 'header-placeholder');
    loadHTML('/public/sections/footer.html', 'footer-placeholder');
});
