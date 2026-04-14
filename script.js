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

    // --- Dynamic Modal Functionality ---
    const videoModal = document.getElementById('video-modal');
    const closeVideo = document.getElementById('close-video');
    const modalContainer = document.getElementById('modal-container');
    
    // Store original video element
    const originalVideoElement = modalContainer ? modalContainer.innerHTML : '';

    function openModalWithContent(contentHtml) {
        if (!modalContainer) return;
        modalContainer.innerHTML = contentHtml;
        videoModal.classList.remove('hidden');
        videoModal.style.opacity = '0';
        requestAnimationFrame(() => {
            videoModal.style.transition = 'opacity 0.3s ease-in';
            videoModal.style.opacity = '1';
        });
    }

    function openModalWithVideo(src) {
        if (!modalContainer) return;
        modalContainer.innerHTML = originalVideoElement;
        const demoVideo = document.getElementById('demo-video');
        const demoSource = demoVideo.querySelector('source');
        
        if (demoVideo && demoSource) {
            demoSource.src = src;
            demoVideo.load();
            demoVideo.play();
        }
        
        videoModal.classList.remove('hidden');
        videoModal.style.opacity = '0';
        requestAnimationFrame(() => {
            videoModal.style.transition = 'opacity 0.3s ease-in';
            videoModal.style.opacity = '1';
        });
    }

    // Bind Summary buttons
    document.querySelectorAll('.view-summary').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.project-card');
            const title = card?.getAttribute('data-title') || 'Project Summary';
            const summary = card?.getAttribute('data-summary') || 'No summary provided.';
            
            const html = `
                <div class="p-8 bg-gray-900 border border-blue-500/30 rounded-lg max-h-[80vh] overflow-y-auto w-full md:min-w-[600px]">
                    <h2 class="text-3xl font-bold text-white mb-4">${title} <span class="text-blue-400 opacity-70 text-2xl">- Summary</span></h2>
                    <p class="text-lg text-gray-300 font-light leading-relaxed">${summary}</p>
                </div>
            `;
            openModalWithContent(html);
        });
    });

    // Bind Technologies buttons
    document.querySelectorAll('.view-tech').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.project-card');
            const title = card?.getAttribute('data-title') || 'Project';
            const techStr = card?.getAttribute('data-tech') || 'No technologies listed.';
            
            const techs = techStr.split(',').map(t => `<span class="px-4 py-2 bg-blue-900/40 text-blue-300 text-sm font-semibold rounded-full border border-blue-500/30 shadow-sm">${t.trim()}</span>`).join('');

            const html = `
                <div class="p-8 bg-gray-900 border border-blue-500/30 rounded-lg max-h-[80vh] overflow-y-auto w-full md:min-w-[600px]">
                    <h2 class="text-3xl font-bold text-white mb-6">${title} <span class="text-blue-400 opacity-70 text-2xl">- Technologies</span></h2>
                    <div class="flex flex-wrap gap-3">
                        ${techs}
                    </div>
                </div>
            `;
            openModalWithContent(html);
        });
    });

    // Bind Video buttons
    document.querySelectorAll('.play-demo').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.project-card');
            const src = card?.getAttribute('data-video');
            if (src) {
                openModalWithVideo(src);
            }
        });
    });

    function closeModal() {
        videoModal.style.transition = 'opacity 0.3s ease-out';
        videoModal.style.opacity = '0';
        
        const demoVideo = document.getElementById('demo-video');
        if (demoVideo) {
            demoVideo.pause();
            demoVideo.currentTime = 0;
        }
        
        setTimeout(() => {
            videoModal.classList.add('hidden');
        }, 300);
    }

    // Close modal
    closeVideo.addEventListener('click', closeModal);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !videoModal.classList.contains('hidden')) closeModal();
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

    // (Old expand-project handlers and show/more toggles removed)

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
            keywords: ['projects', 'portfolio', 'built', 'all projects', 'what did she build'],
            response: "Lakshmi has built several impressive projects including Freshlyy, a Book Review System, TrackWise, ComplainHub, and RepoBrief. You can ask me for the 'summary of TrackWise' or any other project to get specific details!"
        },
        {
            keywords: ['freshlyy', 'freshlyy summary', 'ecommerce', 'e-commerce'],
            response: "Here is the summary for Freshlyy: I developed an e-commerce platform called Freshlyy using the Laravel framework (PHP), where users can purchase dairy products, fresh vegetables, fruits, and meat. The application follows a clean role-based architecture with a single layout and shared routes, where both users and admins interact with the same pages but with different permissions and UI controls. I implemented core features like product listing by category, cart functionality, and order management, along with secure backend logic for admin actions such as adding, editing, and deleting products. The project uses SQLite as the database (managed via TablePlus) and runs on the Herd server. Additionally, I integrated the Omniware (JSecurePay) payment gateway, handling order creation, secure hash generation, and payment status verification to ensure reliable transactions."
        },
        {
            keywords: ['book review system', 'book review', 'book review summary'],
            response: "Here is the summary for Book Review System: Built a full-stack Book Review Platform using the MERN stack (MongoDB, Express.js, React, Node.js), enabling users to explore, add, and review books. Implemented secure authentication using JWT and bcrypt, along with protected routes for authorized actions. Developed complete CRUD functionality for books and reviews, including pagination and average rating calculation. Designed a responsive frontend using React with seamless API integration following an MVC architecture on the backend."
        },
        {
            keywords: ['trackwise', 'trackwise summary', 'railway'],
            response: "Here is the summary for TrackWise: TrackWise is an AI-driven railway management system designed to improve railway safety and operational efficiency. The system uses machine learning models such as Echo State Networks (ESN) to predict train movements and a Graph Diffusion Model (GDM) to analyze risk propagation across railway tracks. By combining train data like speed, location, and direction, the AI module calculates a real-time collision risk score and generates alerts to prevent accidents. The platform also integrates AI-based station monitoring, passenger data, and IoT inputs to support predictive decision-making. This AI-enabled approach helps improve safety, optimize railway operations, and enhance passenger management."
        },
        {
            keywords: ['complainhub', 'complain hub', 'complainhub summary', 'complaints'],
            response: "Here is the summary for ComplainHub: ComplaintHub is a web-based platform developed using React (Frontend) and Firebase (Backend) to manage student complaints efficiently. The system stores complaint data and user details in Firebase. It integrates a machine learning model that predicts the priority of complaints using NLP techniques. The model uses TF-IDF Vectorizer and Naive Bayes classification, trained on custom complaint data collected from students. Complaints are categorized into High (Academic), Medium (Cleanliness), and Low (Unnecessary) priorities. Students can register, submit complaints, and track progress, while admins can manage complaints, upload proofs, and handle student accounts."
        },
        {
            keywords: ['repobrief', 'repo brief', 'repobrief summary', 'github summary'],
            response: "Here is the summary for RepoBrief: RepoBrief is a full-stack AI platform built with Next.js, Prisma, PostgreSQL, and Supabase that helps developers understand GitHub repositories. It uses Gemini AI to analyze commits, README files, and repository data to generate summaries and answer questions about the codebase. The platform also provides meeting transcription and summary features using AssemblyAI, where users can upload audio files and get automatic transcripts and summaries. Authentication is handled through Clerk, and users receive credits to access AI features, with additional credits purchasable via Stripe. It is especially useful for onboarding new developers and quickly understanding ongoing projects."
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
            keywords: ['ai', 'machine learning', 'ml', 'nlp', 'llama', 'model', 'generative', 'gemini'],
            response: "Lakshmi is an AI Enthusiast! Her AI/ML skills include Python, Machine Learning models (Naive Bayes, TF-IDF), NLP text classification, and integrating LLMs like Gemini and LLaMA 3 via APIs."
        },
        {
            keywords: ['certificate', 'certifications', 'badges', 'nptel', 'credly', 'course', 'courses', 'google cloud', 'ibm', 'deloitte'],
            response: "She has an extensive collection of certifications! These include Google Cloud Badges (available via her Credly link), NPTEL courses (Software Testing, Waste Mgt), Python for Data Science (IBM), Data Analytics (Deloitte), and various bootcamps from Let's Upgrade and Spoken Tutorials."
        },
        {
            keywords: ['extracurricular', 'activities', 'academic', 'involvement', 'nic', 'sdc', 'club', 'role', 'volunteer', 'vertechx', 'swayam'],
            response: "Lakshmi is highly active in her college community! She is the Marketing Lead & Design Team Member at NIC (Nova Innovative Compskey), a Social Media Member for SDC, a Department Coordinator for Vertechx, and a Swayam volunteer. Check out the Academic Involvement section for her role certificates!"
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
