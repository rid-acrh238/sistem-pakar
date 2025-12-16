class CustomTestIntro extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .intro-card {
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
        }
      </style>
      <section id="test-intro" class="intro-card rounded-3xl p-8 md:p-12 mt-8 fade-in">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Major Depression Screening Test
          </h1>
          
          <div class="prose prose-indigo max-w-none text-gray-600 mb-8">
            <p>
              This questionnaire is based on the diagnostic criteria for Major Depressive Disorder from the Diagnostic and Statistical Manual of Mental Disorders (DSM-V). It assesses symptoms experienced over the last two weeks.
            </p>
            <p class="font-medium">
              Please note: This is not a diagnostic tool. Only a qualified mental health professional can diagnose depression.
            </p>
          </div>
          
          <div class="bg-indigo-50 border-l-4 border-indigo-400 p-4 mb-8">
            <div class="flex">
              <div class="flex-shrink-0">
                <i data-feather="info" class="text-indigo-600"></i>
              </div>
              <div class="ml-3">
                <p class="text-sm text-indigo-700">
                  Your responses are confidential. We don't store personal health information without your consent.
                </p>
              </div>
            </div>
          </div>
          
          <h2 class="text-xl font-semibold text-gray-800 mb-4">What to expect:</h2>
          <ul class="space-y-3 mb-8">
            <li class="flex items-start">
              <i data-feather="check-circle" class="text-indigo-500 mr-2 mt-0.5 flex-shrink-0"></i>
              <span class="text-gray-600">20 questions about your experiences over the last 2 weeks</span>
            </li>
            <li class="flex items-start">
              <i data-feather="check-circle" class="text-indigo-500 mr-2 mt-0.5 flex-shrink-0"></i>
              <span class="text-gray-600">Optional demographic and background information</span>
            </li>
            <li class="flex items-start">
              <i data-feather="check-circle" class="text-indigo-500 mr-2 mt-0.5 flex-shrink-0"></i>
              <span class="text-gray-600">Immediate results with recommendations</span>
            </li>
          </ul>
          
          <div class="text-center">
            <button id="start-test-btn" class="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Begin Test
            </button>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('custom-test-intro', CustomTestIntro);