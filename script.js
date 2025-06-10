document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.classList.add('mobile-menu-btn');
    document.querySelector('.main-content').prepend(mobileMenuBtn);
    
    const sidebar = document.querySelector('.sidebar');
    
    mobileMenuBtn.addEventListener('click', function() {
        sidebar.style.transform = sidebar.style.transform === 'translateX(0px)' ? 
            'translateX(-100%)' : 'translateX(0)';
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992 && 
            !sidebar.contains(e.target) && 
            e.target !== mobileMenuBtn && 
            !mobileMenuBtn.contains(e.target)) {
            sidebar.style.transform = 'translateX(-100%)';
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Active link highlighting
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.sidebar nav a').forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.parentElement.classList.add('active');
        }
    });
    
    // Search functionality: filtrar documentos en sidebar
    const input = document.querySelector('.search-box input');
    const button = document.querySelector('.search-box button');
    const listItems = document.querySelectorAll('.sidebar-section ul li');

    function filterDocuments() {
        const filter = input.value.toLowerCase();
        let visibleCount = 0;
        listItems.forEach(li => {
            const text = li.textContent.toLowerCase();
            const href = li.querySelector('a').getAttribute('href').toLowerCase();
            if (text.includes(filter) || href.includes(filter)) {
                li.style.display = '';
                visibleCount++;
            } else {
                li.style.display = 'none';
            }
        });
        if (visibleCount === 0) {
            if (!document.querySelector('.no-results')) {
                const ul = document.querySelector('.sidebar-section ul');
                const msg = document.createElement('li');
                msg.textContent = 'No se encontraron documentos.';
                msg.classList.add('no-results');
                ul.appendChild(msg);
            }
        } else {
            const msg = document.querySelector('.no-results');
            if (msg) msg.remove();
        }
    }

    button.addEventListener('click', filterDocuments);
    input.addEventListener('input', filterDocuments);
    
    // Card hover effects
    const cards = document.querySelectorAll('.article-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.card-icon').style.transform = 'rotate(10deg) scale(1.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.card-icon').style.transform = 'rotate(0) scale(1)';
        });
    });
});
