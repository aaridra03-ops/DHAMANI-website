document.addEventListener('DOMContentLoaded', () => {
    let currentLang = 'en';
    try { currentLang = localStorage.getItem("dhamani_lang") || 'en'; } catch (e) { }

    // --- ARTISTIC REVEAL SYSTEM ---
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Keep active state for sections we've already seen to prevent flickering, 
                // unless we want them to re-reveal (we do for scroll motion)
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-up, .reveal-blur, .reveal-scale, .stagger-container, section').forEach(el => {
        revealObserver.observe(el);
    });

    // --- CINEMATIC SCROLL EFFECTS ---
    const scrollThread = document.querySelector('.scroll-thread');
    const sections = document.querySelectorAll('section, .timeline-item');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        if (scrollThread) {
            scrollThread.style.width = scrolled + "%";
        }

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const viewHeight = window.innerHeight;

            if (rect.top < viewHeight && rect.bottom > 0) {
                const sectionCenter = rect.top + rect.height / 2;
                const deviation = (sectionCenter - (viewHeight / 2)) / (viewHeight / 2);
                section.style.setProperty('--deviation', deviation);
                section.style.setProperty('--abs-deviation', Math.abs(deviation));
            }
        });
    });

    // --- CINEMATIC INTRO RITUAL ---
    const introRitual = document.getElementById('intro-ritual');
    const introVideo = document.getElementById('intro-video');
    if (introRitual && introVideo) {
        let skipIntro = false;
        try { skipIntro = sessionStorage.getItem('skipIntro'); } catch (e) { }
        if (window.location.hash || skipIntro) {
            introRitual.remove();
            document.body.style.overflow = 'auto';
        } else {
            try { sessionStorage.setItem('skipIntro', 'true'); } catch (e) { } // ensure next reload skips
            document.body.style.overflow = 'hidden';

            // Safety Fallback: Reveal page much faster if video is slow (2.5s)
            const introSafetyTimeout = setTimeout(() => {
                if (document.body.contains(introRitual)) {
                    revealPage(introRitual);
                }
            }, 2500);

            function revealPage(el) {
                clearTimeout(introSafetyTimeout);
                el.classList.add('fade-out');
                document.body.style.overflow = 'auto';
                setTimeout(() => el.remove(), 1000);
            }

            introVideo.play().then(() => {
                introRitual.classList.add('playing');
            }).catch(() => revealPage(introRitual));

            introVideo.onended = () => revealPage(introRitual);
            introVideo.onerror = () => revealPage(introRitual);
        } // Correctly close the `else` block!
    }

    // Global utility for closing modals
    window.closePopup = (id) => {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    // --- WORK GALLERY CAROUSEL (Mobile/Compact) ---
    const track = document.querySelector('.works-container');
    const slides = document.querySelectorAll('.work-card');
    const nextBtn = document.querySelector('.carousel-next');
    const prevBtn = document.querySelector('.carousel-prev');
    let currentSlide = 0;

    function updateCarousel() {
        if (!track || slides.length === 0) return;
        const width = slides[0].getBoundingClientRect().width + 32; // width + gap
        track.style.transform = `translateX(-${currentSlide * width}px)`;
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            updateCarousel();
        });
    }

    updateCarousel();

    // --- 3D PARALLAX FOR CARDS ---
    const workCards = document.querySelectorAll('.work-card, .work-gallery-card');
    workCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;
            card.style.transition = 'transform 0.1s ease-out';
            card.style.transform = `perspective(1000px) translateY(-12px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.4s ease';
            card.style.transform = '';
        });
    });

    // --- AMBER EMBER PARTICLE EFFECT ---
    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
        setInterval(() => {
            if (particlesContainer.childElementCount > 20) return;
            const ember = document.createElement('div');
            ember.classList.add('ember');
            const startX = Math.random() * window.innerWidth;
            const startY = window.innerHeight;
            const dx = (Math.random() - 0.5) * 150;
            const dy = -(Math.random() * 400 + 400);
            const size = Math.random() * 2 + 1;
            const duration = Math.random() * 6 + 6;
            const opacity = Math.random() * 0.3 + 0.1;

            ember.style.left = `${startX}px`;
            ember.style.top = `${startY}px`;
            ember.style.width = `${size}px`;
            ember.style.height = `${size}px`;
            ember.style.setProperty('--dx', `${dx}px`);
            ember.style.setProperty('--dy', `${dy}px`);
            ember.style.setProperty('--max-opacity', opacity);
            ember.style.animationDuration = `${duration}s`;

            particlesContainer.appendChild(ember);
            setTimeout(() => ember.remove(), duration * 1000);
        }, 400);
    }

    // --- SMOOTH FIREFLY CURSOR ---
    const spotlight = document.querySelector('.cursor-spotlight');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let fireflyX = mouseX;
    let fireflyY = mouseY;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        document.documentElement.style.setProperty('--mouse-x', `${(mouseX / window.innerWidth) * 100}%`);
        document.documentElement.style.setProperty('--mouse-y', `${(mouseY / window.innerHeight) * 100}%`);
    });

    function animateFirefly() {
        const lerpFactor = 0.08;
        fireflyX += (mouseX - fireflyX) * lerpFactor;
        fireflyY += (mouseY - fireflyY) * lerpFactor;
        if (spotlight) {
            spotlight.style.left = `${fireflyX}px`;
            spotlight.style.top = `${fireflyY}px`;
            const vx = (mouseX - fireflyX) * 0.1;
            const vy = (mouseY - fireflyY) * 0.1;
            spotlight.style.transform = `translate(-50%, -50%) skew(${vx}deg, ${vy}deg)`;
        }
        requestAnimationFrame(animateFirefly);
    }
    animateFirefly();

    // --- GLOBAL TRANSLATION SYSTEM ---
    const translations = {
        en: {
            nav_home: "BACK", nav_dates: "DATES", nav_works: "WORKS", nav_gallery: "GALLERY",
            nav_about: "ABOUT", nav_press: "CUTTINGS", nav_team: "TEAM", nav_connect: "CONNECT",
            home_brand: "DHAMANI",
            home_tagline: "Dhwani-Mana-Niya",
            sec_dates: "OUR DATES", sec_works: "OUR WORKS!", sec_gallery: "THE GALLERY",
            sec_about: "BEYOND THE STAGE", sec_press: "THE CUTTINGS", sec_team: "OUR COLLECTIVE",
            sec_connect: "CONNECT WITH US",
            about_content: "Dhamani Thekkatte is not just a group; it is a pulse of theatre. We blend modern stagecraft with deep human emotion to create unforgettable performances.",
            contact_intro: "DHAMANI is a theatre team shaped by body, breath, chorus, and story.",
            btn_instagram: "INSTAGRAM", btn_support: "SUPPORT THE ART",
            donate_title: "JOIN OUR JOURNEY", donate_desc: "Support the dreams of our performers. Every contribution keeps the stage alive.",
            btn_exit: "EXIT",
            role_pres: "President", role_mem: "Member", role_sec: "Secretary",
            press_h1: '"A VISUAL SYMPHONY IN LIGHT"', press_p1: '"Dhamani Thekkatte manages to bridge the gap between ancient ritual and modern urgency through \'Soorya Chandra\'..."',
            press_h2: '"REDEFINING REGIONAL DRAMA"', press_p2: '"Their approach to shadow play is unparalleled, transforming simple fabric and light into a celestial battleground..."',
            press_h3: '"THE BREATH OF THE STAGE"', press_p3: '"What makes Dhamani unique is their collective silence. They let the movement do the preaching..."',
            c_rachane: "WRITER", c_direction: "Direction", c_music: "Music", c_sangathya: "Sangeetha Sangathya", c_light: "Light", c_costume: "VASTHRA VINYASA", c_set: "RANGA SAJJIKE & VINYASA", c_light_des: "Light Designer", c_music_sang: "Music Sangathya",
            sb_dir: "Directed by Ranjith Shetty Kukkude", sb_rachane: "Vaidehi", sb_dir_name: "Ranjith Shetty Kukkude", sb_music: "Roshan S Baikady", sb_sangeetha: "Mamatha Kalmakaar", sb_light: "Shreesha Thekkatte", sb_costume: "Suraksha", sb_set: "Gopinath Acharya",
            sc_dir: "Directed by Rohith S Baikady", sc_rachane: "Dr. Shivarama Karantha", sc_dir_name: "Rohith S Baikady", sc_music: "Shubhakar Puttur", sc_set: "Prasad Brahmavara", sc_light: "Shreesha Thekkatte", sc_sang: "Kaushik Brahmavara",
            sb_title: "SOORYA BANDA", sb_desc: '"Soorya Banda" (The Sun Arrives) is a profound exploration of hope and dawn in the human psyche. Through a blend of traditional folklore and experimental stagecraft, it tells the story of a village waiting for a light that never fades, testing the bonds of community and the resilience of dreams.',
            sc_title: "SOORYA CHANDRA", sc_desc: 'A dialogue between the celestial and the mortal, "Soorya Chandra" (Sun and Moon) is a visual spectacle of duality. Weaving together shadow play and intense dramatic movement, it portrays the eternal dance of light and shade, reflecting the dual nature of our own inner lives.',
            work_rajaa_rangu: "RAJAA RANGU",
            work_uthsava: "UTHSAVA", work_shorts: "SHORT FILMS", work_fests: "FESTS",
            cal_sun: "SUN", cal_mon: "MON", cal_tue: "TUE", cal_wed: "WED", cal_thu: "THU", cal_fri: "FRI", cal_sat: "SAT",
            cal_on_this_day: "ON THIS DAY", cal_select_date: "Select a date to reveal the story.",

            months: ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"],
            resting_msgs: ["Select a date to reveal the story.", "NAMGE KELSA ILLA KELSA KODI...", "WE ARE CHILLIN... The stage is taking a deep breath.", "WAITING FOR THE NEXT PULSE. Why don't you offer us a project?", "OUT EATING NEER DOSA. Catch us later!"],
            catch_msg: "AGGHH YOU CAUGHT US!",
            sub_header_desc: "Experience the cinematic journey, visual poetry, and dramatic storytelling woven into this theatrical chapter.",
            uthsava_subtitle: "Our Annual Cultural Celebration",
            uthsava_desc: "UTHSAVA is our annual celebration of theatre, culture, and artistic expression.",
            u_event1_title: "MUNNUDI – INAUGURAL", u_event1_date: "04/02/2024",
            u_event1_text: "Munnudi marked the beginning of Uthsava. Canara College students performed 'Shoorpanakhaayana'.",
            u_event2_title: "1st Year Anniversary", u_event2_date: "23/03/2025",
            u_event2_text: "Team Kalabhi, Mangalore presented the play 'Pursana Pugge' as part of the first anniversary celebration.",
            u_event3_title: "2nd Year Anniversary", u_event3_date: "28/02/2026",
            u_event3_text: "Mandara Kids Team brought joy with the performance 'Kuni Kuni Navile'.",
            exit_subtitle: "A HUMBLE REQUEST", exit_title: "SUPPORT OUR STAGE",
            exit_desc: "Support the stage. Keep the flame alive.", exit_scan: "[ SCAN TO DONATE ]",
            btn_sure: "SURE!",
            name_ranjith: "RANJITH", name_sulochana: "SULOCHANA", name_vijith: "VIJITH", name_shreesha: "SHREESHA",
            card_plays: "PLAYS",
            card_events: "EVENTS",
            desc_shoorpa: "A bold reimagining of the Ramayana through Shoorpanakha's perspective.",
            desc_swapna: "An exploration of memory and dreams through experimental movement.",
            btn_view_gallery: "WANNA SEE MORE CLICKS? CLICK HERE",
            btn_view_more: "VIEW MORE",
            btn_view_less: "VIEW LESS"
        },
        kn: {
            nav_home: "ಹಿಂದಕ್ಕೆ", nav_dates: "ದಿನಾಂಕಗಳು", nav_works: "ಕೃತಿಗಳು", nav_gallery: "ಗ್ಯಾಲರಿ",
            nav_about: "ನಮ್ಮ ಬಗ್ಗೆ", nav_press: "ವರದಿಗಳು", nav_team: "ತಂಡ", nav_connect: "ಸಂಪರ್ಕಿಸಿ",
            home_brand: "ಧಮನಿ",
            home_tagline: "ಧ್ವನಿ-ಮನ-ನಿಯ",
            sec_dates: "ನಮ್ಮ ಪ್ರದರ್ಶನಗಳು", sec_works: "ನಮ್ಮ ಕೆಲಸಗಳು!", sec_gallery: "ಗ್ಯಾಲರಿ",
            sec_about: "ವೇದಿಕೆಯ ಆಚೆ", sec_press: "ಪತ್ರಿಕಾ ತುಣುಕುಗಳು", sec_team: "ನಮ್ಮ ತಂಡ",
            sec_connect: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ",
            about_content: "ಧಮನಿ ತೆಕ್ಕಟ್ಟೆ ಕೇವಲ ಒಂದು ತಂಡವಲ್ಲ; ಅದು ಒಂದು ರಂಗಭೂಮಿಯ ಮಿಡಿತ. ನಾವು ಆಧುನಿಕ ರಂಗಕಲೆಯನ್ನು ಆಳವಾದ ಮಾನವ ಭಾವನೆಗಳೊಂದಿಗೆ ಬೆರೆಸಿ ಮರೆಯಲಾಗದ ಪ್ರದರ್ಶನಗಳನ್ನು ನೀಡುತ್ತೇವೆ.",
            contact_intro: "ಧಮನಿ ದೇಹ, ಉಸಿರು ಮತ್ತು ಕಥೆಯ ಮೂಲಕ ರೂಪುಗೊಂಡ ರಂಗತಂಡ.",
            btn_instagram: "ಇನ್‌ಸ್ಟಾಗ್ರಾಮ್", btn_support: "ಕಲೆಯನ್ನು ಬೆಂಬಲಿಸಿ",
            donate_title: "ನಮ್ಮ ಪಯಣದಲ್ಲಿ ಒಂದಾಗಿ", donate_desc: "ನಮ್ಮ ಕಲಾವಿದರ ಕನಸುಗಳಿಗೆ ಬೆಂಬಲ ನೀಡಿ. ಪ್ರತಿಯೊಂದು ಕೊಡುಗೆಯೂ ವೇದಿಕೆಯನ್ನು ಜೀವಂತವಾಗಿರಿಸುತ್ತದೆ.",
            btn_exit: "ನಿರ್ಗಮಿಸಿ",
            role_pres: "ಅಧ್ಯಕ್ಷರು", role_mem: "ಸದಸ್ಯರು", role_sec: "ಕಾರ್ಯದರ್ಶಿ",
            press_h1: '"ಬೆಳಕಿನಲ್ಲಿ ಒಂದು ದೃಶ್ಯ ಸಿಂಫನಿ"', press_p1: '"ಧಮನಿ ತೆಕ್ಕಟ್ಟೆಯವರು ಪುರಾತನ ಆಚರಣೆ ಮತ್ತು ಆಧುನಿಕ ತುರ್ತುಪರಿಸ್ಫಿತಿಯ ನಡುವೆ ಸೇತುವೆಯನ್ನು ನಿರ್ಮಿಸುವಲ್ಲಿ ಯಶಸ್ವಿಯಾಗಿದ್ದಾರೆ..."',
            press_h2: '"ಪ್ರಾದೇಶಿಕ ರಂಗಭೂಮಿಯ ಮರುವ್ಯಾಖ್ಯಾನ"', press_p2: '"ಅವರ ನೆರಳು ನಾಟಕದ ವಿಧಾನವು ಸಾಟಿಯಿಲ್ಲದ್ದು, ಸರಳ ಬಟ್ಟೆ ಮತ್ತು ಬೆಳಕನ್ನು ಸ್ವರ್ಗೀಯ ಯುದ್ಧಭೂಮಿಯಾಗಿ ಪರಿವರ್ತಿಸುತ್ತದೆ..."',
            press_h3: '"ವೇದಿಕೆಯ ಉಸಿರು"', press_p3: '"ಧಮನಿಯ ವಿಶಿಷ್ಟತೆಯೆಂದರೆ ಅವರ ಸಾಮೂಹಿಕ ಮೌನ. ಅವರು ಚಲನೆಯ ಮೂಲಕವೇ ಸಂದೇಶವನ್ನು ನೀಡುತ್ತಾರೆ..."',
            c_rachane: "ಲೇಖಕರು", c_direction: "ನಿರ್ದೇಶನ", c_music: "ಸಂಗೀತ", c_sangathya: "ಸಂಗೀತ ಸಾಂಗತ್ಯ", c_light: "ಬೆಳಕು", c_costume: "ವಸ್ತ್ರ ವಿನ್ಯಾಸ", c_set: "ರಂಗ ಸಜ್ಜಿಕೆ ಮತ್ತು ವಿನ್ಯಾಸ", c_light_des: "ಬೆಳಕಿನ ವಿನ್ಯಾಸ", c_music_sang: "ಸಂಗೀತ ಸಾಂಗತ್ಯ",
            sb_dir: "ನಿರ್ದೇಶನ: ರಂಜಿತ್ ಶೆಟ್ಟಿ ಕುಕ್ಕುಡೆ", sb_rachane: "ವೈದೇಹಿ", sb_dir_name: "ರಂಜಿತ್ ಶೆಟ್ಟಿ ಕುಕ್ಕುಡೆ", sb_music: "ರೋಷನ್ ಎಸ್ ಬೈಕಾಡಿ", sb_sangeetha: "ಮಮತಾ ಕಲ್ಮಾಕರ್", sb_light: "ಶ್ರೀಶ ತೆಕ್ಕಟ್ಟೆ", sb_costume: "ಸುರಕ್ಷಾ", sb_set: "ಗೋಪಿನಾಥ ಆಚಾರ್ಯ",
            sc_dir: "ನಿರ್ದೇಶನ: ರೋಹಿತ್ ಎಸ್ ಬೈಕಾಡಿ", sc_rachane: "ಡಾ. ಶಿವರಾಮ ಕಾರಂತ", sc_dir_name: "ರೋಹಿತ್ ಎಸ್ ಬೈಕಾಡಿ", sc_music: "ಶುಭಕರ್ ಪುತ್ತೂರು", sc_set: "ಪ್ರಸಾದ್ ಬ್ರಹ್ಮಾವರ", sc_light: "ಶ್ರೀಶ ತೆಕ್ಕಟ್ಟೆ", sc_sang: "ಕೌಶಿಕ್ ಬ್ರಹ್ಮಾವರ",
            sb_title: "ಸೂರ್ಯ ಬಂದ", sb_desc: '"ಸೂರ್ಯ ಬಂದ" ಮಾನವನ ಮನಸ್ಸಿನಲ್ಲಿ ಭರವಸೆ ಮತ್ತು ಉದಯದ ಆಳವಾದ ಪರಿಶೋಧನೆಯಾಗಿದೆ. ಸಾಂಪ್ರದಾಯಿಕ ಜಾನಪದ ಮತ್ತು ಪ್ರಾಯೋಗಿಕ ರಂಗಕಲೆಯ ಮಿಶ್ರಣದ ಮೂಲಕ, ಇದು ಎಂದಿಗೂ ಮಾಯವಾಗದ ಬೆಳಕಿಗಾಗಿ ಕಾಯುತ್ತಿರುವ ಹಳ್ಳಿಯ ಕಥೆಯನ್ನು ಹೇಳುತ್ತದೆ, ಸಮುದಾಯದ ಬಂಧಗಳು ಮತ್ತು ಕನಸುಗಳ ಸ್ಥಿತಿಸ್ಥಾಪಕತ್ವವನ್ನು ಪರೀಕ್ಷಿಸುತ್ತದೆ.',
            sc_title: "ಸೂರ್ಯ ಚಂದ್ರ", sc_desc: '"ಸೂರ್ಯ ಚಂದ್ರ" ದ್ವಂದ್ವತೆಯ ದೃಶ್ಯ ವೈಭವವಾಗಿದೆ. ನೆರಳು ನಾಟಕ ಮತ್ತು ತೀವ್ರವಾದ ನಾಟಕೀಯ ಚಲನೆಯನ್ನು ಒಟ್ಟಾಗಿ ಹೆಣೆಯುವ ಮೂಲಕ, ಇದು ಬೆಳಕು ಮತ್ತು ನೆರಳಿನ ಶಾಶ್ವತ ನೃತ್ಯವನ್ನು ಚಿತ್ರಿಸುತ್ತದೆ, ನಮ್ಮದೇ ಆದ ಆಂತರಿಕ ಜೀವನದ ದ್ವಂದ್ವ ಸ್ವಭಾವವನ್ನು ಪ್ರತಿಬಿಂಬಿಸುತ್ತದೆ.',
            work_rajaa_rangu: "ರಾಜಾ ರಂಗು",
            work_uthsava: "ಉತ್ಸವ", work_shorts: "ಕಿರುಚಿತ್ರಗಳು", work_fests: "ರಂಗಹಬ್ಬಗಳು",
            cal_sun: "ಭಾನು", cal_mon: "ಸೋಮ", cal_tue: "ಮಂಗಳ", cal_wed: "ಬುಧ", cal_thu: "ಗುರು", cal_fri: "ಶುಕ್ರ", cal_sat: "ಶನಿ",
            cal_on_this_day: "ಈ ದಿನ", cal_select_date: "ಕಥೆಯನ್ನು ತಿಳಿಯಲು ದಿನಾಂಕವನ್ನು ಆರಿಸಿ",

            months: ["ಜನವರಿ", "ಫೆಬ್ರವರಿ", "ಮಾರ್ಚ್", "ಏಪ್ರಿಲ್", "ಮೇ", "ಜೂನ್", "ಜುಲೈ", "ಆಗಸ್ಟ್", "ಸೆಪ್ಟೆಂಬರ್", "ಅಕ್ಟೋಬರ್", "ನವೆಂಬರ್", "ಡಿಸೆಂಬರ್"],
            resting_msgs: ["ಕಥೆಯನ್ನು ತಿಳಿಯಲು ದಿನಾಂಕವನ್ನು ಆರಿಸಿ.", "ನಮಗೆ ಕೆಲಸ ಇಲ್ಲ, ಕೆಲಸ ಕೊಡಿ!", "ನಾವು ವಿಶ್ರಾಂತಿ ಪಡೆಯುತ್ತಿದ್ದೇವೆ... ವೇದಿಕೆ ಉಸಿರು ಬಿಡುತ್ತಿದೆ.", "ಮುಂದಿನ ಮಿಡಿತಕ್ಕಾಗಿ ಕಾಯುತ್ತಿದ್ದೇವೆ. ನಮಗೊಂದು ಹೊಸ ಯೋಜನೆ ನೀಡುವುದೇ?", "ನೀರ ದೋಸೆ ತಿನ್ನಲು ಹೋಗಿದ್ದೇವೆ. ಆಮೇಲೆ ಸಿಗೋಣ!"],
            catch_msg: "ನೀವು ನಮ್ಮನ್ನು ಹಿಡಿದಿದ್ದೀರಿ!",
            sub_header_desc: "ಈ ರಂಗಭೂಮಿಯ ಅಧ್ಯಾಯದಲ್ಲಿ ಹೆಣೆಯಲಾದ ಸಿನಿಮಾ ಪಯಣ, ದೃಶ್ಯ ಕಾವ್ಯ ಮತ್ತು ನಾಟಕೀಯ ಕಥೆಯನ್ನು ಅನುಭವಿಸಿ.",
            uthsava_subtitle: "ಉತ್ಸವ – ನಮ್ಮ ವಾರ್ಷಿಕ ಸಾಂಸ್ಕೃತಿಕ ಹಬ್ಬ",
            uthsava_desc: "ಉತ್ಸವವು ರಂಗಭೂಮಿ, ಸಂಸ್ಕೃತಿ ಮತ್ತು ಕಲಾತ್ಮಕ ಅಭಿವ್ಯಕ್ತಿಯ ನಮ್ಮ ವಾರ್ಷಿಕ ಆಚರಣೆಯಾಗಿದೆ.",
            u_event1_title: "ಮುನ್ನುಡಿ - ಉದ್ಘಾಟನೆ", u_event1_date: "04/02/2024",
            u_event1_text: "ಮುನ್ನುಡಿ ಉತ್ಸವದ ಆರಂಭ. ಕಾನರಾ ಕಾಲೇಜಿನ ವಿದ್ಯಾರ್ಥಿಗಳು ‘ಶೂರ್ಪಣಖಾಯಣ’ ಪ್ರದರ್ಶಿಸಿದರು.",
            u_event2_title: "ಮೊದಲ ವಾರ್ಷಿಕೋತ್ಸವ", u_event2_date: "23/03/2025",
            u_event2_text: "ಮಂಗಳೂರು ಕಲಾಭಿ ತಂಡ ಮೊದಲು ವಾರ್ಷಿಕೋತ್ಸವದ ಭಾಗವಾಗಿ ‘ಪುರಸನ ಪುಗ್ಗೆ’ ನಾಟಕವನ್ನು ಪ್ರದರ್ಶಿಸಿದರು.",
            u_event3_title: "ಎರಡನೇ ವಾರ್ಷಿಕೋತ್ಸವ", u_event3_date: "28/02/2026",
            u_event3_text: "ಮಂದಾರ ಮಕ್ಕಳ ತಂಡ ‘ಕುಣಿ ಕುಣಿ ನವಿಲೆ’ ಪ್ರದರ್ಶನದ ಮೂಲಕ ಸಂಭ್ರಮ ತಂದರು.",
            exit_subtitle: "ಒಂದು ವಿನಮ್ರ ವಿನಂತಿ", exit_title: "ನಮ್ಮ ವೇದಿಕೆಯನ್ನು ಬೆಂಬಲಿಸಿ",
            exit_desc: "ವೇದಿಕೆಯನ್ನು ಬೆಂಬಲಿಸಿ. ಜ್ಯೋತಿಯನ್ನು ಜೀವಂತವಾಗಿಡಿ.", exit_scan: "[ ಕೊಡುಗೆ ನೀಡಲು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ]",
            btn_sure: "ಖಂಡಿತ!",
            name_ranjith: "ರಂಜಿತ್", name_sulochana: "ಸುಲೋಚನ", name_vijith: "ವಿಜಿತ್", name_shreesha: "ಶ್ರೀಶ",
            card_plays: "ನಾಟಕಗಳು",
            card_events: "ಕಾರ್ಯಕ್ರಮಗಳು",
            desc_shoorpa: "ಶೂರ್ಪಣಖೆಯ ದೃಷ್ಟಿಕೋನದಿಂದ ರಾಮಾಯಣದ ಒಂದು ವಿಶಿಷ್ಟ ನಾಟಕೀಯ ಪ್ರಯೋಗ.",
            desc_swapna: "ಸ್ವಪ್ನ ಮತ್ತು ವಾಸ್ತವದ ನಡುವಿನ ಅಂತರವನ್ನು ಶೋಧಿಸುವ ಪ್ರಾಯೋಗಿಕ ನಾಟಕ.",
            btn_view_gallery: "ಗ್ಯಾಲರಿಯಲ್ಲಿ ನೋಡಿ",
            btn_view_more: "ಹೆಚ್ಚು ನೋಡಿ",
            btn_view_less: "ಕಡಿಮೆ ನೋಡಿ"
        }
    };

    window.switchLanguage = (lang) => {
        if (!translations[lang]) lang = 'en'; // Fallback to English if unknown language
        currentLang = lang;
        document.querySelectorAll("[data-t]").forEach(el => {
            const key = el.getAttribute("data-t");
            if (translations[lang][key]) {
                el.innerHTML = translations[lang][key];
            }
        });

        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`lang-${lang}`)?.classList.add('active');

        renderTheatreCalendar();
        try { localStorage.setItem("dhamani_lang", lang); } catch (e) { }
    };

    document.getElementById('lang-en')?.addEventListener('click', () => switchLanguage('en'));
    document.getElementById('lang-kn')?.addEventListener('click', () => switchLanguage('kn'));

    // (Language applied at bottom of script after variables are ready)
    // --- THEATRE CALENDAR ---
    let currentCalDate = new Date();
    const theatricalEvents = {
        "2026-05-24": { title: "Chiguru- kavyabandi", venue: "Thekkatte", time: "6:30 PM", kn_title: "ಚಿಗೂರು- ಕಾವ್ಯಬಂಡಿ", kn_venue: "ತೆಕ್ಕಟ್ಟೆ" },
        "2026-03-23": { title: "CHIGURU", venue: "Udupi Town Hall", time: "6:30 PM", kn_title: "ಚಿಗೂರು", kn_venue: "ಉಡುಪಿ ಟೌನ್ ಹಾಲ್" },
        "2026-03-03": { title: "SOORYA BANDA", venue: "Chowdiah Memorial Hall", time: "5:00 PM", kn_title: "ಸೂರ್ಯ ಬಂದ", kn_venue: "ಚೌಡಯ್ಯ ಮೆಮೋರಿಯಲ್ ಹಾಲ್" },
        "2026-02-26": { title: "SOORYA CHANDRA", venue: "Ranga Shankara", time: "6:30 PM", kn_title: "ಸೂರ್ಯ ಚಂದ್ರ", kn_venue: "ರಂಗ ಶಂಕರ" }
    };

    function renderTheatreCalendar() {
        const grid = document.getElementById('calendar-days-grid');
        const monthYearLabel = document.getElementById('current-month-year');
        if (!grid || !monthYearLabel) return;

        grid.innerHTML = '';
        const year = currentCalDate.getFullYear();
        const month = currentCalDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const monthNames = translations[currentLang].months;
        monthYearLabel.textContent = `${monthNames[month]} ${year}`;

        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'cal-day other-month';
            grid.appendChild(empty);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'cal-day';
            dayEl.innerHTML = `<span>${d}</span>`;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            if (theatricalEvents[dateStr]) dayEl.classList.add('has-event');

            // Pre-select today's date on initial load
            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && d === today.getDate()) {
                dayEl.classList.add('selected');
                setTimeout(() => {
                    updateTicketPanel(dateStr);
                }, 0);
            }

            dayEl.addEventListener('click', () => {
                document.querySelectorAll('.cal-day').forEach(el => el.classList.remove('selected'));
                dayEl.classList.add('selected');
                updateTicketPanel(dateStr);
            });
            grid.appendChild(dayEl);
        }
    }

    function updateTicketPanel(dateStr) {
        const infoContent = document.getElementById('calendar-info-content');
        if (!infoContent) return;
        const event = theatricalEvents[dateStr];
        const t = translations[currentLang];

        if (event) {
            infoContent.innerHTML = `
                <div class="ticket-icon" style="color:#C97A5A;"><i class="fa-solid fa-masks-theater"></i></div>
                <span class="ticket-label" style="opacity:1; color:#C97A5A; margin-bottom:1rem;">${t.catch_msg}</span>
                <h3 class="event-title" style="margin-top:0.5rem; font-size:1.4rem;">${currentLang === 'kn' ? event.kn_title : event.title}</h3>
                <div class="event-divider" style="width:30px; height:1px; background:rgba(140,90,60,0.2); margin:1rem auto;"></div>
                <p class="event-detail"><i class="fa-solid fa-location-dot"></i> ${currentLang === 'kn' ? event.kn_venue : event.venue}</p>
                <p class="event-detail"><i class="fa-solid fa-clock"></i> ${event.time}</p>
            `;
        } else {
            const msgs = t.resting_msgs;
            const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
            infoContent.innerHTML = `
                <div class="ticket-icon" style="opacity:0.3;"><i class="fa-solid fa-hourglass-start"></i></div>
                <p class="ticket-placeholder" style="font-family:'Lora', serif; font-style:italic; font-size:0.9rem; margin-top:1rem; color:var(--text-muted); padding:0 1rem; line-height:1.6;">${randomMsg}</p>
            `;
        }
    }

    document.querySelector('.prev-month')?.addEventListener('click', () => {
        currentCalDate.setMonth(currentCalDate.getMonth() - 1);
        renderTheatreCalendar();
    });
    document.querySelector('.next-month')?.addEventListener('click', () => {
        currentCalDate.setMonth(currentCalDate.getMonth() + 1);
        renderTheatreCalendar();
    });



    // --- INITIALIZATION ---
    let savedLang = "en";
    try { savedLang = localStorage.getItem("dhamani_lang") || "en"; } catch (e) { }
    switchLanguage(savedLang);
    renderTheatreCalendar();

    // Donation Modal Logic
    const openDonationBtn = document.getElementById("open-donation");
    const closeDonationBtn = document.getElementById("close-donation");
    const donationModal = document.getElementById("donation-modal");

    if (openDonationBtn && donationModal) {
        openDonationBtn.addEventListener("click", () => {
            donationModal.classList.add("active");
            document.body.style.overflow = "hidden";
        });
    }

    if (closeDonationBtn && donationModal) {
        closeDonationBtn.addEventListener("click", () => {
            donationModal.classList.remove("active");
            document.body.style.overflow = "auto";
        });
        donationModal.addEventListener("click", (e) => {
            if (e.target === donationModal) {
                donationModal.classList.remove("active");
                document.body.style.overflow = "auto";
            }
        });
    }



    // Donated/Later handlers
    document.querySelectorAll('.btn-exit-modal, .exit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            try { localStorage.setItem("donation_dismissed", "true"); } catch (e) { }
            closePopup('exit-popup');
        });
    });

    // --- UTILITY: POPUP HANDLER ---
    window.closePopup = (id) => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
        document.body.style.overflow = "auto";
    };

    // --- EXIT INTENT DETECTION ---
    document.addEventListener('mouseleave', (e) => {
        let dismissed = false;
        try { dismissed = localStorage.getItem('donation_dismissed'); } catch (err) { }
        if (e.clientY < 0 && !dismissed) {
            const exitPopup = document.getElementById('exit-popup');
            if (exitPopup) exitPopup.classList.add('active');
        }
    });

    // --- PAGE TRANSITION ANIMATION ---
    const transitionOverlay = document.querySelector('.page-transition-overlay');
    if (transitionOverlay) {
        // Entrance: Slide out the curtain
        window.addEventListener('load', () => {
            transitionOverlay.classList.add('exit');
            setTimeout(() => {
                transitionOverlay.classList.remove('active', 'exit');
                transitionOverlay.style.transform = ''; // reset for next use
            }, 800);
        });

        // Intercept link clicks for multi-page motion
        document.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            // Only transition if it's a relative link to another html page or index
            if (href && !href.startsWith('#') && !href.startsWith('http') && !href.includes('mailto:') && !href.includes('tel:')) {
                link.addEventListener('click', (e) => {
                    const target = link.href;
                    // Don't transition if it's the same page
                    if (target.split('#')[0] === window.location.href.split('#')[0]) return;

                    e.preventDefault();
                    transitionOverlay.classList.add('active');
                    setTimeout(() => {
                        window.location.href = target;
                    }, 700);
                });
            }
        });
    }

    // Manual trigger for those who want to support explicitly
    window.showDonationModal = () => {
        const exitPopup = document.getElementById('exit-popup');
        if (exitPopup) exitPopup.classList.add('active');
    };

    // --- BACK BUTTON INTERCEPTION (WORKS PAGES) ---
    let navigationTarget = '';

    // Add navigation utility
    window.closeNavigate = (id) => {
        try { localStorage.setItem("donation_dismissed", "true"); } catch (e) { }
        closePopup(id);
        if (navigationTarget) {
            window.location.href = navigationTarget;
        }
    };

    document.querySelectorAll('a[href^="index.html#"], a.btn-theatrical').forEach(btn => {
        if (btn.querySelector('.fa-arrow-left') && btn.getAttribute('href')) {
            btn.addEventListener('click', (e) => {
                // Temporarily bypassing localStorage check so you can test it:
                // let dismissed = false;
                // try { dismissed = localStorage.getItem('donation_dismissed'); } catch (err) { }
                // if (dismissed) return;

                e.preventDefault();
                navigationTarget = btn.getAttribute('href');
                let exitPopup = document.getElementById('exit-popup');

                if (!exitPopup) {
                    exitPopup = document.createElement('div');
                    exitPopup.id = 'exit-popup';
                    exitPopup.className = 'modal-overlay';
                    exitPopup.innerHTML = `
        <div class="modal-card-unified donation-exit-card">
            <button id="close-exit" class="modal-close" onclick="closeNavigate('exit-popup')">&times;</button>
            <div class="exit-header">
                <span class="exit-subtitle" data-t="exit_subtitle">A HUMBLE REQUEST</span>
                <h2 class="exit-title" data-t="exit_title">SUPPORT OUR STAGE</h2>
                <p class="exit-description" data-t="exit_desc">Your support keeps the flame alive.</p>
            </div>
            
            <div class="exit-qr-container">
                <img src="donation-qr.jpg" alt="Donation QR" class="exit-qr-image">
                <span class="exit-qr-label" data-t="exit_scan">[ SCAN TO DONATE ]</span>
            </div>

            <div class="exit-actions">
                <button class="btn-theatrical exit-btn primary-exit" data-t="btn_sure" onclick="closeNavigate('exit-popup')">SURE!</button>
            </div>
        </div>`;
                    document.body.appendChild(exitPopup);

                    // apply translations if necessary
                    try {
                        const lang = localStorage.getItem("dhamani_lang") || 'en';
                        exitPopup.querySelectorAll("[data-t]").forEach(el => {
                            const key = el.getAttribute("data-t");
                            if (translations[lang] && translations[lang][key]) {
                                el.innerHTML = translations[lang][key];
                            }
                        });
                    } catch (err) { }
                }

                // Override existing buttons to navigate instead of just close
                const primaryExit = exitPopup.querySelector('.primary-exit');
                const secondaryExit = exitPopup.querySelector('.secondary-exit');
                const closeBtn = exitPopup.querySelector('.modal-close');

                if (primaryExit) primaryExit.setAttribute('onclick', "closeNavigate('exit-popup')");
                if (secondaryExit) secondaryExit.setAttribute('onclick', "closeNavigate('exit-popup')");
                if (closeBtn) closeBtn.setAttribute('onclick', "closeNavigate('exit-popup')");

                exitPopup.classList.add('active');
            });
        }
    });

    // --- GALLERY LIGHTBOX HANDLERS ---
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    if (lightboxModal && lightboxImg && lightboxCaption && lightboxClose) {
        document.querySelectorAll('.gallery-item-card').forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('.gallery-img');
                const captionText = card.getAttribute('data-caption');
                if (img) {
                    lightboxImg.src = img.src;
                    lightboxCaption.textContent = captionText || "";
                    lightboxModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const closeLightbox = () => {
            lightboxModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // --- GALLERY VIEW MORE HANDLERS ---
    document.querySelectorAll('.btn-view-more').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetGrid = document.getElementById(targetId);
            if (!targetGrid) return;
            
            const hiddenItems = targetGrid.querySelectorAll('.gallery-item-card.hidden-item');
            const hasCollapsed = hiddenItems.length > 0;
            
            if (hasCollapsed) {
                hiddenItems.forEach(item => {
                    item.classList.remove('hidden-item');
                    item.classList.add('fade-in-item');
                });
                btn.setAttribute('data-t', 'btn_view_less');
                btn.textContent = translations[currentLang]['btn_view_less'] || "VIEW LESS";
            } else {
                const expandedItems = targetGrid.querySelectorAll('.gallery-item-card.fade-in-item');
                expandedItems.forEach(item => {
                    item.classList.remove('fade-in-item');
                    item.classList.add('hidden-item');
                });
                btn.setAttribute('data-t', 'btn_view_more');
                btn.textContent = translations[currentLang]['btn_view_more'] || "VIEW MORE";
            }
        });
    });

    // --- AUTO-EXPAND GALLERY ON HASH NAVIGATION ---
    // When arriving from work-chiguru.html via VIEW PHOTOS button,
    // automatically expand the targeted gallery section and scroll to it.
    function expandGalleryFromHash() {
        const hash = window.location.hash; // e.g. #gallery-sb-grid or #gallery-sc-grid
        if (!hash) return;

        const targetGrid = document.getElementById(hash.replace('#', ''));
        if (!targetGrid) return;

        // Expand all hidden items in this grid
        const hiddenItems = targetGrid.querySelectorAll('.gallery-item-card.hidden-item');
        hiddenItems.forEach(item => {
            item.classList.remove('hidden-item');
            item.classList.add('fade-in-item');
        });

        // Update the VIEW MORE button text to VIEW LESS
        const viewMoreBtn = document.querySelector(`.btn-view-more[data-target="${hash.replace('#', '')}"]`);
        if (viewMoreBtn && hiddenItems.length > 0) {
            viewMoreBtn.setAttribute('data-t', 'btn_view_less');
            viewMoreBtn.textContent = translations[currentLang]['btn_view_less'] || "VIEW LESS";
        }

        // Smoothly scroll to the gallery category container (parent of the grid)
        setTimeout(() => {
            const categoryContainer = targetGrid.closest('.gallery-category-container');
            const scrollTarget = categoryContainer || targetGrid;
            scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 400);
    }

    expandGalleryFromHash();
});
