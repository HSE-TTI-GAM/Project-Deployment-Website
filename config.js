/**
 * ✨ EDIT THIS FILE to customize the birthday greeting! ✨
 *
 * This is the ONLY file you need to modify.
 * No need to touch HTML, CSS, or any other JavaScript files.
 *
 * AVAILABLE SECTION TYPES:
 *   "greeting"      → Opening greeting with recipient's name
 *   "announcement"  → Birthday announcement text
 *   "chatbox"       → Chat message with typing animation
 *   "ideas"         → Sequential text reveals, one by one
 *   "quote"         → Styled quote card with optional author
 *   "countdown"     → Animated 3-2-1 countdown
 *   "stars"         → Twinkling stars background
 *   "fireworks"     → Colorful firework sparks burst
 *   "balloons"      → Floating balloon animation
 *   "profile"       → Profile photo with birthday wish
 *   "confetti"      → Confetti burst animation
 *   "closing"       → Closing message with replay button
 *
 * HOW TO USE:
 *   REMOVE a section  → Delete its object from the sections array
 *   DUPLICATE          → Copy-paste any section object
 *   REORDER            → Move the section object up/down in the array
 *   EDIT TEXT          → Change the string values
 */

const CONFIG = {
  // ── Recipient Info ────────────────────────────────────────────
  name: "Delvina Syaifira Norma Hani",
  photo: "./img/delvina.jpg",     // Place your photo in the img/ folder
  music: "./music/hbd.mp3",       // Intro & fallback loop music
  aboutYouMusic: "./music/about-you.mp3", // Plays once during cake & flowers

  // ── Theme Colors ──────────────────────────────────────────────
  // A toggle button lets the viewer switch between dark & light mode.
  colors: {
    primary: "#f472b6",           // Main accent color (rose pink)
    accent: "#60a5fa",            // Secondary accent color (sky blue)
    dark: {
      background: "#0f172a",      // Slate 900
      text: "#f1f5f9",            // Slate 100
    },
    light: {
      background: "#ffffff",      // Pure white
      text: "#1e293b",            // Slate 800
    },
  },

  // ── Default Color Mode ────────────────────────────────────────
  // Options: "dark" or "light"
  defaultMode: "light",

  // ── Cute Stickers (shown above text, rotates on each text change)
  stickers: [
    "https://media.tenor.com/4Ijycn6xFzUAAAAj/mochi-blue-roses.gif",
    "https://feeldreams.github.io/bunga.gif",
    "https://feeldreams.github.io/pandacoklat.gif",
    "https://media.tenor.com/snFoLI-S9CQAAAAj/milk-and-mocha.gif",
    "https://feeldreams.github.io/emawh.gif",
  ],

  // ── Sections ──────────────────────────────────────────────────
  // Add, remove, duplicate, or reorder as you wish!
  sections: [
    {
      type: "countdown",
      from: 3,                    // Countdown from this number
      goText: "",                 // Empty = skip party popper icon
    },
    {
      type: "greeting",
      title: "Hi",
      subtitle: "I really like your name btw!",
    },
    {
      type: "announcement",
      text: "And today is your birthday!! :D",
    },
    {
      type: "chatbox",
      message:
        "Happy birthday to youu!! Wishing you a wonderful year ahead filled with joy, love, and endless happiness!",
      buttonText: "Send",
    },
    {
      type: "ideas",
      lines: [
        "That's what I was going to do.",
        "But then I stopped.",
        "I realised, I wanted to do something <strong>special</strong>.",
        "Because,",
        "You are Special <span>:)</span>",
      ],
      bigLetters: "SO",
    },
    {
      type: "quote",
      text: "The more you praise and celebrate your life, the more there is in life to celebrate.",
      author: "Oprah Winfrey",
    },
    {
      type: "stars",
      count: 40,
    },
    {
      type: "balloons",
      count: 25,
    },
    {
      type: "profile",
      wishTitle: "Happy Birthday!",
      wishText: "May the force always be with you! ;)",
    },
    {
      type: "fireworks",
      count: 24,
    },
    {
      type: "confetti",
      count: 9,
    },
    {
      type: "closing",
      text: "Semoga hari ini dan seterusnya penuh kebahagiaan!",
      replayText: "Klik di sini kalau mau putar ulang.",
      secretButtonText: "Buka Pesan Untukmu 💌",
      teaseText: "Cieee, ga sabar ya mau liat isinya? 😜",
      yesText: "Iya, mau liat! ❤️",
      noText: "Enggak 😝",
    },
  ],
};
