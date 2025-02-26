

let currentSlide = 0;
const slides = document.querySelectorAll(".hero__slide");
const dots = document.querySelectorAll(".hero__dot");
const prevBtn = document.querySelector(".hero__btn--prev");
const nextBtn = document.querySelector(".hero__btn--next");
let slideInterval;

function showSlide(n) {
  slides.forEach((slide) => slide.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide].classList.add("active");
  dots[currentSlide].classList.add("active");
}

function startSlideShow() {
  slideInterval = setInterval(() => {
    showSlide(currentSlide + 1);
  }, 5000);
}

function stopSlideShow() {
  clearInterval(slideInterval);
}

prevBtn.addEventListener("click", () => {
  showSlide(currentSlide - 1);
  stopSlideShow();
  startSlideShow();
});

nextBtn.addEventListener("click", () => {
  showSlide(currentSlide + 1);
  stopSlideShow();
  startSlideShow();
});

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    stopSlideShow();
    startSlideShow();
  });
});

// Start the slideshow initially
startSlideShow();
showSlide(0);






                      // load footer and header






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

document.addEventListener('DOMContentLoaded', () => {
    loadHTML('/html/sections/header.html', 'header');
    loadHTML('/html/sections/footer.html', 'footer');
});





                    // load charts 







function loadChartFile(chartFilePath, scriptFilePath, containerId, initFunctionName) {
  fetch(chartFilePath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Could not load ${chartFilePath}: ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .then(htmlContent => {
      document.getElementById(containerId).innerHTML = htmlContent;

      // Dynamically load and execute the associated JavaScript file
      const script = document.createElement('script');
      script.src = scriptFilePath;
      script.onload = () => {
        if (typeof window[initFunctionName] === 'function') {
          window[initFunctionName](containerId);
        } else {
          console.warn(`Initialization function "${initFunctionName}" not found for ${scriptFilePath}`);
        }
      };
      script.onerror = () => {
        document.getElementById(containerId).innerHTML += 
          `<p style="color:red;">Error loading script: ${scriptFilePath}</p>`;
      };
      document.body.appendChild(script);
    })
    .catch(error => {
      document.getElementById(containerId).innerHTML = 
        `<p style="color:red;">Error loading chart: ${error.message}</p>`;
    });
}

/**
 * Load all chart files at once on page load.
 */
function loadAllCharts() {
  loadChartFile(
    'charts/production-capacity.html', 
    'charts/production-capacity.js', 
    'production-capacityContainer',
    'initializeProductionChart'
  );
  loadChartFile(
    'charts/roi.html', 
    'charts/roi.js', 
    'ROIContainer',
    'initializeROIChart'
  );
  loadChartFile(
    'charts/co-impact.html', 
    'charts/co2Impact.js', 
    'co2Container',
    'initializeCO2ImpactChart'
  );
  loadChartFile(
    'charts/share-holders.html', 
    'charts/share-holders.js', 
    'share-holdersContainer',
    'initializeShareHoldersChart'
  );
  // Load the new Gauge Chart
  loadChartFile(
    'charts/production-capacity-moment.html',
    'charts/production-capacity-moment.js',
    'production-capacity-momentContainer',
    'initializeProductionCapacityMomentChart'
  );
}

// Run after the page loads
window.addEventListener('DOMContentLoaded', loadAllCharts);
