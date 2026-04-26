# BQ Store

A minimal ecommerce admin dashboard. Two pages: login and dashboard. Two CRUD resources: products and categories. Built with HTML, Tailwind CSS, vanilla JavaScript, and Firebase.

## Live Demo

→ https://bq-store-demo.web.app

## Tech Stack

- HTML5
- Tailwind CSS v4 (CDN for dev)
- Vanilla JavaScript (ES modules)
- Firebase Auth
- Cloud Firestore

## Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/ranasaifullahtech/bq-store.git
   cd bq-store
   ```

2. Open with Live Server:
   - In VS Code, right-click `index.html` → "Open with Live Server"
   - Or use a local server: `npx serve .`

3. Set up Firebase (optional for full functionality):
   - Create a project at https://console.firebase.google.com
   - Enable Authentication → Email/Password
   - Create Firestore Database (start in production mode)
   - Edit `src/js/config.js` with your Firebase config
   - Add your domain to "Authorized domains" in Firebase Console

4. Create admin user:
   - Go to Authentication → Users → Add user
   - Use email: admin@bqstore.com, password: admin123

## Deployment

### Option 1: Vercel (Recommended)

1. Push to GitHub
2. Go to https://vercel.com and import the repo
3. Configure:
   - Framework Preset: Other
   - Build Command: (leave empty or use npm run build)
   - Output Directory: .
4. Click Deploy

### Option 2: Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## Data Model

Firestore collections:

```
categories/{categoryId}
  - name: string
  - slug: string
  - createdAt: timestamp

products/{productId}
  - name: string
  - description: string
  - price: number (in paisa/cents)
  - imageUrl: string
  - categoryId: string
  - stock: number
  - createdAt: timestamp
```

## Features

- ✅ Login with validation and lockout after 5 failed attempts
- ✅ Products CRUD (create, read, update, delete)
- ✅ Categories CRUD with referential integrity
- ✅ Real-time search filtering
- ✅ Real-time updates via Firestore
- ✅ Offline support with local cache
- ✅ Responsive design (mobile + desktop)
- ✅ Keyboard accessible

## What I Would Do Next

- Product image uploads to Firebase Storage
- Role-based access control
- Offline write queue with sync on reconnect
- Email notifications for new orders

## License

MIT