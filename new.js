document.addEventListener("DOMContentLoaded", () => {

  const spreads = Array.from(
    document.querySelectorAll(".spread")
  );

  const book =
    document.getElementById("book");

  const prevBtn =
    document.getElementById("prevBtn");

  const nextBtn =
    document.getElementById("nextBtn");

  const bottomPrev =
    document.getElementById("bottomPrev");

  const bottomNext =
    document.getElementById("bottomNext");

  const pageIndicator =
    document.getElementById("pageIndicator");

  const progressBar =
    document.getElementById("progressBar");

  const musicBtn =
    document.getElementById("musicBtn");

  const music =
    document.getElementById("bgMusic");


  let currentSpread = 0;
  let isAnimating = false;

  let touchStartX = 0;
  let touchEndX = 0;


  /* ===============================
     INITIALIZE
  ================================ */

  function initializeBook() {

    spreads.forEach((spread, index) => {

      spread.classList.remove(
        "active",
        "flip-next",
        "flip-prev"
      );

      if (index === 0) {
        spread.classList.add("active");
      }

    });

    updateUI();
  }


  /* ===============================
     UPDATE UI
  ================================ */

  function updateUI() {

    const total = spreads.length;

    pageIndicator.textContent =
      `Page ${currentSpread + 1} of ${total}`;


    const progress =
      total > 1
        ? (currentSpread / (total - 1)) * 100
        : 0;


    progressBar.style.width =
      `${progress}%`;


    /* Previous */

    if (currentSpread === 0) {

      prevBtn.classList.add("disabled");
      bottomPrev.style.opacity = "0.35";
      bottomPrev.style.pointerEvents = "none";

    } else {

      prevBtn.classList.remove("disabled");
      bottomPrev.style.opacity = "1";
      bottomPrev.style.pointerEvents = "auto";

    }


    /* Next */

    if (currentSpread === total - 1) {

      nextBtn.classList.add("disabled");
      bottomNext.style.opacity = "0.35";
      bottomNext.style.pointerEvents = "none";

    } else {

      nextBtn.classList.remove("disabled");
      bottomNext.style.opacity = "1";
      bottomNext.style.pointerEvents = "auto";

    }

  }


  /* ===============================
     NEXT
  ================================ */

  function nextPage() {

    if (isAnimating) return;

    if (
      currentSpread >= spreads.length - 1
    ) {
      return;
    }


    isAnimating = true;


    const current =
      spreads[currentSpread];

    const next =
      spreads[currentSpread + 1];


    /*
      NEXT PAGE READY
    */

    next.classList.add("active");


    /*
      CURRENT FLIP
    */

    current.classList.add("flip-next");


    /*
      Animation finish
    */

    setTimeout(() => {

      current.classList.remove(
        "active",
        "flip-next"
      );

      currentSpread++;

      updateUI();

      isAnimating = false;

    }, 800);

  }


  /* ===============================
     PREVIOUS
  ================================ */

  function previousPage() {

    if (isAnimating) return;

    if (currentSpread <= 0) {
      return;
    }


    isAnimating = true;


    const current =
      spreads[currentSpread];

    const previous =
      spreads[currentSpread - 1];


    /*
      Previous page behind
    */

    previous.classList.add("active");


    /*
      Current flips backwards
    */

    current.classList.add("flip-prev");


    setTimeout(() => {

      current.classList.remove(
        "active",
        "flip-prev"
      );

      currentSpread--;

      updateUI();

      isAnimating = false;

    }, 800);

  }


  /* ===============================
     BUTTON EVENTS
  ================================ */

  nextBtn.addEventListener(
    "click",
    nextPage
  );


  prevBtn.addEventListener(
    "click",
    previousPage
  );


  bottomNext.addEventListener(
    "click",
    nextPage
  );


  bottomPrev.addEventListener(
    "click",
    previousPage
  );


  /* ===============================
     CLICK NAVIGATION
  ================================ */

  book.addEventListener(
    "click",
    (event) => {

      if (
        event.target.closest("a") ||
        event.target.closest("button")
      ) {
        return;
      }


      const rect =
        book.getBoundingClientRect();

      const clickX =
        event.clientX - rect.left;


      if (
        clickX > rect.width / 2
      ) {

        nextPage();

      } else {

        previousPage();

      }

    }
  );


  /* ===============================
     SWIPE
  ================================ */

  book.addEventListener(
    "touchstart",
    (event) => {

      touchStartX =
        event.changedTouches[0].clientX;

    },
    {
      passive: true
    }
  );


  book.addEventListener(
    "touchend",
    (event) => {

      touchEndX =
        event.changedTouches[0].clientX;


      const difference =
        touchStartX - touchEndX;


      if (
        Math.abs(difference) < 40
      ) {
        return;
      }


      if (difference > 0) {

        nextPage();

      } else {

        previousPage();

      }

    },
    {
      passive: true
    }
  );


  /* ===============================
     KEYBOARD
  ================================ */

  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "ArrowRight"
      ) {
        nextPage();
      }


      if (
        event.key === "ArrowLeft"
      ) {
        previousPage();
      }

    }
  );


  /* ===============================
     MUSIC
  ================================ */

  musicBtn.addEventListener(
    "click",
    (event) => {

      event.stopPropagation();


      if (music.paused) {

        music.play()
          .then(() => {

            musicBtn.textContent = "♫";

          })
          .catch(() => {});

      } else {

        music.pause();

        musicBtn.textContent = "♪";

      }

    }
  );


  /* ===============================
     AUTO MUSIC AFTER INTERACTION
  ================================ */

  document.addEventListener(
    "click",
    () => {

      if (music.paused) {

        music.play()
          .then(() => {

            musicBtn.textContent = "♫";

          })
          .catch(() => {});

      }

    },
    {
      once: true
    }
  );


  /* ===============================
     PREVENT IMAGE DRAG
  ================================ */

  document
    .querySelectorAll("img")
    .forEach((img) => {

      img.addEventListener(
        "dragstart",
        (event) => {

          event.preventDefault();

        }
      );

    });


  /* ===============================
     START
  ================================ */

  initializeBook();

});