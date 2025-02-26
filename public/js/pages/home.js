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
    loadHTML('/public/sections/header.html', 'header');
    loadHTML('/public/sections/footer.html', 'footer');
});

// FAQ section toggle functionality
// function toggleFaq(faqItem) {
//     // Collapse all other FAQ items
//     const faqItems = document.querySelectorAll('.faq-item');
//     faqItems.forEach(item => {
//         if (item !== faqItem) {
//             item.classList.remove('active');
//         }
//     });
    
//     // Toggle the clicked FAQ item
//     faqItem.classList.toggle('active');
// }

// Projects section animations
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.invest-project-card');
    cards.forEach((card, index) => {
        card.style.setProperty('--card-index', index + 1);
    });
});

// Intersection Observer for animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const section = entry.target;
            section.classList.add('animate');
            
            // Animate cards with delay
            const cards = section.querySelectorAll('.invest-project-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate');
                }, index * 200);
            });
            
            // Unobserve after animation
            observer.unobserve(section);
        }
    });
}, {
    threshold: 0.2
});

// Observe the projects section
document.addEventListener('DOMContentLoaded', () => {
    const projectsSection = document.querySelector('.invest-projects-section');
    if (projectsSection) {
        observer.observe(projectsSection);
    }
});

// Investment Chart Implementation
document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('investment-chart').getContext('2d');
    let investmentChart;

    const SYNERGY_ANNUAL_RETURN = 0.39; // synergy  annual return
    const BANK_ANNUAL_RETURN = 0.17; // bank  annual return
    const MIN_INVESTMENT = 5000000; // 5 million tomans
    const MAX_INVESTMENT = 1000000000; // 1 billion tomans

    function formatToFarsiNumber(num) {
        const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return num.toString().replace(/\d/g, x => farsiDigits[x]);
    }

    function formatCurrency(amount) {
        const formatter = new Intl.NumberFormat('fa-IR', {
            maximumFractionDigits: 0
        });
        return formatter.format(Math.round(amount));
    }

    function calculateInvestmentGrowth(initialAmount, years) {
        let synergyData = [];
        let bankData = [];
        let labels = [];
        let synergyAmount = initialAmount;
        let bankAmount = initialAmount;

        for (let i = 0; i <= years; i++) {
            synergyData.push(synergyAmount);
            bankData.push(bankAmount);
            labels.push(`سال ${formatToFarsiNumber(i)}`);

            synergyAmount *= (1 + SYNERGY_ANNUAL_RETURN);
            bankAmount *= (1 + BANK_ANNUAL_RETURN);
        }

        return { labels, synergyData, bankData };
    }

    function renderChart() {
        const initialInvestment = parseFloat(document.getElementById('initial-investment').value) || 100000000;
        const years = parseInt(document.getElementById('years-range').value) || 5;
        
        if (investmentChart) {
            investmentChart.destroy();
        }

        const { labels, synergyData, bankData } = calculateInvestmentGrowth(initialInvestment, years);


        const gradientBank = ctx.createLinearGradient(0, 0, 0, 400);
        gradientBank.addColorStop(0, 'rgb(255, 178, 105)');
        gradientBank.addColorStop(1, 'rgb(255, 178, 105)');

        const gradientSynergy = ctx.createLinearGradient(0, 0, 0, 400);
        gradientSynergy.addColorStop(0, 'rgb(63, 125, 185)');
        gradientSynergy.addColorStop(1, 'rgb(63, 125, 185)');

        

        investmentChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'سپرده بانکی',
                        data: bankData,
                        backgroundColor: gradientBank,
                        borderColor: '#ff9f43',
                        borderWidth: 1,
                        borderRadius: 6,
                        barThickness: 25,
                    },
                    {
                        label: 'سرمایه‌گذاری در سینرژی',
                        data: synergyData,
                        backgroundColor: gradientSynergy,
                        borderColor: '#31b8da',
                        borderWidth: 1,
                        borderRadius: 6,
                        barThickness: 25,
                    }
                    
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 20,
                        right: 20,
                        left: 20,
                        bottom: 10
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'center',
                        rtl: true,
                        labels: {
                            font: {
                                family: 'Yekan Bakh',
                                size: 14,
                                weight: '500'
                            },
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        rtl: true,
                        titleAlign: 'right',
                        bodyAlign: 'right',
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${formatCurrency(context.raw)} تومان`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        position: 'right',
                        grid: {
                            drawBorder: false,
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                if (value >= 1000000000) {
                                    return formatCurrency(value / 1000000000) + ' میلیارد';
                                }
                                if (value >= 1000000) {
                                    return formatCurrency(value / 1000000) + ' میلیون';
                                }
                                return formatCurrency(value);
                            },
                            font: {
                                family: 'Yekan Bakh',
                                size: 12
                            },
                            maxRotation: 0
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Yekan Bakh',
                                size: 12
                            }
                        }
                    }
                },
                animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                }
            }
        });

        // Update summary values
        document.getElementById('synergy-total').textContent = 
            `${formatCurrency(synergyData[synergyData.length - 1])} تومان`;
        document.getElementById('bank-total').textContent = 
            `${formatCurrency(bankData[bankData.length - 1])} تومان`;
    }

    // Add input event listeners for dynamic updates
    const initialInvestmentInput = document.getElementById('initial-investment');
    initialInvestmentInput.addEventListener('input', debounce(function() {
        if (this.value < MIN_INVESTMENT) this.value = MIN_INVESTMENT;
        if (this.value > MAX_INVESTMENT) this.value = MAX_INVESTMENT;
        renderChart();
    }, 300));

    const yearsRange = document.getElementById('years-range');
    yearsRange.addEventListener('input', function(e) {
        this.nextElementSibling.textContent = formatToFarsiNumber(e.target.value) + ' سال';
        renderChart();
    });

    // Add debounce function
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Render chart immediately on load
    renderChart();
});
