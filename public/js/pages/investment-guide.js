document.addEventListener('DOMContentLoaded', async () => {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').split('#')[1];
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add quick access scroll behavior
    const quickAccess = document.querySelector('.quick-access');
    const hero = document.querySelector('.hero-section');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > hero.offsetHeight) {
            quickAccess.classList.add('sticky');
        } else {
            quickAccess.classList.remove('sticky');
        }
    });

    // Load header and footer
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
    
    await loadHTML('/public/sections/header.html', 'header');
    await loadHTML('/public/sections/footer.html', 'footer');

    // FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    // FAQ More Button functionality
    const faqMoreBtn = document.querySelector('.faq-more-btn');
    const faqHidden = document.querySelector('.faq-hidden');
    
    if (faqMoreBtn && faqHidden) {
        faqMoreBtn.addEventListener('click', () => {
            faqHidden.classList.toggle('active');
            faqMoreBtn.classList.toggle('active');
            
            // Update button text visibility
            const showMore = faqMoreBtn.querySelector('.show-more');
            const showLess = faqMoreBtn.querySelector('.show-less');
            if (faqHidden.classList.contains('active')) {
                showMore.style.display = 'none';
                showLess.style.display = 'inline';
            } else {
                showMore.style.display = 'inline';
                showLess.style.display = 'none';
            }
        });
    }

    // FAQ Category Button functionality
    const faqCategoryBtns = document.querySelectorAll('.faq-category-btn');
    
    faqCategoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            faqCategoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
        });
    });

    // Add Intersection Observer for sections
    const sections = document.querySelectorAll('section[id]');
    const quickAccessItems = document.querySelectorAll('.quick-access-item');

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // This helps with more accurate activation
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            const currentSection = entry.target.getAttribute('id');
            const correspondingItem = document.querySelector(`.quick-access-item[href="#${currentSection}"]`);
            
            if (entry.isIntersecting) {
                // Remove active class from all items first
                quickAccessItems.forEach(item => item.classList.remove('active'));
                // Add active class to current item
                if (correspondingItem) {
                    correspondingItem.classList.add('active');
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});

// Initialize profit distribution chart
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('profitDistributionChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['سود سهامداران', 'هزینه‌های نگهداری', 'ذخیره قانونی'],
            datasets: [{
                data: [70, 20, 10],
                backgroundColor: ['#0f5ca8', '#31b8da', '#28c76f'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
});
