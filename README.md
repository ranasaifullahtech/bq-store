# BQ Store — Admin Dashboard

BQ Store is a frontend-only admin dashboard for managing a watch store's products and categories. It uses Firebase Authentication for admin login and Cloud Firestore for data persistence. The app consists of two HTML pages: a public login page and a protected dashboard with Products and Categories management views.

## Pages and views

- `index.html` — Public login page for admin authentication
- `dashboard.html` — Protected admin workspace with:
  - Products view (list, create, edit, delete products)
  - Categories view (list, create, edit, delete categories)
- `404.html` — Fallback for unknown routes

## Data Model

```
Firestore (logical view)
├── categories/
│   └── {categoryId}
│       ├── name: string
│       ├── slug: string
│       └── createdAt: timestamp
└── products/
    └── {productId}
        ├── name: string
        ├── description: string
        ├── price: number           // in paisa (smallest currency unit)
        ├── imageUrl: string
        ├── categoryId: string       // reference to categories/{id}
        ├── stock: number
        └── createdAt: timestamp
```

## Folder Layout

```
bq-store/
├── index.html                  # Login
├── dashboard.html              # Admin shell (sidebar + topbar + view slot)
├── 404.html                    # Fallback for unknown routes
├── src/
│   ├── css/
│   │   └── tailwind.css
│   ├── js/
│   │   ├── main.js             # Login page entry
│   │   ├── dashboard.js        # Dashboard entry (routes + init)
│   │   ├── auth.js            # Firebase Auth wrapper
│   │   ├── firestore.js       # Firestore wrapper (getAll, create, update, delete)
│   │   ├── products.js        # Products view: renderList, openForm, handleSubmit
│   │   ├── categories.js      # Categories view: same shape as products.js
│   │   ├── ui.js             # DOM helpers: $, $$, el, toast
│   │   └── config.js         # Reads Firebase config, initializes SDK
│   └── assets/
│       ├── icons/            # SVGs (optimized)
│       └── images/           # Placeholder product imagery
├── design/
│   └── figma-export/         # Screenshots / exports from Figma
├── firestore.rules            # Security rules
├── .env.example             # Placeholder config
├── .gitignore
├── README.md
└── LICENSE
```

## Local Run Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR-USERNAME/bq-store.git
   cd bq-store
   ```

2. Open with Live Server:
   - Right-click `index.html` in VS Code → Open with Live Server
   - Or use the Live Server extension (default port: 5500)

3. Set up Firebase config:
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase config values in `.env`.

## Design Inspiration

TBD after Module 03.

## Happy Path and Failure Paths

When a user adds a new product, the following steps occur:
1. User clicks "Add Product" button, which opens a modal form
2. User fills in product details (name, description, price, category, stock, image) and clicks Save
3. JavaScript validates all required fields; if validation fails, show inline error messages
4. On success, JavaScript calls Firestore `addDoc()` to create the product document
5. If network failure occurs, display a toast error message: "Failed to save. Check your connection."
6. If permission denied (user not authenticated), redirect to login page
7. On Firestore success, the new product appears in the list via re-fetch

Three failure points:
- Network failure → show toast: "Failed to save. Check your connection."
- Validation failure → show inline error messages under each invalid field
- Permission denied → redirect to index.html login page