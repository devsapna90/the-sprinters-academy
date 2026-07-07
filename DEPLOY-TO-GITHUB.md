# Deploy to GitHub Pages

Follow these steps to publish **The_Sprinters Accacaddmy** online so anyone can open it on phone or computer.

## Step 1 — Create a GitHub account

If you don't have one, sign up free at [https://github.com](https://github.com).

## Step 2 — Create a new repository

1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `the-sprinters-academy` (or any name you like)
3. Set visibility to **Public**
4. Click **Create repository**

## Step 3 — Upload your website files

Upload the contents of the **`docs`** folder from this project:

```
docs/
├── index.html
├── .nojekyll
├── css/
│   └── style.css
└── js/
    ├── data.js
    └── app.js
```

**How to upload:**
1. On your new repo page, click **Add file** → **Upload files**
2. Open this folder on your PC:
   `C:\Users\deepa\stock-market-academy\docs`
3. Drag and drop **all files and folders** (`index.html`, `css`, `js`, `.nojekyll`)
4. Click **Commit changes**

## Step 4 — Enable GitHub Pages

1. In your repo, go to **Settings**
2. Click **Pages** in the left sidebar
3. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` → folder **`/ (root)`**
   - Click **Save**

Wait 1–3 minutes for deployment.

## Step 5 — Share your link

Your public website will be at:

```
https://YOUR-GITHUB-USERNAME.github.io/the-sprinters-academy/
```

Replace `YOUR-GITHUB-USERNAME` with your GitHub username and `the-sprinters-academy` with your repo name.

**Example:**
```
https://johndoe.github.io/the-sprinters-academy/
```

Send this link to anyone — it works on mobile and desktop, anywhere in the world.

---

## Notes

- The site runs 24/7 without your computer being on
- Enrollment form saves locally in the browser (for real email collection, you can later connect Google Forms or Formspree)
- To update the site, upload new files to GitHub and changes appear in a few minutes

## Optional — Install Git (for future updates)

Download Git from [https://git-scm.com/download/win](https://git-scm.com/download/win) to push updates from your computer instead of uploading manually.
