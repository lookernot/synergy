document.addEventListener('DOMContentLoaded', () => {
    console.log('Header JS loaded'); // Debug log
    
    const menuBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!menuBtn || !mobileMenu) {
        console.error('Menu elements not found'); // Debug log
        return;
    }

    menuBtn.addEventListener('click', () => {
        console.log('Menu clicked'); // Debug log
        mobileMenu.classList.toggle('show');
        
        const icon = menuBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
        
        // Prevent body scrolling when menu is open
        document.body.style.overflow = mobileMenu.classList.contains('show') ? 'hidden' : '';
    });

    // Close menu when clicking links
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('show');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
            document.body.style.overflow = '';
        });
    });
});
