class CustomHero extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .hero {
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(124, 58, 237, 0.1) 100%);
        }
      </style>
      <section class="hero rounded-3xl p-8 md:p-12 mt-16 fade-in">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Understanding Your Mental Health Journey
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            Our expert system helps identify potential symptoms of major depression based on DSM-V criteria. 
            Take the first step toward understanding your mental health.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <a href="test.html" class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-all duration-300">
              Start Free Test
            </a>
            <a href="#how-it-works" class="px-8 py-3 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium rounded-full transition-all duration-300">
              Learn More
            </a>
          </div>
        </div>
        
        <div class="mt-12 flex justify-center">
          <div class="relative w-full max-w-2xl">
            <img src="http://static.photos/wellness/1024x576/1" alt="Mental health illustration" class="rounded-xl shadow-lg w-full h-auto">
            <div class="absolute -bottom-4 -right-4 bg-white p-4 rounded-lg shadow-md">
              <div class="flex items-center">
                <div class="p-2 bg-indigo-100 rounded-full">
                  <i data-feather="shield" class="text-indigo-600"></i>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-700">Confidential & Secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('custom-hero', CustomHero);