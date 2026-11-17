(function () {
  window.Components = window.Components || {};

  function startFireflies(host) {
    if (!host || host.querySelector("#fireflies-canvas")) return;
    const canvas = document.createElement("canvas");
    canvas.id = "fireflies-canvas";
    host.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const fireflies = [];
    const COUNT = 42;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    for (let i = 0; i < COUNT; i++) {
      fireflies.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 15 + Math.random() * (window.innerHeight * 0.6),
        r: 1.5 + Math.random() * 2.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.55 + Math.random() * 0.95),
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
        hue: Math.random() > 0.35 ? "#fde047" : "#bef264",
      });
    }

    resize();
    window.addEventListener("resize", resize);

    function spawnBurstFireflies(x, y, count) {
      for (let i = 0; i < count; i++) {
        fireflies.push({
          x: x + (Math.random() - 0.5) * 30,
          y: y + (Math.random() - 0.5) * 30,
          r: 1.6 + Math.random() * 2.8,
          vx: (Math.random() - 0.5) * 1.4,
          vy: -(0.7 + Math.random() * 1.4),
          phase: Math.random() * Math.PI * 2,
          speed: 0.03 + Math.random() * 0.04,
          hue: Math.random() > 0.3 ? "#fde047" : "#bef264",
          temporary: true,
          life: 1.0,
        });
      }
      if (fireflies.length > 180) {
        fireflies.splice(0, fireflies.length - 180);
      }
    }

    let lastMoveSpawn = 0;
    host.addEventListener("pointerdown", (e) => {
      spawnBurstFireflies(e.clientX, e.clientY, 12);
    });
    host.addEventListener("pointermove", (e) => {
      const now = performance.now();
      if (now - lastMoveSpawn > 65) {
        lastMoveSpawn = now;
        spawnBurstFireflies(e.clientX, e.clientY, 3);
      }
    });

    requestAnimationFrame(() => canvas.classList.add("is-visible"));

    function loop() {
      if (!document.body.contains(canvas)) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = fireflies.length - 1; i >= 0; i--) {
        const f = fireflies[i];
        f.x += f.vx + Math.sin(f.phase * 0.7) * 0.35;
        f.y += f.vy;
        f.phase += f.speed;

        if (f.temporary) {
          f.life -= 0.008;
          if (f.life <= 0) {
            fireflies.splice(i, 1);
            continue;
          }
        } else {
          if (f.x < -10) f.x = window.innerWidth + 10;
          if (f.x > window.innerWidth + 10) f.x = -10;
          if (f.y < -15) {
            f.y = window.innerHeight + 15;
            f.x = Math.random() * window.innerWidth;
          }
        }

        const baseAlpha = 0.25 + 0.7 * (0.5 + 0.5 * Math.sin(f.phase));
        const alpha = f.temporary ? baseAlpha * f.life : baseAlpha;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 14;
        ctx.shadowColor = f.hue;
        ctx.fillStyle = f.hue;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
  }

  function fadeOutCodeWords(codeEl, onDone) {
    if (!codeEl) {
      if (onDone) onDone();
      return;
    }

    const walker = document.createTreeWalker(codeEl, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue && node.nodeValue.trim().length > 0) {
        textNodes.push(node);
      }
    }

    textNodes.forEach((tn) => {
      const frag = document.createDocumentFragment();
      const parts = tn.nodeValue.split(/(\s+)/);
      parts.forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement("span");
          span.className = "code-word";
          span.textContent = part;
          frag.appendChild(span);
        }
      });
      tn.parentNode.replaceChild(frag, tn);
    });

    const words = codeEl.querySelectorAll(".code-word");
    if (!words.length) {
      codeEl.classList.add("is-hidden");
      if (onDone) onDone();
      return;
    }

    gsap.to(words, {
      opacity: 0,
      duration: 0.35,
      stagger: 0.03,
      ease: "power1.out",
      onComplete: () => {
        codeEl.classList.add("is-hidden");
        if (onDone) onDone();
      },
    });
  }

  function openTeaseModal(section) {
    let existing = document.getElementById("tease-modal-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "tease-modal-overlay";
    overlay.className = "tease-modal-overlay";

    const teaseText =
      section.teaseText || "Cieee, ga sabar ya mau liat isinya? 😜";
    const yesText = section.yesText || "Iya, mau liat! ❤️";
    const noText = section.noText || "Enggak 😝";

    overlay.innerHTML = `
      <div class="tease-modal-card" id="tease-step-1">
        <p class="tease-emoji" id="tease-emoji">🤭</p>
        <h3 class="tease-title" id="tease-title">${teaseText}</h3>
        <div class="tease-actions">
          <button type="button" class="tease-btn tease-btn-yes" id="tease-yes">${yesText}</button>
          <button type="button" class="tease-btn tease-btn-no" id="tease-no">${noText}</button>
        </div>
      </div>
      <div class="bday-modal-card" id="tease-step-2" style="display:none;">
        <div id="mainDiv">
          <div id="content">
            <div id="code">
              <span class="comments">/**</span><br />
              <span class="space"></span><span class="comments">* Today, the 18th of November, is your birthday.</span><br />
              <span class="space"></span><span class="comments">* So I created this little page to celebrate your extraordinary day.</span><br />
              <span class="space"></span><span class="comments">* That page will show you a script 'will.sh'.</span><br />
              <span class="space"></span><span class="comments">*/</span><br />
              birthday@delvina ~ $ &gt;&gt; <span class="keyword">cd love &amp;&amp; sh </span> will.sh(<span class="string">"Delvina Syaifira Norma Hani"</span>);<br />
              <span class="comments">// November 18, when the bell rang, your age increased</span><br />
              Date currentTime = <span class="keyword">new</span> Date();<br />
              SimpleDateFormat formatter = <span class="keyword">new</span> SimpleDateFormat(<span class="string">"yyyy-MM-dd HH:mm:ss"</span>);<br />
              String dateString = formatter.format(currentTime);<br />
              if (dateString.equals(<span class="string">"2026-11-18 00:00:00"</span>)) {<br />
              &nbsp;&nbsp;u.age++;<br />
              }<br /><br />
              <span class="keyword">new</span> Thread() {<br />
              @Override<br />
              <span class="comments">// I wish you</span><br />
              while (true) {<br />
              <span class="comments">// endless happiness,</span><br />
              u.happiness++;<br />
              <span class="comments">// strength &amp; good health,</span><br />
              u.strength++;<br />
              <span class="comments">// more awesome things,</span><br />
              u.more_awesome_things++;<br />
              <span class="comments">// and everything you wish can be achieved.</span><br />
              }}.start();<br />
              <span class="comments">// The last thing I want to say, simple and sincere, is:</span><br />
              System.out.println(<span class="string">"Happy Birthday, Delvina ❤️"</span>);
            </div>
            <div class="edelweis-quote" id="edelweis-quote" style="display:none;">
              <p class="edelweis-text">
                “Beberapa orang tenang bukan karena tanpa luka, tapi karena mereka memilih untuk tetap tumbuh—layaknya edelweis yang tumbuh di lereng gunung; dia tumbuh di tempat paling ekstrem dan sulit, tapi tetap mekar paling indah.”
              </p>
              <p class="edelweis-sign">and goodnight to you 🌙</p>
            </div>
            <div id="loveHeart">
              <canvas id="garden"></canvas>
              <div class="cake-name" id="cake-name">
                <svg viewBox="0 0 480 120" class="cake-name-svg" aria-label="Delvina Syaifira Norma Hani">
                  <defs>
                    <path id="cake-curve" d="M 25,36 Q 240,104 455,36" />
                  </defs>
                  <text>
                    <textPath href="#cake-curve" startOffset="50%" text-anchor="middle">
                      Delvina Syaifira Norma Hani
                    </textPath>
                  </text>
                </svg>
              </div>
              <iframe class="flowers-inline-frame" id="flowers-inline-frame" src="" title="Blooming Flowers"></iframe>
            </div>
          </div>
          <div class="night-switch-wrap" id="night-switch-wrap" style="display:none;">
            <span class="night-switch-icon" aria-hidden="true">☀️</span>
            <button type="button" class="night-switch-btn" id="night-switch-btn" aria-label="Ubah ke mode malam">
              <span class="night-switch-thumb"></span>
            </button>
            <span class="night-switch-icon" aria-hidden="true">🌙</span>
          </div>
          <p class="footer-credit" id="footer-credit" style="display:none;">
            created by someone who has a handsome face ;)
          </p>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const step1 = overlay.querySelector("#tease-step-1");
    const step2 = overlay.querySelector("#tease-step-2");
    const yesBtn = overlay.querySelector("#tease-yes");
    const noBtn = overlay.querySelector("#tease-no");
    const codeEl = overlay.querySelector("#code");
    const edelweisEl = overlay.querySelector("#edelweis-quote");
    const gardenCanvas = overlay.querySelector("#garden");
    const cakeNameEl = overlay.querySelector("#cake-name");
    const flowersInlineFrame = overlay.querySelector("#flowers-inline-frame");
    const nightSwitchWrap = overlay.querySelector("#night-switch-wrap");
    const nightSwitchBtn = overlay.querySelector("#night-switch-btn");
    const footerCreditEl = overlay.querySelector("#footer-credit");
    const teaseEmoji = overlay.querySelector("#tease-emoji");
    const teaseTitle = overlay.querySelector("#tease-title");

    const teaseActions = overlay.querySelector(".tease-actions");

    function moveNoButton(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (noBtn.parentElement !== overlay) {
        overlay.appendChild(noBtn);
      }

      const btnRect = noBtn.getBoundingClientRect();
      const cardRect = step1.getBoundingClientRect();
      const pad = 16;
      const gap = 12;
      const maxX = Math.max(pad, window.innerWidth - btnRect.width - pad);
      const maxY = Math.max(pad, window.innerHeight - btnRect.height - pad);

      let nextX = pad;
      let nextY = pad;
      let found = false;

      for (let i = 0; i < 40; i++) {
        const rx = pad + Math.random() * (maxX - pad);
        const ry = pad + Math.random() * (maxY - pad);
        const overlapsCard =
          rx < cardRect.right + gap &&
          rx + btnRect.width > cardRect.left - gap &&
          ry < cardRect.bottom + gap &&
          ry + btnRect.height > cardRect.top - gap;

        if (!overlapsCard) {
          nextX = rx;
          nextY = ry;
          found = true;
          break;
        }
      }

      if (!found) {
        const candidates = [];
        if (cardRect.left - btnRect.width - gap >= pad) {
          candidates.push({ x: Math.max(pad, cardRect.left - btnRect.width - gap - Math.random() * 40), y: pad + Math.random() * (maxY - pad) });
        }
        if (cardRect.right + gap + btnRect.width <= window.innerWidth - pad) {
          candidates.push({ x: Math.min(maxX, cardRect.right + gap + Math.random() * 40), y: pad + Math.random() * (maxY - pad) });
        }
        if (cardRect.top - btnRect.height - gap >= pad) {
          candidates.push({ x: pad + Math.random() * (maxX - pad), y: pad });
        }
        if (cardRect.bottom + gap + btnRect.height <= window.innerHeight - pad) {
          candidates.push({ x: pad + Math.random() * (maxX - pad), y: maxY });
        }
        if (candidates.length) {
          const pick = candidates[Math.floor(Math.random() * candidates.length)];
          nextX = pick.x;
          nextY = pick.y;
        }
      }

      noBtn.style.position = "fixed";
      noBtn.style.left = `${nextX}px`;
      noBtn.style.top = `${nextY}px`;
      noBtn.style.zIndex = "1005";
    }

    noBtn.addEventListener("pointerdown", moveNoButton);
    noBtn.addEventListener("click", moveNoButton);

    const teaseSteps = [
      { emoji: "🤔", title: "Yakinnn?", yes: "Yakin banget! ❤️", no: "Enggak jadi 😝" },
      { emoji: "😏", title: "Yang benerrr?", yes: "Beneran dong! ❤️", no: "Bohong deng 😝" },
      { emoji: "🥰", title: "Oke deh, selamat membaca ya!", yes: "Buka Sekarang 💌", no: null },
    ];
    let teaseStepIndex = 0;

    yesBtn.addEventListener("click", () => {
      if (teaseStepIndex < teaseSteps.length) {
        const next = teaseSteps[teaseStepIndex++];
        if (teaseEmoji) teaseEmoji.textContent = next.emoji;
        if (teaseTitle) teaseTitle.textContent = next.title;
        yesBtn.textContent = next.yes;
        noBtn.style.position = "";
        noBtn.style.left = "";
        noBtn.style.top = "";
        noBtn.style.zIndex = "";
        if (teaseActions && noBtn.parentElement !== teaseActions) {
          teaseActions.appendChild(noBtn);
        }
        if (next.no === null) {
          noBtn.style.display = "none";
        } else {
          noBtn.textContent = next.no;
        }
        return;
      }

      noBtn.style.display = "none";
      step1.style.display = "none";
      step2.style.display = "block";

      if (window.birthdayApp) {
        let codeDone = false;
        let cakeDone = false;
        let switchShown = false;

        function maybeShowNightSwitch() {
          if (codeDone && cakeDone && !switchShown && nightSwitchWrap) {
            switchShown = true;
            nightSwitchWrap.style.display = "flex";
            requestAnimationFrame(() => nightSwitchWrap.classList.add("is-visible"));
          }
        }

        if (nightSwitchBtn) {
          nightSwitchBtn.addEventListener("click", () => {
            if (nightSwitchBtn.classList.contains("is-checked")) return;
            nightSwitchBtn.classList.add("is-checked");

            setTimeout(() => {
              if (nightSwitchWrap) {
                nightSwitchWrap.classList.remove("is-visible");
                setTimeout(() => {
                  nightSwitchWrap.style.display = "none";
                }, 400);
              }

              // 1. Fade out cake & name, begin sunset transition (warm golden -> twilight -> night)
              gardenCanvas.style.transition = "opacity 1.4s ease";
              gardenCanvas.style.opacity = "0";
              if (cakeNameEl) cakeNameEl.classList.remove("is-visible");
              step2.classList.add("is-sunset-1");

              setTimeout(() => {
                step2.classList.remove("is-sunset-1");
                step2.classList.add("is-sunset-2");

                // 2. Word-by-word fade out of #code during twilight
                fadeOutCodeWords(codeEl, () => {
                  step2.classList.remove("is-sunset-2");
                  step2.classList.add("is-night");

                  // 3. Fireflies appear first in the night sky
                  startFireflies(step2);

                  // 4. Then pink blooming flowers grow on the right
                  setTimeout(() => {
                    flowersInlineFrame.src = "flowers.html?v=20261117";
                    flowersInlineFrame.classList.add("is-visible");

                    // 5. After flowers finish blooming, Edelweis quote fades in on the left
                    setTimeout(() => {
                      if (edelweisEl) {
                        edelweisEl.style.display = "block";
                        requestAnimationFrame(() => edelweisEl.classList.add("is-visible"));
                      }
                      if (footerCreditEl) {
                        footerCreditEl.style.display = "block";
                        requestAnimationFrame(() => footerCreditEl.classList.add("is-visible"));
                      }
                      if (window.showRestartButton) {
                        window.showRestartButton();
                      }
                    }, 4800);
                  }, 1200);
                });
              }, 1300);
            }, 450);
          });
        }

        window.birthdayApp.setupCanvas();
        window.birthdayApp.typewriter(codeEl, () => {
          codeDone = true;
          maybeShowNightSwitch();
        });
        setTimeout(() => {
          window.birthdayApp.startHeartAnimation(() => {
            if (cakeNameEl) cakeNameEl.classList.add("is-visible");
            cakeDone = true;
            maybeShowNightSwitch();
          });
        }, 1000);
      }
    });
  }

  window.Components.closing = {
    render(container, section) {
      const div = document.createElement("div");
      div.className = "section section-closing";
      const secretBtnHtml = `
        <div class="next-surprise-wrap">
          <button type="button" class="next-surprise-btn" id="open-secret-btn">
            ${section.secretButtonText || "Buka Pesan Untukmu 💌"}
          </button>
        </div>
      `;
      div.innerHTML = `
        <p class="closing-text">${
          section.text || "Okay, now come back and tell me if you liked it."
        }</p>
        <p class="replay-btn" id="replay">${
          section.replayText || "Or click, if you want to watch it again."
        }</p>
        <p class="last-smile">:)</p>
        ${secretBtnHtml}
      `;
      container.appendChild(div);

      const secretBtn = div.querySelector("#open-secret-btn");
      if (secretBtn) {
        secretBtn.addEventListener("click", () => openTeaseModal(section));
      }

      return div;
    },

    animate(tl, el) {
      const ideaIn = { opacity: 0, y: -20, rotationX: 5, skewX: "15deg" };
      tl.from(el.querySelectorAll("p"), {
        duration: 1, ...ideaIn, stagger: 1.2,
      })
      // Enable replay button only after it becomes visible
      .set(el.querySelector("#replay"), { pointerEvents: "auto" })
      .to(el.querySelector(".last-smile"), {
        duration: 0.5, rotation: 90,
      }, "+=1");

      const secretBtn = el.querySelector("#open-secret-btn");
      if (secretBtn) {
        tl.from(secretBtn, {
          duration: 0.8,
          opacity: 0,
          y: 20,
          scale: 0.9,
          ease: "back.out(1.7)",
        }, "+=0.3")
        .set(secretBtn, { pointerEvents: "auto" });
      }
    },
  };
})();
