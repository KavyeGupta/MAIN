# 🏦 Bankist | Modern Banking Landing Page & Web Application

A full-featured banking website and interactive web application built with **Vanilla JavaScript (ES6+)**, **HTML5**, and **CSS3**. 

This project integrates both the **Marketing Landing Page** (Advanced DOM & UI effects) and the **Banking Application Dashboard** (Array data operations, transfers, loans, and authentication).

---

## 🚀 Live Demo & Repository

- **Repository**: [https://github.com/KavyeGupta/BANKIST](https://github.com/KavyeGupta/BANKIST)
- **Author**: [Kavye Gupta](https://github.com/KavyeGupta)

---

## 🌟 Key Features

### 1. 🌐 Marketing Landing Page (`index.html`)
- **Smooth Page Navigation**: Efficient event delegation for smooth scrolling across all sections (`Features`, `Operations`, `Testimonials`).
- **Modal Window Flow**: "Open Account" modal window with background backdrop blur and keyboard escape listener.
- **Dynamic Account Registration**: Filling out the "Open account" form generates a unique user ID and PIN, stores the account in `localStorage`, and seamlessly redirects you to the active banking dashboard.
- **Tabbed Component**: Interactive operations tabs (Transfers, Loans, Closing) with smooth tab switching.
- **Menu Hover Fade**: Opacity transition on header navigation links that highlights the active item while dimming siblings.
- **Sticky Navigation**: Performance-optimized sticky header using the modern `IntersectionObserver` API.
- **Scroll-Reveal Animations**: Sections smoothly fade and slide into view as you scroll down.
- **Lazy Image Loading**: High-resolution images are lazy-loaded with a blur-up effect to optimize performance.
- **Testimonial Slider**: Interactive slider component with previous/next controls, keyboard arrow navigation, and clickable pagination dots.
- **Cookie Banner**: Dismissible cookie banner with dynamic height calculation.

### 2. 💳 Banking Application Dashboard (`app.html`)
- **User Authentication**: Secure login flow validating user credentials against active accounts.
- **Auto-Login on Sign-Up**: Automatically detects newly registered accounts from the landing page and opens your personal dashboard immediately.
- **Dynamic Movements List**: Renders all deposit and withdrawal transactions with type badges and formatted amounts.
- **Live Summary & Balance**:
  - Automatically calculates total income, expenses, and accrued interest using `reduce`, `filter`, and `map`.
  - Toggle sorting of movements in ascending/descending order.
- **Transfer Money**: Real-time money transfers between accounts with balance and recipient validation.
- **Request Loan**: Business logic rule requiring at least one deposit that is at least 10% of the requested loan amount.
- **Close Account**: Closes and deletes the account upon username and PIN confirmation.
- **Inactivity Logout Timer**: 5-minute countdown timer that automatically logs the user out for security.

---

## 🔑 Demo Credentials

You can test the application using any of the pre-configured demo accounts or by creating your own via the **"Open account"** modal on `index.html`:

| Name | User ID | PIN | Type | Starting Balance |
| :--- | :--- | :--- | :--- | :--- |
| **Jonas Schmedtmann** | `js` | `1111` | Premium | €3,840 |
| **Jessica Davis** | `jd` | `2222` | Standard | €8,170 |
| **Steven Thomas Williams**| `stw` | `3333` | Premium | €110 |
| **Sarah Smith** | `ss` | `4444` | Basic | €2,180 |

---

## 📁 File Structure

```text
BANKIST/
├── index.html         # Marketing landing page
├── style.css          # Landing page styles and animations
├── script.js          # Landing page interactivity & account registration
├── app.html           # Dedicated banking app interface
├── app.css            # Banking app dashboard styles
├── app.js             # Banking app logic (auth, transactions, timers)
├── img/               # Image assets, icons, and avatars
│   ├── logo.png
│   ├── icon.png
│   ├── hero.png
│   ├── icons.svg
│   └── ...
└── README.md          # Project documentation
```

---

## 💻 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KavyeGupta/BANKIST.git
   ```
2. **Open the project**:
   - Double-click `index.html` to explore the marketing website and create an account.
   - Double-click `app.html` to directly access the banking dashboard.

---

## 🛠️ Built With

- **HTML5**: Semantic tags, SVG sprite integration.
- **CSS3**: Flexbox, CSS Grid, Custom Properties (CSS variables), Transitions & Keyframe animations.
- **JavaScript (ES6+)**:
  - `IntersectionObserver` API
  - DOM Event Delegation & Propagation
  - Array methods (`map`, `filter`, `reduce`, `some`, `every`, `find`, `findIndex`)
  - Timers (`setInterval`, `clearInterval`, `setTimeout`)
  - Web Storage API (`localStorage`)

---

## 🎓 Attribution

Design and concept inspired by **Jonas Schmedtmann's** *The Complete JavaScript Course*.
All custom fixes, standalone application separation, and cross-page registration integration implemented by **Kavye Gupta**.
