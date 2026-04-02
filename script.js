document.addEventListener('DOMContentLoaded', () => {
    // --- Page Navigation ---
    const landingPage = document.getElementById('landing-page');
    const portfolioPage = document.getElementById('portfolio-page');
    const enterButton = document.getElementById('enter-portfolio');
    const homeButton = document.getElementById('home-button');

    enterButton.addEventListener('click', () => {
        landingPage.style.transition = 'opacity 0.5s ease-out';
        landingPage.style.opacity = '0';
        setTimeout(() => {
            landingPage.classList.add('hidden');
            portfolioPage.classList.remove('hidden');
            portfolioPage.style.opacity = '0';
            requestAnimationFrame(() => {
                portfolioPage.style.transition = 'opacity 0.5s ease-in';
                portfolioPage.style.opacity = '1';
            });
            window.scrollTo(0, 0);
        }, 500);
    });

    homeButton.addEventListener('click', () => {
        portfolioPage.style.transition = 'opacity 0.5s ease-out';
        portfolioPage.style.opacity = '0';
        setTimeout(() => {
            portfolioPage.classList.add('hidden');
            landingPage.classList.remove('hidden');
            landingPage.style.opacity = '0';
            requestAnimationFrame(() => {
                landingPage.style.transition = 'opacity 0.5s ease-in';
                landingPage.style.opacity = '1';
            });
        }, 500);
    });

    // --- Smooth Scrolling for Nav Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Landing Page Hover Effect ---
    const title = document.getElementById('main-title');
    landingPage.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xRotation = (clientY / innerHeight - 0.5) * -20;
        const yRotation = (clientX / innerWidth - 0.5) * 20;

        title.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale3d(1.1, 1.1, 1.1)`;
    });

    landingPage.addEventListener('mouseleave', () => {
        title.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });


    // --- Three.js Animated Galaxy Background ---
    // Ensure THREE is loaded before this script runs
    if (typeof THREE === 'undefined') {
        console.error('Three.js has not been loaded.');
        return;
    }

    let scene, camera, renderer, stars;

    function initGalaxy() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 1;
        camera.rotation.x = Math.PI / 2;

        renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("#galaxy-canvas"),
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const starGeo = new THREE.BufferGeometry();
        const starCount = 6000;
        const positions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 600;
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        let sprite = new THREE.TextureLoader().load('https://placehold.co/16x16/ffffff/ffffff.png'); // Simple white dot
        let starMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.7,
            map: sprite,
            transparent: true
        });

        stars = new THREE.Points(starGeo, starMaterial);
        scene.add(stars);

        window.addEventListener("resize", onWindowResize, false);

        animate();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        stars.rotation.y += 0.0002;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    initGalaxy();

    // --- Video Modal Functionality ---
    const videoModal = document.getElementById('video-modal');
    const closeVideo = document.getElementById('close-video');
    const demoVideo = document.getElementById('demo-video');
    const demoSource = demoVideo.querySelector('source');

    function openVideoWithSrc(src) {
        if (demoVideo) {
            demoVideo.pause();
            demoVideo.currentTime = 0;
        }
        if (demoSource) {
            demoSource.src = src;
        }
        demoVideo.load();

        videoModal.classList.remove('hidden');
        videoModal.style.opacity = '0';
        requestAnimationFrame(() => {
            videoModal.style.transition = 'opacity 0.3s ease-in';
            videoModal.style.opacity = '1';
        });
        demoVideo.play();
    }

    // Bind all Live Demo buttons
    document.querySelectorAll('.live-demo').forEach((btn) => {
        btn.addEventListener('click', () => {
            const src = btn.getAttribute('data-video');
            if (src) openVideoWithSrc(src);
        });
    });

    // Close video modal
    closeVideo.addEventListener('click', () => {
        videoModal.style.transition = 'opacity 0.3s ease-out';
        videoModal.style.opacity = '0';
        demoVideo.pause();
        demoVideo.currentTime = 0;
        setTimeout(() => {
            videoModal.classList.add('hidden');
        }, 300);
    });

    // Close modal when clicking outside the video
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideo.click();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !videoModal.classList.contains('hidden')) {
            closeVideo.click();
        }
    });

    // --- Contact form handler ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = contactForm.querySelector('#name')?.value.trim();
            const email = contactForm.querySelector('#email')?.value.trim();
            const phone = contactForm.querySelector('#phone')?.value.trim();
            const message = contactForm.querySelector('#message')?.value.trim();

            if (!name || !email || !message) {
                alert('Please fill in name, email, and description.');
                return;
            }

            const to = 'lskolhar@gmail.com';
            const subject = encodeURIComponent(`Portfolio contact from ${name}`);
            const bodyLines = [
                `Name: ${name}`,
                `Email: ${email}`,
                phone ? `Phone: ${phone}` : null,
                '',
                'Message:',
                message
            ].filter(Boolean);
            const body = encodeURIComponent(bodyLines.join('\n'));
            const mailto = `mailto:${to}?subject=${subject}&body=${body}`;

            window.location.href = mailto;
        });
    }

    // --- Projects: Show more/less & expand modal ---
    const projectsGrid = document.getElementById('projects-grid');
    const toggleProjectsBtn = document.getElementById('toggle-projects');

    if (projectsGrid && toggleProjectsBtn) {
        const extraProjects = Array.from(projectsGrid.querySelectorAll('.extra-project'));
        let expanded = false;

        function updateToggleButton() {
            toggleProjectsBtn.textContent = expanded ? 'Show less' : 'Show more';
        }

        function setProjectsVisibility() {
            extraProjects.forEach(card => {
                card.style.display = expanded ? '' : 'none';
            });
        }

        // initialize collapsed
        setProjectsVisibility();
        updateToggleButton();

        toggleProjectsBtn.addEventListener('click', () => {
            expanded = !expanded;
            setProjectsVisibility();
            updateToggleButton();
        });
    }

    // Expand modal using existing video modal container as a simple content modal
    document.querySelectorAll('.expand-project').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.project-card');
            const title = card?.getAttribute('data-title') || 'Project';
            const desc = card?.getAttribute('data-desc') || '';
            const github = card?.getAttribute('data-github') || '#';

            // replace video content with text temporarily
            if (demoVideo) {
                demoVideo.pause();
            }
            const modalContent = document.createElement('div');
            modalContent.className = 'p-6 text-gray-200';
            modalContent.innerHTML = `
                <h3 class="text-2xl font-bold mb-2">${title}</h3>
                <p class="text-gray-300 mb-4">${desc}</p>
                <a class="inline-block px-4 py-2 border border-blue-400 rounded text-blue-300 hover:bg-blue-400 hover:text-black transition-colors" target="_blank" rel="noopener noreferrer" href="${github}">Open GitHub</a>
            `;

            const container = videoModal.querySelector('.relative.bg-black.rounded-lg.overflow-hidden');
            const original = container.firstElementChild;

            // swap
            container.replaceChild(modalContent, original);
            videoModal.classList.remove('hidden');
            videoModal.style.opacity = '0';
            requestAnimationFrame(() => {
                videoModal.style.transition = 'opacity 0.3s ease-in';
                videoModal.style.opacity = '1';
            });

            // restore on close
            const restore = () => {
                if (container.firstElementChild === modalContent) {
                    container.replaceChild(original, modalContent);
                }
            };
            const handleClose = () => {
                restore();
                closeVideo.removeEventListener('click', handleClose);
                document.removeEventListener('keydown', escHandler);
                videoModal.removeEventListener('click', outsideHandler);
            };
            const escHandler = (ev) => {
                if (ev.key === 'Escape') handleClose();
            };
            const outsideHandler = (ev) => {
                if (ev.target === videoModal) handleClose();
            };
            closeVideo.addEventListener('click', handleClose);
            document.addEventListener('keydown', escHandler);
            videoModal.addEventListener('click', outsideHandler);
        });
    });

    // Wire play-demo buttons to open the project's demo video
    document.querySelectorAll('.play-demo').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.project-card');
            const src = card?.getAttribute('data-video');
            if (src) {
                openVideoWithSrc(src);
            } else {
                // fallback: use a placeholder clip or keep modal closed
                console.warn('No demo video found for project');
            }
        });
    });

    // --- AI Chatbot Assistant Logic ---
    const chatToggleBtn = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat');
    const chatHistory = document.getElementById('chat-history');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat');

    let chatOpen = false;

    // Chatbot Knowledge Base
    const botKnowledge = [
        {
            keywords: ['experience', 'work', 'job', 'internship', 'omniware', 'kredo', 'latest'],
            response: "Lakshmi is currently working at Omniware Technologies, where she built a Laravel e-commerce system with the JSecurePay gateway! Previously, she interned at Kredo Analytics developing full-stack features using PHP, Laravel, and AI models."
        },
        {
            keywords: ['skills', 'technologies', 'stack', 'frontend', 'backend', 'language'],
            response: "Her tech stack is highly versatile! For Backend: Laravel, Node.js, Python, and MySQL. For Frontend: React, Tailwind CSS, JS. She's also very experienced in AI & ML, specifically with NLP, LLMs, and Python. Want to know more about a specific skill?"
        },
        {
            keywords: ['projects', 'portfolio', 'built', 'freshlyy', 'trackwise', 'repobrief', 'summarize'],
            response: "Lakshmi has built several impressive projects! Some highlights include 'Freshlyy' (a Laravel e-commerce platform), 'TrackWise' (a management system), and AI-integrations like 'RepoBrief'. Feel free to check the Projects section to watch the live demos!"
        },
        {
            keywords: ['contact', 'hire', 'email', 'linkedin', 'reach', 'message'],
            response: "You can easily reach Lakshmi via email at lskolhar@gmail.com, or through her LinkedIn profile! Just scroll to the 'Get In Touch' section at the bottom of the page."
        },
        {
            keywords: ['education', 'study', 'student', 'college', 'degree'],
            response: "Lakshmi is an aspiring Computer Science student with a strong passion for web development, AI, and cloud technologies. She actively holds leadership roles like Department Coordinator at Vertechx."
        },
        {
            keywords: ['ai', 'machine learning', 'ml', 'nlp', 'llama', 'model'],
            response: "Lakshmi is an AI Enthusiast! Her AI/ML skills include Python, Machine Learning models (Naive Bayes, TF-IDF), NLP text classification, and integrating LLMs like Gemini and LLaMA 3 via APIs."
        }
    ];

    function toggleChat() {
        chatOpen = !chatOpen;
        if (chatOpen) {
            chatWindow.classList.remove('hidden');
            setTimeout(() => {
                chatWindow.classList.remove('scale-95', 'opacity-0');
                chatWindow.classList.add('scale-100', 'opacity-100');
            }, 10);
        } else {
            chatWindow.classList.remove('scale-100', 'opacity-100');
            chatWindow.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                chatWindow.classList.add('hidden');
            }, 300);
        }
    }

    if (chatToggleBtn && closeChatBtn) {
        chatToggleBtn.addEventListener('click', toggleChat);
        closeChatBtn.addEventListener('click', toggleChat);
    }

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = sender === 'user' ? 'flex items-end justify-end' : 'flex items-start';

        const bubble = document.createElement('div');
        if (sender === 'user') {
            bubble.className = 'bg-gray-700/80 border border-gray-600/50 text-white text-sm rounded-lg rounded-tr-none px-4 py-2 max-w-[85%] shadow-md';
        } else {
            bubble.className = 'bg-blue-600/30 border border-blue-500/30 text-gray-200 text-sm rounded-lg rounded-tl-none px-4 py-2 max-w-[85%] mt-2 shadow-md';
        }
        bubble.textContent = text;
        msgDiv.appendChild(bubble);

        chatHistory.appendChild(msgDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function generateBotResponse(userMsg) {
        const lowerMsg = userMsg.toLowerCase();

        let bestMatch = null;
        let maxMatchCount = 0;

        botKnowledge.forEach(kb => {
            let matches = 0;
            kb.keywords.forEach(kw => {
                if (lowerMsg.includes(kw)) matches++;
            });
            if (matches > maxMatchCount) {
                maxMatchCount = matches;
                bestMatch = kb.response;
            }
        });

        if (!bestMatch) {
            bestMatch = "That's an interesting question! Lakshmi's focus is on Full-Stack Development and AI. If you'd like precise details, feel free to drop an email in the Contact section!";
            if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
                bestMatch = "Hello there! How can I help you learn more about Lakshmi's portfolio today?";
            }
        }

        // Simulate typing delay
        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.className = 'flex items-start mt-2';
        typingIndicator.innerHTML = `<div class="bg-blue-600/30 border border-blue-500/30 text-gray-200 text-sm rounded-lg rounded-tl-none px-4 py-3 flex items-center space-x-1.5 shadow-md"><div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div><div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div><div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div></div>`;
        chatHistory.appendChild(typingIndicator);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        setTimeout(() => {
            if (document.getElementById('typing-indicator')) {
                document.getElementById('typing-indicator').remove();
            }
            appendMessage('bot', bestMatch);
        }, 1200);
    }

    function handleChatSubmit() {
        const msg = chatInput.value.trim();
        if (!msg) return;

        appendMessage('user', msg);
        chatInput.value = '';
        generateBotResponse(msg);
    }

    if (sendChatBtn && chatInput) {
        sendChatBtn.addEventListener('click', handleChatSubmit);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChatSubmit();
        });
    }

    // Quick option chips
    document.querySelectorAll('.chat-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const quickOptions = document.getElementById('quick-options');
            if (quickOptions) quickOptions.style.display = 'none'; // hide chips once clicked
            const txt = chip.textContent.replace('✨', '').replace('💡', '').replace('🚀', '').trim();
            appendMessage('user', txt);
            generateBotResponse(txt);
        });
    });
});
