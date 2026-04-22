# 🚀 Deployment Guide: Vercel

This project is optimized for deployment on **Vercel**. Follow these steps to take the birthday surprise live!

## 1. Prepare your Repository
Ensure all your latest changes are pushed to your GitHub/GitLab/Bitbucket repository.

## 2. Deploy to Vercel
1.  Go to [vercel.com](https://vercel.com) and sign in.
2.  Click **"Add New..."** and then **"Project"**.
3.  Import your repository.
4.  Vercel will automatically detect **Next.js** as the framework.
5.  **Environment Variables:** No specific env vars are required unless you add analytics or a custom API.
6.  Click **"Deploy"**.

## 3. Post-Deployment Checklist
- [ ] **Custom Domain:** Add a cute custom domain in Project Settings > Domains (e.g., `diya-drashti-2026.com`).
- [ ] **SSL:** Vercel provides automatic SSL, so your site will be secure (`https://`).
- [ ] **Favicon:** Replace `public/favicon.ico` with a custom heart or cake icon for a final touch.
- [ ] **Test on Mobile:** Open the live URL on your phone to ensure the scratch cards and animations feel smooth.

## 🛠️ Performance Features Enabled
- **Next/Image:** Automatic image optimization and lazy loading.
- **Dynamic Imports:** Components below the fold are lazy-loaded to reduce initial bundle size.
- **GSAP Context:** Clean animation memory management.
- **Compress:** Asset compression is enabled in `next.config.ts`.

---
**Happy Birthday Diya & Drashti! 🎂**
