// Smooth scroll implementation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80; // Adjust based on your header height
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('service-card')) {
                entry.target.classList.add('animate');
            }
        }
    });
}, observerOptions);

// Apply fade-in animation to sections and elements
document.querySelectorAll('.section-title, .section-subtitle, .service-card, .contact-content').forEach(element => {
    element.classList.add('fade-in');
    observer.observe(element);
});

// Stagger service cards animation
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
});

// Glitch text effect
const glitchText = document.querySelector('.glitch-text');
if (glitchText) {
    let isGlitching = false;
    const glitchChars = '!<>-_\\/[]{}—=+*^?#';
    
    function createGlitchEffect() {
        if (isGlitching) return;
        isGlitching = true;
        
        const lines = Array.from(glitchText.querySelectorAll('.line'));
        const originalTexts = lines.map(line => line.textContent);
        const maxLength = Math.max(...originalTexts.map(text => text.length));
        let iterations = 0;
        
        // Store original dimensions
        const originalWidths = lines.map(line => line.offsetWidth);
        lines.forEach((line, i) => {
            line.style.minWidth = `${originalWidths[i]}px`;
        });
        
        const interval = setInterval(() => {
            lines.forEach((line, lineIndex) => {
                const originalText = originalTexts[lineIndex];
                if (iterations < originalText.length * 3) {
                    const glitchedText = originalText
                        .split('')
                        .map((char, index) => {
                            if (index < iterations / 3) {
                                return originalText[index];
                            }
                            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        })
                        .join('');
                    line.textContent = glitchedText;
                } else {
                    line.textContent = originalText;
                }
            });
            
            iterations++;
            
            if (iterations >= maxLength * 3) {
                clearInterval(interval);
                lines.forEach((line, index) => {
                    line.textContent = originalTexts[index];
                    // Remove fixed width after effect
                    setTimeout(() => {
                        line.style.minWidth = '';
                    }, 100);
                });
                isGlitching = false;
            }
        }, 50);
    }

    // Trigger glitch effect on hover and periodically
    glitchText.addEventListener('mouseenter', createGlitchEffect);
    
    // Optional: Trigger effect periodically
    setInterval(() => {
        if (!isGlitching && !glitchText.matches(':hover')) {
            createGlitchEffect();
        }
    }, 10000); // Every 10 seconds if not hovering
}

// Logo glitch effect
const logoText = document.querySelector('.logo-text');
const logoN = document.querySelector('.logo-n');

if (logoText && logoN) {
    const glitchChars = '!<>-_\\/[]{}—=+*^?#';
    let isGlitching = false;

    function glitchElement(element, originalText, callback) {
        if (isGlitching) return;
        isGlitching = true;

        let iterations = 0;
        const maxIterations = originalText.length * 2;
        
        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations / 2) {
                        return originalText[index];
                    }
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                })
                .join('');
            
            iterations++;
            
            if (iterations >= maxIterations) {
                clearInterval(interval);
                element.textContent = originalText;
                isGlitching = false;
                if (callback) callback();
            }
        }, 50);
    }

    function startGlitchSequence() {
        // Random delay between 3 and 8 seconds
        const delay = Math.random() * 5000 + 3000;
        
        setTimeout(() => {
            // Randomly choose which element to glitch first
            if (Math.random() > 0.5) {
                glitchElement(logoN, 'N', () => {
                    setTimeout(() => {
                        glitchElement(logoText, 'cozzyy', startGlitchSequence);
                    }, 200);
                });
            } else {
                glitchElement(logoText, 'cozzyy', () => {
                    setTimeout(() => {
                        glitchElement(logoN, 'N', startGlitchSequence);
                    }, 200);
                });
            }
        }, delay);
    }

    // Set data attributes for CSS pseudo-elements
    logoText.setAttribute('data-text', 'cozzyy');
    logoN.setAttribute('data-text', 'N');

    // Start the glitch sequence after page load
    setTimeout(startGlitchSequence, 1500);

    // Add hover effect
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            if (!isGlitching) {
                glitchElement(logoN, 'N', () => {
                    glitchElement(logoText, 'cozzyy');
                });
            }
        });
    }
}

// Header transparency and hide/show on scroll
let lastScrollTop = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add background when scrolling down
    if (scrollTop > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
    
    // Hide/show header based on scroll direction
    if (scrollTop > lastScrollTop && scrollTop > 500) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Custom cursor effect
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

let cursorX = 0;
let cursorY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

function updateCursor() {
    const dx = targetX - cursorX;
    const dy = targetY - cursorY;
    
    cursorX += dx * 0.1;
    cursorY += dy * 0.1;
    
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(updateCursor);
}

updateCursor();

// Enhanced scroll animations
const scrollElements = document.querySelectorAll('.scroll-animate');

const elementInView = (el, percentageScroll = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
        elementTop <= 
        ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
    );
};

const displayScrollElement = (element) => {
    element.classList.add('scrolled');
};

const hideScrollElement = (element) => {
    element.classList.remove('scrolled');
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 100)) {
            displayScrollElement(el);
        } else {
            hideScrollElement(el);
        }
    })
}

// Throttle function to limit scroll event firing
const throttle = (fn, wait) => {
    let inThrottle, lastFn, lastTime;
    return function() {
        const context = this,
            args = arguments;
        if (!inThrottle) {
            fn.apply(context, args);
            lastTime = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastFn);
            lastFn = setTimeout(function() {
                if (Date.now() - lastTime >= wait) {
                    fn.apply(context, args);
                    lastTime = Date.now();
                }
            }, Math.max(wait - (Date.now() - lastTime), 0));
        }
    };
};

window.addEventListener('scroll', throttle(handleScrollAnimation, 50));
window.addEventListener('load', handleScrollAnimation);