class CustomFooter extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .footer-link {
          transition: all 0.2s ease;
        }
        .footer-link:hover {
          color: #4f46e5;
          transform: translateX(2px);
        }
      </style>
      <footer class="bg-gray-50 mt-24 py-12">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Column 1 -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-4">MindSage</h3>
              <p class="text-gray-600 mb-4">
                Empowering mental health through technology and expert knowledge.
              </p>
              <div class="flex space-x-4">
                <a href="#" class="text-gray-500 hover:text-indigo-600">
                  <i data-feather="facebook"></i>
                </a>
                <a href="#" class="text-gray-500 hover:text-indigo-600">
                  <i data-feather="twitter"></i>
                </a>
                <a href="#" class="text-gray-500 hover:text-indigo-600">
                  <i data-feather="instagram"></i>
                </a>
              </div>
            </div>
            
            <!-- Column 2 -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
              <ul class="space-y-2">
                <li><a href="index.html" class="footer-link text-gray-600">Home</a></li>
                <li><a href="about.html" class="footer-link text-gray-600">About Us</a></li>
                <li><a href="test.html" class="footer-link text-gray-600">Depression Test</a></li>
                <li><a href="resources.html" class="footer-link text-gray-600">Resources</a></li>
              </ul>
            </div>
            
            <!-- Column 3 -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Resources</h3>
              <ul class="space-y-2">
                <li><a href="#" class="footer-link text-gray-600">Mental Health Articles</a></li>
                <li><a href="#" class="footer-link text-gray-600">Therapist Directory</a></li>
                <li><a href="#" class="footer-link text-gray-600">Self-Help Tools</a></li>
                <li><a href="#" class="footer-link text-gray-600">Crisis Hotlines</a></li>
              </ul>
            </div>
            
            <!-- Column 4 -->
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
              <ul class="space-y-2">
                <li class="flex items-center text-gray-600">
                  <i data-feather="mail" class="mr-2"></i>
                  <span>contact@mindsage.com</span>
                </li>
                <li class="flex items-center text-gray-600">
                  <i data-feather="phone" class="mr-2"></i>
                  <span>+1 (800) 123-4567</span>
                </li>
                <li class="flex items-center text-gray-600">
                  <i data-feather="map-pin" class="mr-2"></i>
                  <span>Jakarta, Indonesia</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p class="text-gray-500 text-sm">
              © 2023 MindSage. All rights reserved.
            </p>
            <div class="flex space-x-6 mt-4 md:mt-0">
              <a href="#" class="text-gray-500 hover:text-indigo-600 text-sm">Privacy Policy</a>
              <a href="#" class="text-gray-500 hover:text-indigo-600 text-sm">Terms of Service</a>
              <a href="#" class="text-gray-500 hover:text-indigo-600 text-sm">Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define('custom-footer', CustomFooter);