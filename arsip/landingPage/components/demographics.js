class CustomDemographicsForm extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .form-section {
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
        }
        .checkbox-item:hover {
          background-color: #f0f4ff;
        }
      </style>
      <div class="form-section rounded-3xl p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Additional Information</h2>
        <p class="text-gray-600 mb-8">These optional questions help us better understand mental health trends. All information is anonymous.</p>
        
        <form class="space-y-8">
          <!-- Reason for taking test -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">What are your main reasons for taking this test? (Select up to 3)</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label class="checkbox-item flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                <span class="ml-3 text-gray-700">Concerned about my mental health</span>
              </label>
              <label class="checkbox-item flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                <span class="ml-3 text-gray-700">Doctor/therapist suggested it</span>
              </label>
              <label class="checkbox-item flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                <span class="ml-3 text-gray-700">Curious about depression</span>
              </label>
              <label class="checkbox-item flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                <span class="ml-3 text-gray-700">For academic/research purposes</span>
              </label>
              <label class="checkbox-item flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                <span class="ml-3 text-gray-700">Supporting someone else</span>
              </label>
            </div>
          </div>
          
          <!-- Who is this test for -->
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Are you taking this test for yourself or someone else?</h3>
            <div class="flex flex-col sm:flex-row gap-4">
              <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                <input type="radio" name="test-for" class="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" checked>
                <span class="ml-3 text-gray-700">For myself</span>
              </label>
              <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                <input type="radio" name="test-for" class="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                <span class="ml-3 text-gray-700">For someone else</span>
              </label>
            </div>
          </div>
          
          <!-- About You section -->
          <div class="space-y-6">
            <h3 class="text-xl font-semibold text-gray-800">About You</h3>
            
            <!-- Age range -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Age range</label>
              <select class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option>Under 18</option>
                <option>18-24</option>
                <option>25-34</option>
                <option>35-44</option>
                <option>45-54</option>
                <option>55-64</option>
                <option>65+</option>
              </select>
            </div>
            
            <!-- Gender -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-1">
                <label class="flex items-center">
                  <input type="radio" name="gender" class="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                  <span class="ml-2 text-gray-700">Male</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" name="gender" class="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                  <span class="ml-2 text-gray-700">Female</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" name="gender" class="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                  <span class="ml-2 text-gray-700">Non-binary</span>
                </label>
                <label class="flex items-center">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                  <span class="ml-2 text-gray-700">Transgender</span>
                </label>
              </div>
            </div>
            
            <!-- Income -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Income level (optional)</label>
              <select class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option>Prefer not to say</option>
                <option>Less than IDR 3,000,000/month</option>
                <option>IDR 3,000,000 - 6,000,000/month</option>
                <option>IDR 6,000,000 - 10,000,000/month</option>
                <option>More than IDR 10,000,000/month</option>
              </select>
            </div>
            
            <!-- Location -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Do you live in Indonesia?</label>
              <div class="flex flex-col sm:flex-row gap-4 mt-1">
                <label class="flex items-center">
                  <input type="radio" name="indonesia" class="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" checked>
                  <span class="ml-2 text-gray-700">Yes</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" name="indonesia" class="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                  <span class="ml-2 text-gray-700">No</span>
                </label>
              </div>
              <div id="country-field" class="mt-3 hidden">
                <label class="block text-sm font-medium text-gray-700 mb-1">Which country do you live in?</label>
                <input type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
              </div>
            </div>
            
            <!-- Zip code -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Zip/Postal code (optional)</label>
              <input type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            </div>
            
            <!-- Population group -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Which group best describes you? (optional)</label>
              <select class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option>Select an option</option>
                <option>Student</option>
                <option>Working professional</option>
                <option>Unemployed</option>
                <option>Retired</option>
                <option>Homemaker</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          
          <!-- Mental health history -->
          <div class="space-y-6">
            <h3 class="text-xl font-semibold text-gray-800">Your Mental Health History</h3>
            
            <!-- Received mental health support -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Have you ever received mental health treatment or support?</label>
              <div class="flex flex-col sm:flex-row gap-4 mt-1">
                <label class="flex items-center">
                  <input type="radio" name="treatment" class="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                  <span class="ml-2 text-gray-700">Yes, currently receiving</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" name="treatment" class="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                  <span class="ml-2 text-gray-700">Yes, in the past</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" name="treatment" class="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                  <span class="ml-2 text-gray-700">No, never</span>
                </label>
              </div>
            </div>
            
            <!-- Contributing factors -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">What are the main factors contributing to your current mental health? (Select up to 3)</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                <label class="checkbox-item flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                  <span class="ml-3 text-gray-700">Work/school stress</span>
                </label>
                <label class="checkbox-item flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                  <span class="ml-3 text-gray-700">Relationship issues</span>
                </label>
                <label class="checkbox-item flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                  <span class="ml-3 text-gray-700">Financial problems</span>
                </label>
                <label class="checkbox-item flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                  <span class="ml-3 text-gray-700">Family issues</span>
                </label>
                <label class="checkbox-item flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                  <span class="ml-3 text-gray-700">Health problems</span>
                </label>
                <label class="checkbox-item flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                  <span class="ml-3 text-gray-700">Traumatic event</span>
                </label>
              </div>
            </div>
            
            <!-- Physical health history -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Do you have any physical health conditions?</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                <label class="checkbox-item flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                  <span class="ml-3 text-gray-700">Diabetes</span>
                </label>
                <label class="checkbox-item flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                  <span class="ml-3 text-gray-700">Heart disease</span>
                </label>
                <label class="checkbox-item flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                  <span class="ml-3 text-gray-700">Chronic pain</span>
                </label>
                <label class="checkbox-item flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                  <span class="ml-3 text-gray-700">Thyroid disorder</span>
                </label>
                <label class="checkbox-item flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="checkbox" class="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500">
                  <span class="ml-3 text-gray-700">Other</span>
                </label>
              </div>
              <div id="other-health-desc" class="mt-3 hidden">
                <label class="block text-sm font-medium text-gray-700 mb-1">Please describe</label>
                <textarea rows="2" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
              </div>
            </div>
            
            <!-- Pets -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Do you have pets that support your mental health?</label>
              <div class="flex flex-col sm:flex-row gap-4 mt-1">
                <label class="flex items-center">
                  <input type="radio" name="pets" class="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                  <span class="ml-2 text-gray-700">Yes</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" name="pets" class="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                  <span class="ml-2 text-gray-700">No</span>
                </label>
                <label class="flex items-center">
                  <input type="radio" name="pets" class="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500">
                  <span class="ml-2 text-gray-700">I wish I had</span>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <script>
        feather.replace();
        
        // Show country field if not in Indonesia
        this.shadowRoot.querySelectorAll('input[name="indonesia"]').forEach(radio => {
          radio.addEventListener('change', function() {
            const countryField = this.shadowRoot.getElementById('country-field');
            if (this.value === 'no') {
              countryField.classList.remove('hidden');
            } else {
              countryField.classList.add('hidden');
            }
          });
        });
        
        // Show other health description if "Other" is checked
        this.shadowRoot.querySelectorAll('.form-checkbox').forEach(checkbox => {
          checkbox.addEventListener('change', function() {
            if (this.nextElementSibling.textContent === 'Other') {
              const descField = this.shadowRoot.getElementById('other-health-desc');
              if (this.checked) {
                descField.classList.remove('hidden');
              } else {
                descField.classList.add('hidden');
              }
            }
          });
        });
      </script>
    `;
  }
}

customElements.define('custom-demographics-form', CustomDemographicsForm);