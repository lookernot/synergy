document.addEventListener('DOMContentLoaded', () => {
    // Load Header and Footer
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
    
    loadHTML('/public/sections/header.html', 'header-placeholder');
    loadHTML('/public/sections/footer.html', 'footer-placeholder');

    // Form handling
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Add your form submission logic here
        alert('پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.');
        contactForm.reset();
    });
});
