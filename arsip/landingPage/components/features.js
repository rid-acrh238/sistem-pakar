class CustomFeatures extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .feature-card {
          transition: all 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
        }
      </style>
      <section id="how-it-works" class="mt-24 fade-in">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">How Our Depression Screening Works</h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="feature-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg">
            <div class="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
              <i data-feather="edit-3" class="text-indigo-600"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Answer Questions</h3>
            <p class="text-gray-600">
              Complete our scientifically-validated questionnaire based on DSM-V criteria for major depression.
            </p>
          </div>
          
          <!-- Feature 2 -->
          <div class="feature-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg">
            <div class="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
              <i data-feather="cpu" class="text-indigo-600"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Expert Analysis</h3>
            <p class="text-gray-600">
              Our forward-chaining system evaluates your responses to identify potential depression symptoms.
            </p>
          </div>
          
          <!-- Feature 3 -->
          <div class="feature-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg">
            <div class="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
              <i data-feather="file-text" class="text-indigo-600"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">Get Results</h3>
            <p class="text-gray-600">
              Receive a detailed report with your screening results and personalized recommendations.
            </p>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('custom-features', CustomFeatures);