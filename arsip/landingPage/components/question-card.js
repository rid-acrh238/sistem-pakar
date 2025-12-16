class CustomQuestionCard extends HTMLElement {
  connectedCallback() {
    const questionId = this.getAttribute('question-id');
    const questionText = this.getAttribute('question-text');
    const questionDesc = this.getAttribute('question-description');
    const currentIndex = parseInt(this.getAttribute('current-index'));
    const totalQuestions = parseInt(this.getAttribute('total-questions'));
    
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .option-item {
          transition: all 0.2s ease;
        }
        .option-item:hover {
          background-color: #f0f4ff;
          transform: scale(1.02);
        }
        .option-item.selected {
          background-color: #e0e7ff;
          border-color: #4f46e5;
        }
      </style>
      <div class="question-card bg-white p-6 rounded-xl shadow-md">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-semibold text-gray-800">Question ${currentIndex + 1} of ${totalQuestions}</h3>
          <span class="text-sm text-gray-500">DSM-V Criteria</span>
        </div>
        
        <h4 class="text-lg font-medium text-gray-800 mb-2">${questionText}</h4>
        <p class="text-gray-600 mb-6">${questionDesc}</p>
        
        <div class="space-y-3">
          <div class="option-item p-4 border border-gray-200 rounded-lg cursor-pointer" data-value="0">
            <div class="flex items-center">
              <div class="w-5 h-5 rounded-full border border-gray-300 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Not at all</span>
            </div>
          </div>
          
          <div class="option-item p-4 border border-gray-200 rounded-lg cursor-pointer" data-value="1">
            <div class="flex items-center">
              <div class="w-5 h-5 rounded-full border border-gray-300 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Several days</span>
            </div>
          </div>
          
          <div class="option-item p-4 border border-gray-200 rounded-lg cursor-pointer" data-value="2">
            <div class="flex items-center">
              <div class="w-5 h-5 rounded-full border border-gray-300 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">More than half the days</span>
            </div>
          </div>
          
          <div class="option-item p-4 border border-gray-200 rounded-lg cursor-pointer" data-value="3">
            <div class="flex items-center">
              <div class="w-5 h-5 rounded-full border border-gray-300 mr-3 flex-shrink-0"></div>
              <span class="text-gray-700">Nearly every day</span>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-between">
          <button id="prev-btn" class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}" ${currentIndex === 0 ? 'disabled' : ''}>
            Previous
          </button>
          <button id="next-btn" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
            ${currentIndex === totalQuestions - 1 ? 'Continue to Background Info' : 'Next'}
          </button>
        </div>
      </div>
      
      <script>
        feather.replace();
        
        // Option selection
        const optionItems = this.shadowRoot.querySelectorAll('.option-item');
        optionItems.forEach(item => {
          item.addEventListener('click', function() {
            optionItems.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('div').innerHTML = '<div class="w-5 h-5 rounded-full bg-indigo-600 border-4 border-indigo-100 mr-3 flex-shrink-0"></div>';
          });
        });
        
        // Navigation buttons
        this.shadowRoot.getElementById('prev-btn').addEventListener('click', () => {
          // Go to previous question
        });
        
        this.shadowRoot.getElementById('next-btn').addEventListener('click', () => {
          // Validate selection
          const selectedOption = this.shadowRoot.querySelector('.option-item.selected');
          if (!selectedOption) {
            alert('Please select an option before continuing');
            return;
          }
          
          // Save answer and proceed
          if (${currentIndex} === ${totalQuestions - 1}) {
            // Show demographics section
            document.getElementById('question-section').classList.add('hidden');
            document.getElementById('demographics-section').classList.remove('hidden');
          } else {
            // Show next question
            renderQuestion(${currentIndex} + 1);
          }
        });
      </script>
    `;
  }
}

customElements.define('custom-question-card', CustomQuestionCard);