/**
 * Indhu's Birthday Celebration - Enhanced Interactive Script
 * Responsive • Web Audio Lo-Fi Synth • Confetti • Interactive Cake • Memory Wall
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. LIVE AGE & TIME STATS COUNTER
  // ==========================================
  const birthDate = new Date('2005-10-24T00:00:00');

  const elYears = document.getElementById('val-years');
  const elMonths = document.getElementById('val-months');
  const elDays = document.getElementById('val-days');
  const elHours = document.getElementById('val-hours');
  const elMinutes = document.getElementById('val-minutes');
  const elSeconds = document.getElementById('val-seconds');

  function updateAge() {
    const now = new Date();

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    let hours = now.getHours() - birthDate.getHours();
    let minutes = now.getMinutes() - birthDate.getMinutes();
    let seconds = now.getSeconds() - birthDate.getSeconds();

    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) { months += 12; years--; }

    if (elYears) elYears.textContent = years;
    if (elMonths) elMonths.textContent = months;
    if (elDays) elDays.textContent = days;
    if (elHours) elHours.textContent = String(hours).padStart(2, '0');
    if (elMinutes) elMinutes.textContent = String(minutes).padStart(2, '0');
    if (elSeconds) elSeconds.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateAge, 1000);
  updateAge();


  // ==========================================
  // 2. AOS ANIMATIONS INITIALIZATION
  // ==========================================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      disable: window.innerWidth < 640 ? 'mobile' : false // smooth performance on mobile
    });
  }


  // ==========================================
  // 3. HALL OF FAME CAROUSEL SCROLLER
  // ==========================================
  const scroller = document.getElementById('hall-of-fame-scroller');
  const scrollLeftBtn = document.getElementById('scroll-left-btn');
  const scrollRightBtn = document.getElementById('scroll-right-btn');

  if (scroller && scrollLeftBtn && scrollRightBtn) {
    function getScrollStep() {
      const firstCard = scroller.querySelector('.hall-card');
      return firstCard ? firstCard.offsetWidth + 24 : 300;
    }

    scrollRightBtn.addEventListener('click', () => {
      scroller.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });

    scrollLeftBtn.addEventListener('click', () => {
      scroller.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });
  }


  // ==========================================
  // 4. LIGHTGALLERY INITIALIZATION
  // ==========================================
  const galleryElem = document.getElementById('lightgallery');
  if (galleryElem && typeof lightGallery !== 'undefined') {
    lightGallery(galleryElem, {
      speed: 400,
      download: false,
      selector: '.gallery-item',
      mobileSettings: {
        controls: true,
        showCloseIcon: true,
        download: false
      }
    });
  }

  // Gallery "View All / Show Less" Toggle
  const toggleMorePhotosBtn = document.getElementById('toggle-more-photos');
  const extraPhotosContainer = document.getElementById('extra-photos');

  if (toggleMorePhotosBtn && extraPhotosContainer) {
    toggleMorePhotosBtn.addEventListener('click', () => {
      const isHidden = extraPhotosContainer.classList.contains('hidden');
      if (isHidden) {
        extraPhotosContainer.classList.remove('hidden');
        toggleMorePhotosBtn.innerHTML = '<span>Show Fewer Photos</span> <i class="fa-solid fa-chevron-up ml-2"></i>';
      } else {
        extraPhotosContainer.classList.add('hidden');
        toggleMorePhotosBtn.innerHTML = '<span>Explore All Memories (40+ Photos)</span> <i class="fa-solid fa-chevron-down ml-2"></i>';
      }
      if (typeof AOS !== 'undefined') AOS.refresh();
    });
  }


  // ==========================================
  // 5. INTERACTIVE BIRTHDAY CAKE & CANDLE BLOW
  // ==========================================
  const candles = document.querySelectorAll('.flame');
  const blowButton = document.getElementById('blow-candles-btn');
  const wishModal = document.getElementById('wish-modal');
  const closeWishModal = document.getElementById('close-wish-modal');

  let candlesBlown = 0;
  const totalCandles = candles.length;

  function triggerCelebration() {
    // Fire festive confetti barrage
    if (typeof confetti === 'function') {
      const count = 200;
      const defaults = { origin: { y: 0.7 }, zIndex: 9999 };

      function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        }));
      }

      fire(0.25, { spread: 26, startVelocity: 55, colors: ['#ff758c', '#ffb7c5', '#ffd166'] });
      fire(0.2, { spread: 60, colors: ['#ffffff', '#ff4d6d', '#38bdf8'] });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#f472b6', '#fbbf24', '#c084fc'] });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ['#ff758c', '#ffd166'] });
      fire(0.1, { spread: 120, startVelocity: 45, colors: ['#38bdf8', '#ffb7c5', '#ffffff'] });
    }

    // Play celebration audio chime
    playCelebrationChime();

    // Show wish modal with a brief suspense delay
    setTimeout(() => {
      if (wishModal) {
        wishModal.classList.remove('hidden');
        wishModal.classList.add('flex');
      }
    }, 800);
  }

  candles.forEach(flame => {
    flame.addEventListener('click', () => {
      if (!flame.classList.contains('out')) {
        flame.classList.add('out');
        candlesBlown++;
        playSoftChime(500 + candlesBlown * 80);

        if (candlesBlown === totalCandles) {
          triggerCelebration();
        }
      }
    });
  });

  if (blowButton) {
    blowButton.addEventListener('click', () => {
      candles.forEach(flame => flame.classList.add('out'));
      candlesBlown = totalCandles;
      triggerCelebration();
    });
  }

  if (closeWishModal && wishModal) {
    closeWishModal.addEventListener('click', () => {
      wishModal.classList.add('hidden');
      wishModal.classList.remove('flex');
    });
  }





  // ==========================================
  // 7. FLOATING HEARTS & CONFETTI REACTION
  // ==========================================
  const loveReactionBtn = document.getElementById('floating-love-btn');

  function spawnFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    const emojis = ['💖', '🌸', '✨', '🎂', '🐾', '🎀'];
    heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    heart.style.left = (x || (window.innerWidth - 60)) + 'px';
    heart.style.top = (y || (window.innerHeight - 80)) + 'px';
    heart.style.fontSize = (22 + Math.random() * 16) + 'px';
    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 2500);
  }

  if (loveReactionBtn) {
    loveReactionBtn.addEventListener('click', (e) => {
      const rect = loveReactionBtn.getBoundingClientRect();
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          spawnFloatingHeart(rect.left + Math.random() * 20, rect.top - Math.random() * 30);
        }, i * 120);
      }
      playSoftChime(600 + Math.random() * 200);
    });
  }


  // ==========================================
  // 8. LO-FI WEB AUDIO API SYNTHESIZER
  // Gentle Anime Piano Melody for "Happy Birthday"
  // Zero external MP3 needed • Always 100% works!
  // ==========================================
  let audioCtx = null;
  let isPlayingMusic = false;
  let melodyTimeout = null;

  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const heroMusicBtn = document.getElementById('hero-music-btn');
  const musicIcon = document.getElementById('music-icon');
  const musicStatusText = document.getElementById('music-status-text');

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSoftChime(freq = 660) {
    try {
      initAudioContext();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {}
  }

  function playCelebrationChime() {
    try {
      initAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 arpeggio
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          playSoftChime(freq);
        }, idx * 120);
      });
    } catch (e) {}
  }

  // "Happy Birthday" Notes & Durations (in seconds)
  // Notes: G4, G4, A4, G4, C5, B4, G4, G4, A4, G4, D5, C5...
  const birthdayMelody = [
    { note: 392.00, dur: 0.35, pause: 0.45 }, // G4
    { note: 392.00, dur: 0.35, pause: 0.45 }, // G4
    { note: 440.00, dur: 0.70, pause: 0.85 }, // A4
    { note: 392.00, dur: 0.70, pause: 0.85 }, // G4
    { note: 523.25, dur: 0.70, pause: 0.85 }, // C5
    { note: 493.88, dur: 1.20, pause: 1.40 }, // B4

    { note: 392.00, dur: 0.35, pause: 0.45 }, // G4
    { note: 392.00, dur: 0.35, pause: 0.45 }, // G4
    { note: 440.00, dur: 0.70, pause: 0.85 }, // A4
    { note: 392.00, dur: 0.70, pause: 0.85 }, // G4
    { note: 587.33, dur: 0.70, pause: 0.85 }, // D5
    { note: 523.25, dur: 1.20, pause: 1.40 }, // C5

    { note: 392.00, dur: 0.35, pause: 0.45 }, // G4
    { note: 392.00, dur: 0.35, pause: 0.45 }, // G4
    { note: 783.99, dur: 0.70, pause: 0.85 }, // G5
    { note: 659.25, dur: 0.70, pause: 0.85 }, // E5
    { note: 523.25, dur: 0.70, pause: 0.85 }, // C5
    { note: 493.88, dur: 0.70, pause: 0.85 }, // B4
    { note: 440.00, dur: 0.90, pause: 1.10 }, // A4

    { note: 698.46, dur: 0.35, pause: 0.45 }, // F5
    { note: 698.46, dur: 0.35, pause: 0.45 }, // F5
    { note: 659.25, dur: 0.70, pause: 0.85 }, // E5
    { note: 523.25, dur: 0.70, pause: 0.85 }, // C5
    { note: 587.33, dur: 0.70, pause: 0.85 }, // D5
    { note: 523.25, dur: 1.60, pause: 2.20 }  // C5
  ];

  function playPianoTone(freq, duration) {
    if (!audioCtx || !isPlayingMusic) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    // Gentle warm lo-fi triangle & low-pass filtering
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, audioCtx.currentTime);

    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  function startLoFiMelody(noteIdx = 0) {
    if (!isPlayingMusic) return;

    if (noteIdx >= birthdayMelody.length) {
      // Loop with warm pause
      melodyTimeout = setTimeout(() => {
        startLoFiMelody(0);
      }, 2000);
      return;
    }

    const currentNote = birthdayMelody[noteIdx];
    playPianoTone(currentNote.note, currentNote.dur);

    melodyTimeout = setTimeout(() => {
      startLoFiMelody(noteIdx + 1);
    }, currentNote.pause * 1000);
  }

  function toggleMusic() {
    initAudioContext();
    isPlayingMusic = !isPlayingMusic;

    if (isPlayingMusic) {
      if (musicIcon) {
        musicIcon.classList.remove('fa-music');
        musicIcon.classList.add('fa-pause');
      }
      if (musicToggleBtn) {
        musicToggleBtn.classList.add('spinning-record');
        musicToggleBtn.classList.remove('paused-record');
      }
      if (musicStatusText) musicStatusText.textContent = 'Pause Lo-Fi';
      startLoFiMelody(0);
    } else {
      if (musicIcon) {
        musicIcon.classList.remove('fa-pause');
        musicIcon.classList.add('fa-music');
      }
      if (musicToggleBtn) {
        musicToggleBtn.classList.add('paused-record');
      }
      if (musicStatusText) musicStatusText.textContent = 'Play Melody';
      if (melodyTimeout) clearTimeout(melodyTimeout);
    }
  }

  if (musicToggleBtn) musicToggleBtn.addEventListener('click', toggleMusic);
  if (heroMusicBtn) heroMusicBtn.addEventListener('click', toggleMusic);


  // ==========================================
  // 9. HIGH-PERFORMANCE SAKURA PETALS CANVAS
  // Mobile-Responsive • Gentle Breeze Dynamics
  // ==========================================
  const canvas = document.getElementById('sakura-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let petals = [];
    const isMobile = window.innerWidth < 640;
    const numPetals = isMobile ? 24 : 45; // Dynamic throttle for battery & performance

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function Petal() {
      this.reset();
    }

    Petal.prototype.reset = function() {
      this.x = Math.random() * canvas.width;
      this.y = -20 - Math.random() * 50;
      this.w = 14 + Math.random() * 14;
      this.h = 10 + Math.random() * 10;
      this.opacity = 0.4 + Math.random() * 0.45;
      this.flip = Math.random() * Math.PI;
      this.xSpeed = 0.6 + Math.random() * 1.4;
      this.ySpeed = 0.8 + Math.random() * 1.2;
      this.flipSpeed = 0.015 + Math.random() * 0.02;
      this.color = Math.random() > 0.4 ? '#ffb7c5' : '#ffccd5';
    };

    Petal.prototype.draw = function() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.flip);
      ctx.scale(Math.sin(this.flip), 1);
      ctx.globalAlpha = this.opacity;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(this.w / 2, -this.h / 2, this.w, 0, this.w / 2, this.h / 2);
      ctx.bezierCurveTo(0, this.h, -this.w / 2, 0, 0, 0);
      ctx.closePath();

      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    };

    Petal.prototype.update = function() {
      this.x += this.xSpeed;
      this.y += this.ySpeed;
      this.flip += this.flipSpeed;

      if (this.y > canvas.height + 30 || this.x > canvas.width + 30) {
        this.reset();
      }
      this.draw();
    };

    function initPetals() {
      petals = [];
      for (let i = 0; i < numPetals; i++) {
        const p = new Petal();
        p.y = Math.random() * canvas.height;
        petals.push(p);
      }
    }

    let animationFrameId;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < petals.length; i++) {
        petals[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    initPetals();
    animate();

    // Pause animation when tab is inactive to save battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animate();
      }
    });
  }

});
