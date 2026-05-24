document.addEventListener('DOMContentLoaded', () => {
    
    // --- NAVBAR SCROLL EFFECT ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- MOBILE MENU TOGGLE ---
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
            // Toggle hamburger bars animation
            const bars = menuToggle.querySelectorAll('.bar');
            if (menuToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu on link click
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('open');
                const bars = menuToggle.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    // --- SCROLL REVEAL (INTERSECTION OBSERVER) ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // --- ACTIVE NAV LINK TRACKING ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // Projects carousel logic removed as projects are now displayed next to each other.

    // --- ART LIGHTBOX GALLERY ---
    const artThumbs = document.querySelectorAll('.art-thumb');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    let currentArtList = Array.from(artThumbs);
    let currentArtIndex = 0;

    function openLightbox(index) {
        currentArtIndex = index;
        const targetImg = currentArtList[currentArtIndex];
        
        lightboxImg.src = targetImg.src;
        lightboxCaption.textContent = targetImg.alt;
        lightbox.style.display = 'flex';
        
        // Force reflow and add class for animation
        setTimeout(() => {
            lightbox.classList.add('open');
        }, 10);
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        setTimeout(() => {
            lightbox.style.display = 'none';
        }, 300);
    }

    function nextArt() {
        let nextIndex = currentArtIndex + 1;
        if (nextIndex >= currentArtList.length) nextIndex = 0;
        openLightbox(nextIndex);
    }

    function prevArt() {
        let prevIndex = currentArtIndex - 1;
        if (prevIndex < 0) prevIndex = currentArtList.length - 1;
        openLightbox(prevIndex);
    }

    artThumbs.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => {
            openLightbox(idx);
        });
    });

    if (lightbox) {
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', nextArt);
        lightboxPrev.addEventListener('click', prevArt);

        // Close lightbox on click outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard Support
        document.addEventListener('keydown', (e) => {
            if (lightbox.style.display === 'flex' || lightbox.classList.contains('open')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') nextArt();
                if (e.key === 'ArrowLeft') prevArt();
            }
        });
    }

    // --- 3D BOOK FLIPPING ALBUM ---
    const book = document.getElementById('threxBook');
    if (book) {
        const pages = book.querySelectorAll('.book-page');
        const totalPages = pages.length;
        let currentPageIndex = 0;
        const indicator = book.parentElement.querySelector('.page-indicator');
        
        book.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Add flipped class to the current page
            pages[currentPageIndex].classList.add('flipped');
            pages[currentPageIndex].classList.remove('active');
            
            // Calculate next page index
            currentPageIndex = (currentPageIndex + 1) % totalPages;
            
            // Reset flipping when reaching the beginning without showing the reverse rewind animation
            if (currentPageIndex === 0) {
                pages.forEach(p => {
                    p.style.transition = 'none'; // Disable transition
                    p.classList.remove('flipped');
                });
                
                // Force a reflow/repaint to apply the style change without transition
                void book.offsetHeight;
                
                // Restore transition for subsequent flips
                pages.forEach(p => {
                    p.style.transition = '';
                });
            }
            
            pages[currentPageIndex].classList.add('active');
            if (indicator) {
                indicator.textContent = `${currentPageIndex + 1} / ${totalPages}`;
            }
        });
    }

    // --- FLOWER BURST CLICK GLOW EFFECT ---
    window.addEventListener('click', (e) => {
        // Create container
        const container = document.createElement('div');
        container.className = 'flower-glow-container';
        container.style.left = `${e.clientX}px`;
        container.style.top = `${e.clientY}px`;

        // Create core
        const core = document.createElement('div');
        core.className = 'flower-core';
        container.appendChild(core);

        // Create 6 petals
        const numPetals = 6;
        for (let i = 0; i < numPetals; i++) {
            const petal = document.createElement('div');
            petal.className = 'flower-petal';
            petal.style.setProperty('--rot', `${(360 / numPetals) * i}deg`);
            container.appendChild(petal);
        }

        document.body.appendChild(container);

        // Remove after animation completes
        setTimeout(() => {
            container.remove();
        }, 800);
    });
});
