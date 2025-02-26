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
    // Load Header and Footer
    loadHTML('/public/sections/header.html', 'header-placeholder');
    loadHTML('/public/sections/footer.html', 'footer-placeholder');

    // Load dynamic content
    loadBasicArticles();
    loadWebinars();
    loadCalculators();

    // Handle view more buttons
    document.querySelectorAll('.view-more-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.source-section');
            loadMoreContent(section.id);
        });
    });

    // Updated ROI Calculator Popup Functionality
    const roiCalculator = document.getElementById('roiCalculator');
    const roiButton = document.querySelector('.roi-calculator .use-tool-btn');
    const closeCalculator = document.querySelector('.close-calculator');
    const calculateBtn = document.querySelector('.calculate-btn');

    roiButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        roiCalculator.classList.add('active');
    });

    const closeCalculatorPopup = () => {
        document.body.style.overflow = '';
        roiCalculator.classList.remove('active');
    };

    closeCalculator.addEventListener('click', closeCalculatorPopup);

    // Close on outside click
    roiCalculator.addEventListener('click', (e) => {
        if (e.target === roiCalculator) {
            closeCalculatorPopup();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && roiCalculator.classList.contains('active')) {
            closeCalculatorPopup();
        }
    });

    // Calculate ROI
    calculateBtn.addEventListener('click', calculateROI);

    // Mode switching functionality
    const modeBtns = document.querySelectorAll('.mode-btn');
    const simpleForm = document.getElementById('simpleForm');
    const advancedForm = document.getElementById('advancedForm');

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            
            // Update active button
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show/hide forms
            simpleForm.style.display = mode === 'simple' ? 'block' : 'none';
            advancedForm.style.display = mode === 'advanced' ? 'block' : 'none';
            
            // Clear results
            document.getElementById('annualIncome').textContent = '- - -';
            document.getElementById('paybackPeriod').textContent = '- - -';
            document.getElementById('irr').textContent = '- - -';
        });
    });

    // Find both calculate buttons and attach event listeners
    const calculateButtons = document.querySelectorAll('.calculate-btn');
    calculateButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const isSimpleMode = document.querySelector('.mode-btn[data-mode="simple"]').classList.contains('active');
            if (isSimpleMode) {
                calculateSimpleROI();
            } else {
                calculateAdvancedROI();
            }
        });
    });

    // Add to existing DOMContentLoaded handler
    const energyCalculator = document.getElementById('energyCalculator');
    const energyButton = document.querySelector('.energy-calculator .use-tool-btn');
    const closeEnergyCalculator = energyCalculator.querySelector('.close-calculator');
    
    energyButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.overflow = 'hidden';
        energyCalculator.classList.add('active');
    });

    closeEnergyCalculator.addEventListener('click', () => {
        document.body.style.overflow = '';
        energyCalculator.classList.remove('active');
    });

    // Close on outside click
    energyCalculator.addEventListener('click', (e) => {
        if (e.target === energyCalculator) {
            document.body.style.overflow = '';
            energyCalculator.classList.remove('active');
        }
    });

    // Calculate Energy Production
    energyCalculator.querySelector('.calculate-btn').addEventListener('click', calculateEnergyProduction);

    // Environmental Calculator Setup
    const environmentalCalculator = document.getElementById('environmentalCalculator');
    const environmentalButton = document.querySelector('.environmental-calculator .use-tool-btn');
    const closeEnvironmentalCalculator = environmentalCalculator.querySelector('.close-calculator');
    
    environmentalButton.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.overflow = 'hidden';
        environmentalCalculator.classList.add('active');
        
        // Auto-calculate production if capacity is set
        const capacity = document.getElementById('env-capacity').value;
        if (capacity) {
            calculateEstimatedProduction(capacity);
        }
    });

    closeEnvironmentalCalculator.addEventListener('click', () => {
        document.body.style.overflow = '';
        environmentalCalculator.classList.remove('active');
    });

    // Close on outside click
    environmentalCalculator.addEventListener('click', (e) => {
        if (e.target === environmentalCalculator) {
            document.body.style.overflow = '';
            environmentalCalculator.classList.remove('active');
        }
    });

    // Auto-calculate production when capacity changes
    document.getElementById('env-capacity').addEventListener('input', (e) => {
        calculateEstimatedProduction(e.target.value);
    });

    // Calculate Environmental Impact
    environmentalCalculator.querySelector('.calculate-btn').addEventListener('click', calculateEnvironmentalImpact);
});

function loadMoreContent(sectionId) {
    // Add logic to load more content for each section
    console.log(`Loading more content for ${sectionId}`);
}

function loadBasicArticles() {
    const basicsGrid = document.querySelector('#basics-section .sources-grid');
    // Add dynamic content loading logic
}

function loadWebinars() {
    const webinarsGrid = document.querySelector('#webinars-section .sources-grid');
    // Add dynamic content loading logic
}

function loadCalculators() {
    const toolsGrid = document.querySelector('#tools-section .sources-grid');
    // Add dynamic content loading logic
}

function calculateROI() {
    // Get values from the active form (simple or advanced)
    const isSimpleMode = document.querySelector('.mode-btn[data-mode="simple"]').classList.contains('active');
    
    if (isSimpleMode) {
        calculateSimpleROI();
    } else {
        calculateAdvancedROI();
    }
}

function calculateSimpleROI() {
    const capacity = parseFloat(document.getElementById('capacity-simple').value) || 0;
    const location = document.getElementById('location-simple').value;
    
    // Sun hours based on location
    const sunHours = {
        high: 6.5,
        medium: 5.5,
        low: 4.5
    };
    
    // Calculate annual production (kWh)
    const avgDailySunHours = sunHours[location];
    const annualProduction = capacity * avgDailySunHours * 365;
    
    // Financial calculations
    const costPerKw = 15000000; // 15 million tomans per kW
    const totalCost = capacity * costPerKw;
    const tariffRate = 2000; // tomans per kWh
    const annualIncome = (annualProduction * tariffRate);
    const paybackPeriod = totalCost / annualIncome;
    const roi = (annualIncome / totalCost) * 100;

    // Update results
    updateResults({
        annualIncome: annualIncome / 1000000, // Convert to million tomans
        paybackPeriod: paybackPeriod,
        roi: roi,
        annualProduction: annualProduction,
        co2Reduction: annualProduction * 0.7
    });
}

function calculateAdvancedROI() {
    // Get all values from advanced form
    const capacity = parseFloat(document.getElementById('capacity-adv').value) || 0;
    const location = document.getElementById('location-adv').value;
    const panelCost = parseFloat(document.getElementById('panel-cost').value) || 0;
    const inverterCost = parseFloat(document.getElementById('inverter-cost').value) || 0;
    const installationCost = parseFloat(document.getElementById('installation-cost').value) || 0;
    const tariffRate = parseFloat(document.getElementById('tariff-rate').value) || 0;
    const inflationRate = parseFloat(document.getElementById('inflation-rate').value) || 0;
    const systemLifespan = parseFloat(document.getElementById('system-lifespan').value) || 25;
    const financingType = document.getElementById('financing-type').value;
    const loanInterest = parseFloat(document.getElementById('loan-interest').value) || 0;
    const loanTerm = parseFloat(document.getElementById('loan-term').value) || 5;

    // Calculate total system cost
    const totalCost = (panelCost + inverterCost + installationCost) * capacity;

    // Calculate annual production based on location
    const sunHours = {
        high: 6.5,
        medium: 5.5,
        low: 4.5
    };
    const avgDailySunHours = sunHours[location];
    const annualProduction = capacity * avgDailySunHours * 365; // kWh per year

    // Calculate annual income (in millions of tomans)
    const annualIncome = (annualProduction * tariffRate) / 1000000;

    // Calculate annual maintenance cost (2% of total cost)
    const annualMaintenance = totalCost * 0.02;

    // Calculate loan payments if applicable
    let annualLoanPayment = 0;
    if (financingType === 'loan') {
        const monthlyRate = loanInterest / 1200; // Convert annual rate to monthly decimal
        const numberOfPayments = loanTerm * 12;
        const monthlyPayment = (totalCost * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        annualLoanPayment = monthlyPayment * 12;
    }

    // Calculate net annual income
    const netAnnualIncome = annualIncome - annualMaintenance - annualLoanPayment;

    // Calculate simple payback period
    const paybackPeriod = totalCost / netAnnualIncome;

    // Calculate IRR using projected cash flows
    const cashFlows = [-totalCost];
    for (let i = 1; i <= systemLifespan; i++) {
        const inflatedIncome = netAnnualIncome * Math.pow(1 + (inflationRate / 100), i);
        cashFlows.push(inflatedIncome);
    }
    const irr = calculateIRR(cashFlows) * 100;

    // Update results display
    document.getElementById('annualIncome').textContent = `${netAnnualIncome.toFixed(1)} میلیون تومان`;
    document.getElementById('paybackPeriod').textContent = `${paybackPeriod.toFixed(1)} سال`;
    document.getElementById('irr').textContent = `${irr.toFixed(1)}٪`;
}

// Helper function to calculate IRR
function calculateIRR(cashFlows, guess = 0.1) {
    const maxIterations = 100;
    const tolerance = 0.0001;
    
    for (let i = 0; i < maxIterations; i++) {
        const npv = cashFlows.reduce((acc, val, idx) => 
            acc + val / Math.pow(1 + guess, idx), 0);
            
        if (Math.abs(npv) < tolerance) {
            return guess;
        }
        
        const derivativeNPV = cashFlows.reduce((acc, val, idx) => 
            acc - idx * val / Math.pow(1 + guess, idx + 1), 0);
            
        guess = guess - npv / derivativeNPV;
    }
    
    return guess;
}

// Toggle loan details visibility
document.getElementById('financing-type').addEventListener('change', function() {
    const loanDetails = document.querySelectorAll('.loan-details');
    loanDetails.forEach(detail => {
        detail.style.display = this.value === 'loan' ? 'block' : 'none';
    });
});

function resetResults() {
    document.querySelector('.result-items').innerHTML = '';
}

function updateResults(data) {
    document.getElementById('annualIncome').textContent = `${data.annualIncome.toFixed(1)} میلیون تومان`;
    document.getElementById('paybackPeriod').textContent = `${data.paybackPeriod.toFixed(1)} سال`;
    document.getElementById('irr').textContent = `${data.roi.toFixed(1)}٪`;
}

// Add tab switching functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const tabId = btn.dataset.tab;
        document.getElementById('basicForm').style.display = tabId === 'basic' ? 'block' : 'none';
        document.getElementById('advancedForm').style.display = tabId === 'advanced' ? 'block' : 'none';
    });
});

// Mode switching functionality
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const mode = btn.dataset.mode;
        document.getElementById('simpleForm').style.display = mode === 'simple' ? 'block' : 'none';
        document.getElementById('advancedForm').style.display = mode === 'advanced' ? 'block' : 'none';
        
        // Reset results when switching modes
        resetResults();
    });
});

function calculateEnergyProduction() {
    const capacity = parseFloat(document.getElementById('energy-capacity').value) || 0;
    const location = document.getElementById('energy-location').value;
    const angle = parseFloat(document.getElementById('panel-angle').value) || 30;
    const efficiency = parseFloat(document.getElementById('panel-efficiency').value) || 20;

    // Sun hours based on location and optimized angle
    const sunHours = {
        high: 6.5,
        medium: 5.5,
        low: 4.5
    };

    // Angle efficiency factor (simplified)
    const angleEfficiencyFactor = Math.cos((30 - angle) * Math.PI / 180);
    
    // Calculate daily production (kWh)
    const dailyProduction = capacity * sunHours[location] * (efficiency/100) * angleEfficiencyFactor;
    const monthlyProduction = dailyProduction * 30;
    const yearlyProduction = dailyProduction * 365;

    // Environmental impact
    const co2Reduction = yearlyProduction * 0.7; // 0.7 kg CO2 per kWh
    const treeEquivalent = co2Reduction * 0.05; // 1 tree absorbs about 20kg CO2 per year

    // Update results
    document.getElementById('dailyProduction').textContent = `${dailyProduction.toFixed(1)} کیلووات ساعت`;
    document.getElementById('monthlyProduction').textContent = `${monthlyProduction.toFixed(1)} کیلووات ساعت`;
    document.getElementById('yearlyProduction').textContent = `${yearlyProduction.toFixed(1)} کیلووات ساعت`;
    document.getElementById('co2Reduction').textContent = `${co2Reduction.toFixed(1)} کیلوگرم`;
    document.getElementById('treeEquivalent').textContent = `${Math.round(treeEquivalent)} اصله درخت`;
}

function calculateEstimatedProduction(capacity) {
    // Estimate annual production (simplified calculation)
    const avgDailySunHours = 5.5; // Average for Iran
    const efficiencyFactor = 0.75; // Account for various losses
    const annualProduction = capacity * avgDailySunHours * 365 * efficiencyFactor;
    document.getElementById('env-production').value = Math.round(annualProduction);
}

function calculateEnvironmentalImpact() {
    const capacity = parseFloat(document.getElementById('env-capacity').value) || 0;
    const annualProduction = parseFloat(document.getElementById('env-production').value) || 0;
    const lifespan = parseFloat(document.getElementById('env-lifespan').value) || 25;

    // Environmental impact calculations
    const co2PerKWh = 0.7; // kg CO2 per kWh
    const treesPerTonCO2 = 50; // trees per ton of CO2
    const litersWaterPerMWh = 2000; // liters of water saved per MWh
    const litersOilPerMWh = 220; // liters of oil equivalent per MWh

    // Annual calculations
    const annualCO2Reduction = (annualProduction * co2PerKWh) / 1000; // tons
    const lifetimeCO2Reduction = annualCO2Reduction * lifespan;
    const treesEquivalent = Math.round(annualCO2Reduction * treesPerTonCO2);
    const waterSaved = (annualProduction / 1000) * litersWaterPerMWh; // MWh * liters/MWh
    const fuelSaved = (annualProduction / 1000) * litersOilPerMWh; // MWh * liters/MWh

    // Update results
    document.getElementById('co2Annual').textContent = `${annualCO2Reduction.toFixed(1)} تن`;
    document.getElementById('co2Lifetime').textContent = `${lifetimeCO2Reduction.toFixed(1)} تن`;
    document.getElementById('treeEquivalent').textContent = `${treesEquivalent} اصله درخت`;
    document.getElementById('waterSaved').textContent = `${Math.round(waterSaved).toLocaleString()} لیتر`;
    document.getElementById('fuelSaved').textContent = `${Math.round(fuelSaved).toLocaleString()} لیتر`;
}
