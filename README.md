# Payment Flow App

A simple 2-screen payment flow application built with Astro, SolidJS, and TailwindCSS.

## 🚀 Live Demo

[View Live App](https://payment-ui-assessment.vercel.app/)

## 🤖 AI Tool Used

**Claude** - Used for development assistance, code generation, UX, and debugging.

## 📦 Tech Stack

- **Astro** - Static site framework
- **SolidJS** - Reactive UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vercel** - Deployment

## File Structure
```
src/
├── components/
│   ├── PaymentForm.tsx    # Payment form with validation
│   └── Receipt.tsx         # Transaction receipt display
├── stores/
│   └── paymentStore.ts     # Utility functions (mask card, generate ID)
├── types/
│   └── payment.ts          # TypeScript interfaces
└── pages/
    ├── index.astro         # Payment form page
    └── receipt.astro       # Receipt page
```

## 🏗️ Architecture

**Two-screen flow:** Payment Form → Receipt Display

### Navigation Flow
1. User fills form → clicks "Pay Now"
2. Data validated → saved to localStorage
3. Navigate to receipt page
4. Receipt reads localStorage → displays details

### Why localStorage?

**Problem:** 
- Used SolidJS store initially
- `window.location.href` causes full page reload
- Store data lost on reload → Receipt page empty ❌

**Solution:**
- localStorage persists across page reloads
- Data survives navigation ✅

**Flow:**
```
Form Submit → localStorage.setItem() → Navigate → Receipt → localStorage.getItem()
```

### Components
- **PaymentForm:** Validation + Save data + Navigate
- **Receipt:** Load data + Display details + Clear on reset

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ installed

### Installation
```bash
# Clone repository
git clone <your-repo-url>
cd payment-flow

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Access locally
Open [http://localhost:4321](http://localhost:4321)

## ✨ Features

- ✅ Client-side form validation
- ✅ Card number masking
- ✅ Transaction ID generation
- ✅ Responsive design
- ✅ State persistence with localStorage
- ✅ Type-safe with TypeScript

## 📝 License

MIT