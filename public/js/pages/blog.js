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

    // Set initial state
    const initialCategory = document.querySelector('.category-card.all');
    if (initialCategory) {
        initialCategory.classList.add('active');
        updateSectionTitle('همه مقالات');
    }

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            if (validateEmail(email)) {
                // Submit the form
                alert('ایمیل شما با موفقیت ثبت شد.');
                newsletterForm.reset();
            } else {
                alert('لطفا یک ایمیل معتبر وارد کنید.');
            }
        });
    }

    // Updated Category Filtering
    const categoryCards = document.querySelectorAll('.category-card');
    const blogSectionTitle = document.querySelector('.section-title');
    const blogPosts = document.querySelectorAll('.featured-post');
    
    // Category click handling
    categoryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get category from data attribute
            const category = card.getAttribute('data-category');
            
            // Update URL hash without triggering scroll
            window.history.pushState(null, '', `#${category}`);
            
            // Update UI and filter
            updateCategoryUI(category);
            filterPosts(category);
        });
    });

    // Update category UI
    function updateCategoryUI(category) {
        // Remove active class from all cards
        categoryCards.forEach(card => card.classList.remove('active'));
        
        // Add active class to selected category
        const activeCard = document.querySelector(`.category-card[data-category="${category}"]`);
        if (activeCard) {
            activeCard.classList.add('active');
        }

        // Update section title
        if (category === 'all') {
            blogSectionTitle.textContent = 'همه مقالات';
        } else {
            const categoryTitle = getCategoryTitle(category);
            blogSectionTitle.textContent = `مقالات ${categoryTitle}`;
        }
    }

    // Handle URL hash changes
    function handleHashChange() {
        const hash = window.location.hash.slice(1) || 'all';
        updateCategoryUI(hash);
        filterPosts(hash);
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    // Initial load - set default category
    if (!window.location.hash) {
        window.location.hash = 'all';
    } else {
        handleHashChange();
    }

    // Posts Display Management
    const postsPerPage = 4;
    let currentlyShown = postsPerPage;
    
    function initializePosts() {
        const allPosts = document.querySelectorAll('.featured-post');
        allPosts.forEach((post, index) => {
            if (index >= postsPerPage) {
                post.style.display = 'none';
            }
        });

        // Show/hide load more button based on total posts
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (allPosts.length <= postsPerPage) {
            loadMoreBtn.style.display = 'none';
        }
    }

    // Load More functionality
    document.querySelector('.load-more-btn').addEventListener('click', () => {
        const posts = document.querySelectorAll('.featured-post');
        for (let i = currentlyShown; i < currentlyShown + postsPerPage && i < posts.length; i++) {
            posts[i].style.display = 'flex';
            posts[i].style.animation = 'fadeIn 0.5s ease forwards';
        }
        currentlyShown += postsPerPage;

        // Hide button if no more posts
        if (currentlyShown >= posts.length) {
            document.querySelector('.load-more-btn').style.display = 'none';
        }
    });

    // Update filterPosts function to work with data attributes
    function filterPosts(category) {
        currentlyShown = postsPerPage; // Reset counter
        let visibleCount = 0;

        blogPosts.forEach(post => {
            const postCategory = post.getAttribute('data-category');
            const shouldShow = category === 'all' || postCategory === category;
            
            if (shouldShow) {
                visibleCount++;
                if (visibleCount <= postsPerPage) {
                    post.style.display = 'flex';
                    post.style.opacity = '1';
                } else {
                    post.style.display = 'none';
                    post.style.opacity = '0';
                }
            } else {
                post.style.display = 'none';
                post.style.opacity = '0';
            }
        });

        // Update load more button visibility
        const loadMoreBtn = document.querySelector('.load-more-btn');
        loadMoreBtn.style.display = visibleCount > postsPerPage ? 'flex' : 'none';
    }

    // Helper function to get category titles
    function getCategoryTitle(category) {
        const titles = {
            'all': 'همه مقالات',
            'news': 'اخبار و رویدادها',
            'tech': 'تکنولوژی و نوآوری',
            'investment': 'راهنمای سرمایه گذاری',
            'environment': 'محیط زیست',
            'analysis': 'گزارش های تحلیلی'
        };
        return titles[category] || category;
    }

    // Initialize posts display
    initializePosts();

    // Add smooth scroll for newsletter link
    function handleNewsletterClick(e) {
        const newsletterSection = document.getElementById('newsletter');
        if (newsletterSection && window.location.hash === '#newsletter') {
            e.preventDefault();
            newsletterSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Check for newsletter hash on page load and after dynamic content loads
    window.addEventListener('load', handleNewsletterClick);
    window.addEventListener('hashchange', handleNewsletterClick);
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
