document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------
     GSAP & SCROLL TRIGGER SETUP
  ---------------------------------------------------- */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Scroll reveal animations
    gsap.utils.toArray('.reveal').forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        delay: (i % 3) * 0.08
      });
    });

    // Animated count-up stats
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = +el.getAttribute('data-count');
      ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () => {
          let countObj = { val: 0 };
          gsap.to(countObj, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = Math.floor(countObj.val);
            }
          });
        }
      });
    });
  } else {
    // Fallback if GSAP is blocked or fails to load
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('[data-count]').forEach(el => {
      el.textContent = el.getAttribute('data-count');
    });
  }

  /* ----------------------------------------------------
     SCROLL PROGRESS BAR
  ---------------------------------------------------- */
  const progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        const scrolled = (window.scrollY / docHeight) * 100;
        progressBar.style.width = scrolled + '%';
      }
    });
  }

  /* ----------------------------------------------------
     DARK & LIGHT THEME TOGGLE
  ---------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');

  function updateIcons(theme) {
    if (theme === 'dark') {
      if (sunIcon) sunIcon.style.display = 'block';
      if (moonIcon) moonIcon.style.display = 'none';
    } else {
      if (sunIcon) sunIcon.style.display = 'none';
      if (moonIcon) moonIcon.style.display = 'block';
    }
  }

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem('bp-theme') || 'light';
  if (savedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    updateIcons('dark');
  } else {
    root.removeAttribute('data-theme');
    updateIcons('light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        root.removeAttribute('data-theme');
        localStorage.setItem('bp-theme', 'light');
        updateIcons('light');
      } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('bp-theme', 'dark');
        updateIcons('dark');
      }
    });
  }

  /* ----------------------------------------------------
     MOBILE HAMBURGER MENU
  ---------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileNav.setAttribute('aria-hidden', !isOpen);
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ----------------------------------------------------
     "ABOUT ME" MODAL HANDLER
  ---------------------------------------------------- */
  const readMoreBtn = document.getElementById('read-more-btn');
  const aboutModal = document.getElementById('about-modal');
  const modalClose = document.getElementById('modal-close');

  if (readMoreBtn && aboutModal && modalClose) {
    readMoreBtn.addEventListener('click', () => {
      aboutModal.classList.add('open');
      aboutModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Stop background scrolling
    });

    const closeModal = () => {
      aboutModal.classList.remove('open');
      aboutModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);
    aboutModal.addEventListener('click', (e) => {
      if (e.target === aboutModal) closeModal();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && aboutModal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  /* ----------------------------------------------------
     MASONRY GALLERY & LIGHTBOX
  ---------------------------------------------------- */
  const categories = ['Research', 'Conferences', 'Teaching', 'Events', 'Books', 'Certificates', 'Writing'];
  const masonry = document.getElementById('masonry');
  const lightbox = document.getElementById('lightbox');
  const lbClose = document.getElementById('lb-close');
  const lbInner = document.getElementById('lb-inner');

  // Realistic gallery photo arrays based on user uploads
  const galleryItems = [
    { img: 'assets/gallery1.jpg', cat: 'Teaching', title: 'Faculty Presentation Ceremony', desc: 'Award plaque presentation at Chellammal College.', ar: 1.35 },
    { img: 'assets/gallery2.jpg', cat: 'Events', title: 'Steering Committee Panel', desc: 'Chairs and faculty members coordinating the student literary festival.', ar: 1.35 },
    { img: 'assets/gallery3.jpg', cat: 'Conferences', title: 'Symposium Speech', desc: 'Brundavanam P. speaking on digital storytelling paradigms.', ar: 1.35 },
    { img: 'assets/gallery4.jpg', cat: 'Teaching', title: 'Chellammal Student Assembly', desc: 'A group photo capturing active student engagement in literary programs.', ar: 1.35 },
    { img: 'assets/gallery5.jpg', cat: 'Events', title: 'Panel Coordination Steer', desc: 'Coordinating student groups and literary presentations.', ar: 1.35 },
    { img: 'assets/gallery6.jpg', cat: 'Events', title: 'Steering Committee Session', desc: 'Coordinating events and reviewing student literary entries.', ar: 1.35 }
  ];

  if (masonry) {
    galleryItems.forEach((item, index) => {
      const gCard = document.createElement('div');
      gCard.className = 'g-item';
      gCard.dataset.cat = item.cat;
      
      const contentHtml = item.img 
        ? `<img src="${item.img}" alt="${item.title}" class="ph" style="--ar: ${item.ar}; object-fit: cover; width:100%; height:auto;" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
           <div class="ph-fallback" style="display:none; --ar: ${item.ar}; width:100%; height:180px; align-items:center; justify-content:center; background:linear-gradient(135deg, var(--sage), var(--burgundy)); color:#fff; font-family:var(--garamond); font-style:italic;">${item.cat} Archive</div>`
        : `<div class="ph" style="--ar: ${item.ar};" role="img" aria-label="${item.title}">${item.cat} Archive</div>`;

      gCard.innerHTML = `
        ${contentHtml}
        <div class="cap">
          <h5>${item.title}</h5>
          <p>${item.desc}</p>
        </div>
      `;

      gCard.addEventListener('click', () => {
        if (lbInner && lightbox) {
          lbInner.innerHTML = item.img 
            ? `<div style="text-align: center; max-width:90%; margin:0 auto;">
                 <img src="${item.img}" style="max-width:100%; max-height:65vh; object-fit:contain; border: 1px solid rgba(255,255,255,0.15); margin-bottom:1em;" alt="${item.title}">
                 <h3 style="font-family: var(--serif); font-size: 1.6rem; color: #fff; margin-bottom: 0.2em;">${item.title}</h3>
                 <p style="font-family: var(--garamond); font-style: italic; font-size: 1.1rem; color: var(--gold);">${item.cat} Archive</p>
                 <p style="font-size: 0.9rem; max-width: 50ch; opacity: 0.8; margin: 0.5em auto 0;">${item.desc}</p>
               </div>`
            : `<div style="text-align: center; padding: 2.5em;">
                 <h3 style="font-family: var(--serif); font-size: 2.2rem; color: #fff; margin-bottom: 0.5em;">${item.title}</h3>
                 <p style="font-family: var(--garamond); font-style: italic; font-size: 1.25rem; color: var(--gold);">${item.cat} Exhibition</p>
                 <div style="margin: 1.5em 0; width: 100px; height: 1px; background: var(--gold); display: inline-block;"></div>
                 <p style="font-size: 0.95rem; max-width: 45ch; opacity: 0.8; line-height: 1.6; margin: 0 auto;">${item.desc}</p>
               </div>`;
          lightbox.classList.add('open');
          lightbox.setAttribute('aria-hidden', 'false');
        }
      });

      masonry.appendChild(gCard);
    });

    // Gallery Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterVal = btn.dataset.filter;
        document.querySelectorAll('.g-item').forEach(item => {
          if (filterVal === 'all' || item.dataset.cat === filterVal) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Lightbox close
  if (lightbox && lbClose) {
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
    };

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.id === 'lightbox') closeLightbox();
    });
  }

  /* ----------------------------------------------------
     ARTICLES & BLOGS TAB SWITCH
  ---------------------------------------------------- */
  const tabs = document.querySelectorAll('.blog-tab');
  const panels = document.querySelectorAll('.blog-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.querySelector(`.blog-panel[data-panel="${tab.dataset.tab}"]`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  /* ----------------------------------------------------
     CONTACT FORM VALIDATION
  ---------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const formMsg = document.getElementById('form-msg');

  if (contactForm && formMsg) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const fields = contactForm.querySelectorAll('.field');

      fields.forEach(field => {
        const input = field.querySelector('input, textarea');
        if (!input) return;

        // Reset errors
        field.classList.remove('error');

        // Check empty value
        if (input.required && !input.value.trim()) {
          field.classList.add('error');
          isValid = false;
        }

        // Check email syntax
        if (input.type === 'email' && input.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(input.value.trim())) {
            field.classList.add('error');
            isValid = false;
          }
        }
      });

      if (isValid) {
        // Success animation or message
        formMsg.className = 'form-msg success';
        formMsg.textContent = 'Thank you! Your message has been sent successfully.';
        formMsg.style.display = 'block';

        // Custom success animation (fade out form inputs)
        gsap.to(contactForm.querySelectorAll('.field, button'), {
          opacity: 0.3,
          duration: 0.5,
          pointerEvents: 'none'
        });

        // Reset fields after some seconds
        setTimeout(() => {
          contactForm.reset();
          gsap.to(contactForm.querySelectorAll('.field, button'), {
            opacity: 1,
            duration: 0.5,
            pointerEvents: 'auto'
          });
          formMsg.style.display = 'none';
        }, 5000);
      } else {
        formMsg.className = 'form-msg error';
        formMsg.textContent = 'Please correct the errors in the highlighted fields.';
        formMsg.style.display = 'block';
      }
    });
  }

  /* ----------------------------------------------------
     INTERACTIVE SEARCH SYSTEM
  ---------------------------------------------------- */
  const searchToggle = document.getElementById('search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  // Unified index catalog of site materials
  const catalog = [
    { title: "From Victim to Victor: A Chick Literature Reading of the Female Protagonist in Marry My Husband", type: "Publication", url: "#works", desc: "English Axis - December 2025" },
    { title: "Digital Magic: Reimagining Fate through Artificial Intelligence and Fantasy in Korean Webtoon", type: "Publication", url: "#works", desc: "Bodhi International Journal - December 2025" },
    { title: "Webtoon as Contemporary Literature: Adaptation and Cultural Revival in Marry My Husband", type: "Book Chapter", url: "#works", desc: "Beyond the Ages monograph (DOI link access)" },
    { title: "Webtoon Relaxation Theory", type: "Patent Certification", url: "#works", desc: "e-Stamp Patent agent filing certificate details." },
    { title: "AI Perfection and the Mask of Beauty: Psychological Effects of Digital Perfectionism in True Beauty", type: "Conference Presentation", url: "#conferences", desc: "Presented conference paper - 24 Jan 2026" },
    { title: "Whispers Between", type: "Book / Poetry Collection", url: "#poetry", desc: "Available poetry collection exploring quiet resilience, love, and healing." },
    { title: "On the Way to Go", type: "Creative Short Story", url: "#poetry", desc: "A reflective story of uncertainty, courage, and transformation." },
    { title: "Technology without Humanity is a Bane", type: "Conference Presentation", url: "#conferences", desc: "Session 1 - 06 March 2026" },
    { title: "Virtual Museum Visit", type: "Conference Seminar", url: "#conferences", desc: "Session 2 - 13 March 2026" },
    { title: "Harry Potter Theme Literary Festival", type: "Academic Event", url: "#conferences", desc: "Steering committee organization - 08 May 2026" }
  ];

  if (searchToggle && searchOverlay && searchClose && searchInput && searchResults) {
    searchToggle.addEventListener('click', () => {
      searchOverlay.classList.add('open');
      searchOverlay.setAttribute('aria-hidden', 'false');
      searchInput.focus();
    });

    const closeSearch = () => {
      searchOverlay.classList.remove('open');
      searchOverlay.setAttribute('aria-hidden', 'true');
      searchInput.value = '';
      searchResults.innerHTML = '';
    };

    searchClose.addEventListener('click', closeSearch);
    
    // Close search overlay if clicking background
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) closeSearch();
    });

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      searchResults.innerHTML = '';

      if (!query) return;

      const matches = catalog.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.type.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query)
      );

      if (matches.length > 0) {
        matches.forEach(match => {
          const div = document.createElement('a');
          div.href = match.url;
          div.className = 'search-item';
          div.style.display = 'block';
          div.innerHTML = `
            <h5>[${match.type}] ${match.title}</h5>
            <p>${match.desc}</p>
          `;
          div.addEventListener('click', () => {
            closeSearch();
          });
          searchResults.appendChild(div);
        });
      } else {
        searchResults.innerHTML = `<p style="color: rgba(255,255,255,0.4); text-align: center; margin-top: 1em;">No matching items found.</p>`;
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('open')) {
        closeSearch();
      }
    });
  }
});
