class CustomNavbar extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        .navbar {
          transition: all 0.3s ease;
        }
        .navbar.scrolled {
          @apply shadow-md bg-white/90 backdrop-blur-sm;
        }
        .nav-link {
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: 0;
          left: 0;
          background-color: #4f46e5;
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
      </style>
      <nav class="navbar fixed w-full z-50 py-4 px-6">
        <div class="container mx-auto flex justify-between items-center">
          <a href="index.html" class="flex items-center space-x-2">
            <i data-feather="activity" class="text-indigo-600"></i>
            <span class="text-xl font-bold text-indigo-600">MindSage</span>
          </a>
          
          <div class="hidden md:flex space-x-8">
            <a href="index.html" class="nav-link text-gray-700 hover:text-indigo-600">Home</a>
            <a href="about.html" class="nav-link text-gray-700 hover:text-indigo-600">About Us</a>
            <a href="test.html" class="nav-link text-gray-700 hover:text-indigo-600">Depression Test</a>
            <a href="resources.html" class="nav-link text-gray-700 hover:text-indigo-600">Resources</a>
          </div>
          
          <button class="md:hidden focus:outline-none" id="mobile-menu-button">
            <i data-feather="menu" class="text-gray-700"></i>
          </button>
        </div>
        
        <!-- Mobile menu -->
        <div class="md:hidden hidden bg-white shadow-lg rounded-lg mt-2 py-2" id="mobile-menu">
          <a href="index.html" class="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Home</a>
          <a href="about.html" class="block px-4 py-2 text-gray-700 hover:bg-indigo-50">About Us</a>
          <a href="test.html" class="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Depression Test</a>
          <a href="resources.html" class="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Resources</a>
        </div>
      </nav>
      
      <script>
        feather.replace();
        
        // Mobile menu toggle
        document.getElementById('mobile-menu-button').addEventListener('click', function() {
          const menu = document.getElementById('mobile-menu');
          menu.classList.toggle('hidden');
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', function() {
          const navbar = document.querySelector('.navbar');
          if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }
        });
      </script>
    `;
  }
}

customElements.define('custom-navbar', CustomNavbar);