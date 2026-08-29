(() => {
  "use strict";

  const config = window.INVITATION_CONFIG || {};
  const qs = (selector) => document.querySelector(selector);
  const setText = (selector, value) => {
    const el = qs(selector);
    if (el && value !== undefined && value !== null && value !== "") el.textContent = value;
  };

  // ---------- Guest name from URL ----------
  // Example: ?to=Kingsman%20%26%20Ashanty
  const params = new URLSearchParams(window.location.search);
  const guest = (params.get("to") || "").trim();
  const guestDisplay = guest || "Bapak/Ibu/Saudara/i";
  setText("#guestName", guestDisplay);

  // ---------- Populate content from config.js ----------
  if (config.anniversary) {
    setText("#eventDateLabel", config.anniversary.dateLabel);
    setText("#eventTimeLabel", config.anniversary.timeLabel);
  }
  if (config.venue) {
    setText("#venueName", config.venue.name);
    setText("#venueAddress", config.venue.address);
    const maps = qs("#mapsButton");
    if (maps && config.venue.mapsUrl) maps.href = config.venue.mapsUrl;
  }

  // ---------- Decorative falling petals ----------
  const petalFields = document.querySelectorAll(".petal-field");
  petalFields.forEach((field) => {
    const petalCount = window.matchMedia("(max-width: 520px)").matches ? 15 : 22;
    for (let i = 0; i < petalCount; i += 1) {
      const petal = document.createElement("i");
      petal.className = "falling-petal";
      petal.style.setProperty("--x", `${Math.random() * 100}%`);
      const drift = -55 + Math.random() * 110;
      petal.style.setProperty("--drift", `${drift}px`);
      petal.style.setProperty("--drift-back", `${drift * -0.35}px`);
      petal.style.setProperty("--drift-end", `${drift * 0.7}px`);
      petal.style.setProperty("--delay", `${-Math.random() * 14}s`);
      petal.style.setProperty("--duration", `${9 + Math.random() * 9}s`);
      petal.style.setProperty("--scale", `${0.55 + Math.random() * 0.85}`);
      field.appendChild(petal);
    }
  });

  // ---------- YouTube background music ----------
  // The supplied YouTube video is embedded; the site does NOT download or redistribute the song.
  const musicButton = qs("#musicButton");
  const musicConfig = config.music || {};
  const youtubeVideoId = String(musicConfig.videoId || "").trim();
  let ytPlayer = null;
  let ytReady = false;
  let pendingPlay = false;
  let musicPlaying = false;

  function setMusicState(playing) {
    musicPlaying = Boolean(playing);
    if (!musicButton) return;
    musicButton.hidden = !ytReady;
    musicButton.classList.toggle("playing", musicPlaying);
    musicButton.setAttribute("aria-label", musicPlaying ? "Jeda musik" : "Putar musik");
  }

  function loadYouTubeAPI() {
    if (!youtubeVideoId) return;
    const oldCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof oldCallback === "function") oldCallback();
      createYouTubePlayer();
    };

    if (window.YT && window.YT.Player) {
      createYouTubePlayer();
      return;
    }

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }
  }

  function createYouTubePlayer() {
    if (!youtubeVideoId || ytPlayer || !window.YT?.Player) return;

    ytPlayer = new window.YT.Player("youtubePlayer", {
      width: "1",
      height: "1",
      videoId: youtubeVideoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        loop: 1,
        playlist: youtubeVideoId,
        modestbranding: 1,
        playsinline: 1,
        rel: 0,
        start: Number(musicConfig.startSeconds || 0)
      },
      events: {
        onReady: () => {
          ytReady = true;
          setMusicState(false);
          // If opening happened before the player was ready, show the music button.
          // Some mobile browsers require one more tap in this edge case.
          if (pendingPlay) {
            tryPlayMusic();
          }
        },
        onStateChange: (event) => {
          if (!window.YT) return;
          if (event.data === window.YT.PlayerState.PLAYING) setMusicState(true);
          if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) setMusicState(false);
        },
        onError: () => {
          ytReady = false;
          if (musicButton) musicButton.hidden = true;
        }
      }
    });
  }

  function tryPlayMusic() {
    if (!youtubeVideoId) return;
    if (!ytReady || !ytPlayer?.playVideo) {
      pendingPlay = true;
      return;
    }
    pendingPlay = false;
    try {
      ytPlayer.playVideo();
      if (typeof ytPlayer.setVolume === "function") ytPlayer.setVolume(65);
    } catch (_) {
      // The floating music button remains available for browsers that require an extra tap.
    }
  }

  loadYouTubeAPI();

  musicButton?.addEventListener("click", () => {
    if (!ytReady || !ytPlayer) return;
    try {
      if (musicPlaying) ytPlayer.pauseVideo();
      else ytPlayer.playVideo();
    } catch (_) {}
  });

  // ---------- Cover ----------
  const cover = qs("#cover");
  const openButton = qs("#openInvitation");
  document.body.classList.add("cover-open");

  openButton?.addEventListener("click", () => {
    cover?.classList.add("is-open");
    document.body.classList.remove("cover-open");
    tryPlayMusic();
    setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 50);
  });

  // ---------- Countdown ----------
  const eventTime = config.anniversary?.dateISO
    ? new Date(config.anniversary.dateISO).getTime()
    : new Date("2026-09-12T18:30:00+07:00").getTime();

  function updateCountdown() {
    const now = Date.now();
    const distance = eventTime - now;
    const status = qs("#countdownStatus");

    if (distance <= 0) {
      ["#days", "#hours", "#minutes", "#seconds"].forEach((id) => setText(id, "00"));
      if (status) status.textContent = "Hari bahagia telah tiba. Terima kasih telah menjadi bagian dari momen kami ❤️";
      return;
    }

    const d = Math.floor(distance / 86400000);
    const h = Math.floor((distance % 86400000) / 3600000);
    const m = Math.floor((distance % 3600000) / 60000);
    const s = Math.floor((distance % 60000) / 1000);

    setText("#days", String(d));
    setText("#hours", String(h).padStart(2, "0"));
    setText("#minutes", String(m).padStart(2, "0"));
    setText("#seconds", String(s).padStart(2, "0"));
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---------- Reveal on scroll ----------
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  // ---------- RSVP via WhatsApp ----------
  const rsvpForm = qs("#rsvpForm");
  const rsvpName = qs("#rsvpName");
  const rsvpAttendance = qs("#rsvpAttendance");
  const rsvpGuests = qs("#rsvpGuests");
  if (rsvpName) rsvpName.value = guest || "";

  // Keep the guest count consistent with the attendance choice.
  rsvpAttendance?.addEventListener("change", () => {
    if (!rsvpGuests) return;
    if (rsvpAttendance.value === "Tidak dapat hadir") {
      rsvpGuests.value = "0";
    } else if (rsvpAttendance.value === "Hadir" && rsvpGuests.value === "0") {
      rsvpGuests.value = "";
    }
  });

  rsvpForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = qs("#rsvpName")?.value.trim() || guestDisplay;
    const attendance = qs("#rsvpAttendance")?.value || "Belum memilih";
    const guests = qs("#rsvpGuests")?.value || "0";
    const message = qs("#rsvpMessage")?.value.trim() || "-";

    const lines = [
      "RSVP 50th Wedding Anniversary",
      `${config.couple?.person1 || "Yiu Hok Cuan"} & ${config.couple?.person2 || "Tok A Kiok"}`,
      "",
      `Nama: ${name}`,
      `Kehadiran: ${attendance}`,
      `Jumlah tamu yang akan hadir: ${guests} orang`,
      `Jamuan: Ciak Tok / makan bersama di meja`,
      `Ucapan/Pesan: ${message}`
    ];

    const text = encodeURIComponent(lines.join("\n"));
    const phone = String(config.whatsappNumber || "").replace(/\D/g, "");
    const url = phone
      ? `https://wa.me/${phone}?text=${text}`
      : `https://wa.me/?text=${text}`;

    window.open(url, "_blank", "noopener,noreferrer");
  });
})();
