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
    
    loadHTML('/public/sections/header.html', 'header');
    loadHTML('/public/sections/footer.html', 'footer');

    // Filter Popup Functionality
    const filterBtn = document.querySelector('.filter-toggle-btn');
    const filterPopup = document.getElementById('filterPopup');
    const closePopup = document.querySelector('.close-popup');
    
    filterBtn.addEventListener('click', () => {
        filterPopup.classList.add('active');
    });
    
    closePopup.addEventListener('click', () => {
        filterPopup.classList.remove('active');
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === filterPopup) {
            filterPopup.classList.remove('active');
        }
    });

    // Location Select Functionality
    const selectBox = document.getElementById('locationSelect');
    const selectedOption = selectBox.querySelector('.selected-option');
    const optionsContainer = selectBox.querySelector('.options-container');
    const searchInput = selectBox.querySelector('.search-box input');
    const options = selectBox.querySelectorAll('.options-list .option');
    const selectAll = selectBox.querySelector('.select-all input');
    const selectedCount = selectBox.querySelector('.selected-count');
    
    selectedOption.addEventListener('click', () => {
        optionsContainer.classList.toggle('active');
        selectedOption.classList.toggle('active');
        if (optionsContainer.classList.contains('active')) {
            searchInput.focus();
        }
    });

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        options.forEach(option => {
            const text = option.querySelector('.option-text').textContent.toLowerCase();
            option.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });

    selectAll.addEventListener('change', () => {
        const isChecked = selectAll.checked;
        options.forEach(option => {
            option.querySelector('input').checked = isChecked;
        });
        updateSelectedCount();
    });

    options.forEach(option => {
        option.querySelector('input').addEventListener('change', () => {
            updateSelectedCount();
            updateSelectAll();
        });
    });

    function updateSelectedCount() {
        const checkedCount = selectBox.querySelectorAll('.options-list input:checked').length;
        if (checkedCount > 0) {
            selectedCount.textContent = `${checkedCount} شهر`;
            selectedCount.style.display = 'block';
        } else {
            selectedCount.style.display = 'none';
        }
    }

    function updateSelectAll() {
        const totalOptions = options.length;
        const checkedOptions = selectBox.querySelectorAll('.options-list input:checked').length;
        selectAll.checked = totalOptions === checkedOptions;
    }

    document.addEventListener('click', (e) => {
        if (!selectBox.contains(e.target)) {
            optionsContainer.classList.remove('active');
            selectedOption.classList.remove('active');
        }
    });

    // Project Type Switching Functionality
    const projectTypeBtns = document.querySelectorAll('.project-type-btn');
    const projectSections = [
        document.getElementById('running-projects'),
        document.getElementById('completed-projects'),
        document.getElementById('funding-projects')
    ];
    
    // Initially hide completed and funding sections
    projectSections[1].style.display = 'none';
    projectSections[2].style.display = 'none';
    projectSections[0].style.display = 'block';
    
    projectTypeBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            projectTypeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            projectSections.forEach(section => {
                section.style.display = 'none';
            });
            
            projectSections[index].style.display = 'block';
        });
    });
    
    projectTypeBtns[0].classList.add('active');

    // Timeline Animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.setProperty('--item-index', index);
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    document.querySelectorAll('.timeline-item').forEach((item) => {
        observer.observe(item);
    });

    // Update these section mappings to match the correct IDs
    const sectionMappings = {
        'running-projects': 0,
        'completed-projects': 1,
        'funding-projects': 2
    };

    // Handle hash navigation and button activation
    function handleHashNavigation() {
        const hash = window.location.hash.substring(1) || 'running-projects'; // Changed default from 'ongoing'
        const sectionIndex = sectionMappings[hash];
        
        if (typeof sectionIndex !== 'undefined') {
            projectSections.forEach(section => section.style.display = 'none');
            projectTypeBtns.forEach(btn => btn.classList.remove('active'));
            
            projectSections[sectionIndex].style.display = 'block';
            projectTypeBtns[sectionIndex].classList.add('active');
        }
    }

    // Initial hash handling
    handleHashNavigation();

    // Handle hash changes
    window.addEventListener('hashchange', handleHashNavigation);

    // Update project type button click handlers
    projectTypeBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const hashes = ['running-projects', 'completed-projects', 'funding-projects']; // Updated hash values
            window.location.hash = hashes[index];
        });
    });
});
