document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavigation();
  initServiceCardGlows();
  initContactForm();
  initHeaderScroll();
  initHeroSculptureInteraction();
  initWorkFilters();
});

/* ==========================================================================
   1. Interactive Custom Cursor
   ========================================================================== */
function initCursor() {
  const cursor = document.getElementById('customCursor');
  const cursorDot = document.getElementById('customCursorDot');
  
  if (!cursor || !cursorDot) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor tracking using interpolation (lerp)
  function animateCursor() {
    // Large circle lag logic
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    // Inner dot tracking
    dotX += (mouseX - dotX) * 0.35;
    dotY += (mouseY - dotY) * 0.35;
    cursorDot.style.left = `${dotX}px`;
    cursorDot.style.top = `${dotY}px`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover states for interactive items
  const hoverElements = document.querySelectorAll('a, button, .service-card, .work-item, .form-input, .ticker-item, .process-step, .filter-btn, .menu-toggle');
  hoverElements.forEach(elem => {
    elem.addEventListener('mouseenter', () => {
      cursor.classList.add('cursor-hover');
    });
    elem.addEventListener('mouseleave', () => {
      cursor.classList.remove('cursor-hover');
    });
  });

  // Click / Active feedback micro-animations
  document.addEventListener('mousedown', () => {
    cursor.classList.add('cursor-clicking');
    cursorDot.classList.add('cursor-clicking');
  });

  document.addEventListener('mouseup', () => {
    cursor.classList.remove('cursor-clicking');
    cursorDot.classList.remove('cursor-clicking');
  });
}

/* ==========================================================================
   2. Seamless Section Navigation (SPA Router)
   ========================================================================== */
function navigateToSection(targetId) {
  const targetSection = document.getElementById(targetId);
  if (!targetSection) return;

  // Update Navigation Link Highlight
  document.querySelectorAll('.nav-link').forEach(nl => {
    const href = nl.getAttribute('href');
    if (!href) return;
    const hashIndex = href.indexOf('#');
    const linkTargetId = hashIndex !== -1 ? href.substring(hashIndex + 1) : '';
    
    if (linkTargetId === targetId) {
      nl.classList.add('active');
    } else {
      nl.classList.remove('active');
    }
  });

  // Find currently active section
  const activeSection = document.querySelector('section.active');
  
  if (activeSection && activeSection.id !== targetId) {
    // Fade out active section
    activeSection.classList.remove('visible');
    
    setTimeout(() => {
      activeSection.classList.remove('active');
      
      // Setup new section
      targetSection.classList.add('active');
      window.scrollTo(0, 0);
      
      // Small delay to trigger hardware-accelerated CSS transition
      setTimeout(() => {
        targetSection.classList.add('visible');
      }, 50);
    }, 400); // matching style.css transition speed
  } else if (!activeSection) {
    targetSection.classList.add('active');
    setTimeout(() => {
      targetSection.classList.add('visible');
    }, 50);
  }
}

function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link, #headerLogo, #hero-cta-contact, #hero-cta-work');
  const menuToggle = document.getElementById('menuToggle');
  const mainHeader = document.getElementById('mainHeader');

  if (menuToggle && mainHeader) {
    menuToggle.addEventListener('click', () => {
      mainHeader.classList.toggle('nav-open');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Close mobile navigation menu on click
      if (mainHeader) {
        mainHeader.classList.remove('nav-open');
      }

      // Target section ID retrieval safely extracting hash
      const href = link.getAttribute('href');
      if (!href) return;

      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      
      const targetId = href.substring(hashIndex + 1);
      if (!targetId) return;

      if (window.location.hash === '#' + targetId) {
        // Already on this section, scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.location.hash = '#' + targetId;
      }
    });
  });

  // Handle routing on hash change
  window.addEventListener('hashchange', () => {
    const targetId = window.location.hash.substring(1) || 'home';
    navigateToSection(targetId);
  });

  // Initial routing on page load
  const initialHash = window.location.hash.substring(1) || 'home';
  navigateToSection(initialHash);
}

/* ==========================================================================
   3. Service Cards Mouse Glow Spotlight Tracker
   ========================================================================== */
function initServiceCardGlows() {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    });
  });
}

/* ==========================================================================
   4. Form Validation & Simulation Handler
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form || !status) return;

  // Modal elements
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalActionBtn = document.getElementById('modalActionBtn');
  
  const closeModal = () => {
    if (successModal) {
      successModal.classList.remove('active');
    }
  };

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modalActionBtn) modalActionBtn.addEventListener('click', closeModal);
  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) closeModal();
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Disable inputs and button during sending
    const submitText = submitBtn.querySelector('span');
    const originalText = submitText.textContent;
    submitText.textContent = 'Sending...';
    submitBtn.style.pointerEvents = 'none';

    // Simulate Network Request
    setTimeout(() => {
      // Form values retrieval
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const phone = document.getElementById('form-phone').value;

      if (name && email && phone) {
        status.textContent = 'Inquiry successfully transmitted. We will contact you soon.';
        status.className = 'form-status success';
        
        // Reset fields
        form.reset();

        // Show premium success modal
        if (successModal) {
          successModal.classList.add('active');
        }
      } else {
        status.textContent = 'Please fill out all required fields correctly.';
        status.className = 'form-status error';
      }

      // Re-enable submit actions
      submitText.textContent = originalText;
      submitBtn.style.pointerEvents = 'auto';

      // Fade status out after duration
      setTimeout(() => {
        status.style.opacity = '0';
        setTimeout(() => {
          status.textContent = '';
          status.className = 'form-status';
          status.style.opacity = '1';
        }, 400);
      }, 5000);

    }, 1500);
  });
}

/* ==========================================================================
   5. Floating Header Scroll Animation Toggle
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   6. 3D Digital Sculpture Tilt Interaction
   ========================================================================== */
function initHeroSculptureInteraction() {
  const sculpture = document.getElementById('digitalSculpture');
  if (!sculpture) return;

  // Mouse tilt for desktop
  sculpture.addEventListener('mousemove', (e) => {
    if (window.innerWidth <= 768) return; // Disable tilt on mobile/touch screens
    const rect = sculpture.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Tilt calculations
    const rotateX = -y / 8;
    const rotateY = x / 8;
    
    sculpture.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  sculpture.addEventListener('mouseleave', () => {
    sculpture.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
  });

  // Touch tilt for mobile devices
  sculpture.addEventListener('touchmove', (e) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rect = sculpture.getBoundingClientRect();
    const x = touch.clientX - rect.left - rect.width / 2;
    const y = touch.clientY - rect.top - rect.height / 2;
    
    // Slightly more sensitive tilt on touch drags
    const rotateX = -y / 6;
    const rotateY = x / 6;
    
    sculpture.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  }, { passive: true });

  sculpture.addEventListener('touchend', () => {
    sculpture.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
  });
}

/* ==========================================================================
   7. Portfolio Category Filters
   ========================================================================== */
function initWorkFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workItems = document.querySelectorAll('.work-item');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle button active highlighting
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.style.borderBottomColor = 'transparent';
        b.style.color = 'var(--text-secondary)';
      });
      btn.classList.add('active');
      btn.style.borderBottomColor = 'var(--accent-cyan)';
      btn.style.color = 'var(--text-primary)';
      
      const filterValue = btn.getAttribute('data-filter');
      
      workItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          item.classList.remove('hidden');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1) translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95) translateY(10px)';
          setTimeout(() => {
            item.classList.add('hidden');
          }, 400);
        }
      });
    });
  });
}


