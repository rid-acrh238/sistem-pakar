class CustomResultCard extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .severity-indicator {
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(to right, #10b981, #f59e0b, #ef4444);
        }
        .severity-marker {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          transform: translateX(-50%);
        }
        .resource-card:hover {
          transform: translateY(-5px);
        }
      </style>
      <div class="result-card bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
        <!-- Result header -->
        <div class="bg-indigo-600 px-6 py-8 text-center">
          <h2 class="text-2xl font-bold text-white mb-2">Your Depression Screening Results</h2>
          <p class="text-indigo-100">Based on DSM-V criteria for Major Depressive Disorder</p>
        </div>
        
        <!-- Disclaimer -->
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <i data-feather="alert-triangle" class="text-yellow-500"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                <strong>Important:</strong> This screening is not a diagnosis. Only a qualified mental health professional can diagnose depression. These results are for informational purposes only.
              </p>
            </div>
          </div>
        </div>
        
        <!-- Results content -->
        <div class="p-6 md:p-8">
          <!-- Severity scale -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Depression Severity</h3>
            <div class="relative mb-2">
              <div class="severity-indicator w-full"></div>
              <div class="severity-marker bg-white border-4 border-indigo-600 absolute top-1/2" style="left: 70%"></div>
            </div>
            <div class="flex justify-between text-sm text-gray-600">
              <span>Minimal</span>
              <span>Mild</span>
              <span>Moderate</span>
              <span>Severe</span>
            </div>
          </div>
          
          <!-- Result summary -->
          <div class="bg-indigo-50 rounded-lg p-6 mb-8">
            <h3 class="text-xl font-bold text-indigo-800 mb-3">Moderately Severe Depression</h3>
            <p class="text-gray-700 mb-4">
              Your responses suggest you may be experiencing moderately severe symptoms of depression. Several of your answers indicated that these symptoms have been present more than half the days or nearly every day over the last two weeks.
            </p>
            <p class="text-gray-700">
              This level of depression can significantly impact daily functioning and quality of life. Professional evaluation is recommended.
            </p>
          </div>
          
          <!-- Key symptoms -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Key Symptoms Reported</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <i data-feather="check-circle" class="text-indigo-500 mr-2 mt-0.5 flex-shrink-0"></i>
                <span class="text-gray-700">Depressed mood most of the day, nearly every day</span>
              </li>
              <li class="flex items-start">
                <i data-feather="check-circle" class="text-indigo-500 mr-2 mt-0.5 flex-shrink-0"></i>
                <span class="text-gray-700">Markedly diminished interest or pleasure in activities</span>
              </li>
              <li class="flex items-start">
                <i data-feather="check-circle" class="text-indigo-500 mr-2 mt-0.5 flex-shrink-0"></i>
                <span class="text-gray-700">Significant weight loss when not dieting</span>
              </li>
              <li class="flex items-start">
                <i data-feather="check-circle" class="text-indigo-500 mr-2 mt-0.5 flex-shrink-0"></i>
                <span class="text-gray-700">Insomnia nearly every day</span>
              </li>
            </ul>
          </div>
          
          <!-- Emergency warning (conditional) -->
          <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div class="flex">
              <div class="flex-shrink-0">
                <i data-feather="alert-octagon" class="text-red-500"></i>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Emergency Support Needed</h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>
                    Your responses indicated thoughts of self-harm or suicide. Please seek help immediately:
                  </p>
                  <ul class="list-disc pl-5 mt-2 space-y-1">
                    <li>Call emergency services: 112 (Indonesia)</li>
                    <li>Contact a trusted friend or family member</li>
                    <li>Reach out to a mental health professional</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Recommendations -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Recommended Next Steps</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h4 class="font-medium text-indigo-700 mb-2 flex items-center">
                  <i data-feather="user" class="mr-2"></i>
                  Professional Help
                </h4>
                <p class="text-gray-600 text-sm mb-3">
                  Consider consulting with a mental health professional for a comprehensive evaluation.
                </p>
                <a href="#" class="text-indigo-600 text-sm font-medium inline-flex items-center">
                  Find a therapist near you
                  <i data-feather="arrow-right" class="ml-1 w-4 h-4"></i>
                </a>
              </div>
              <div class="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <h4 class="font-medium text-indigo-700 mb-2 flex items-center">
                  <i data-feather="book" class="mr-2"></i>
                  Self-Help Resources
                </h4>
                <p class="text-gray-600 text-sm mb-3">
                  Explore evidence-based strategies to manage depressive symptoms.
                </p>
                <a href="#" class="text-indigo-600 text-sm font-medium inline-flex items-center">
                  View resources
                  <i data-feather="arrow-right" class="ml-1 w-4 h-4"></i>
                </a>
              </div>
            </div>
          </div>
          
          <!-- Healthcare providers -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Recommended Healthcare Providers in Indonesia</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Provider 1 -->
              <div class="resource-card bg-white border border-gray-200 rounded-lg p-5 shadow-sm transition-all duration-300">
                <div class="flex items-start">
                  <img src="http://static.photos/medical/120x120/1" alt="Hospital" class="w-12 h-12 rounded-lg object-cover mr-4">
                  <div>
                    <h4 class="font-medium text-gray-800">RSJ Dr. Soeharto Heerdjan</h4>
                    <p class="text-gray-600 text-sm mb-2">Mental Health Hospital</p>
                    <div class="flex items-center text-sm text-gray-500">
                      <i data-feather="map-pin" class="mr-1 w-4 h-4"></i>
                      <span>Jakarta</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-500 mt-1">
                      <i data-feather="phone" class="mr-1 w-4 h-4"></i>
                      <span>(021) 5682841</span>
                    </div>
                    <div class="mt-3">
                      <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Approx. IDR 150,000-300,000</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Provider 2 -->
              <div class="resource-card bg-white border border-gray-200 rounded-lg p-5 shadow-sm transition-all duration-300">
                <div class="flex items-start">
                  <img src="http://static.photos/medical/120x120/2" alt="Clinic" class="w-12 h-12 rounded-lg object-cover mr-4">
                  <div>
                    <h4 class="font-medium text-gray-800">Into The Light Indonesia</h4>
                    <p class="text-gray-600 text-sm mb-2">Mental Health Support</p>
                    <div class="flex items-center text-sm text-gray-500">
                      <i data-feather="map-pin" class="mr-1 w-4 h-4"></i>
                      <span>Online Services</span>
                    </div>
                    <div class="flex items-center text-sm text-gray-500 mt-1">
                      <i data-feather="phone" class="mr-1 w-4 h-4"></i>
                      <span>0822 9823 0033</span>
                    </div>
                    <div class="mt-3">
                      <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Free - IDR 200,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Footer actions -->
        <div class="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center">
          <p class="text-sm text-gray-500 mb-3 sm:mb-0">
            Test completed on ${new Date().toLocaleDateString()}
          </p>
          <div class="space-x-3">
            <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium">
              <i data-feather="download" class="mr-1 w-4 h-4 inline"></i>
              Download Results
            </button>
            <button class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">
              <i data-feather="share-2" class="mr-1 w-4 h-4 inline"></i>
              Share with Doctor
            </button>
          </div>
        </div>
      </div>
      
      <script>
        feather.replace();
      </script>
    `;
  }
}

customElements.define('custom-result-card', CustomResultCard);