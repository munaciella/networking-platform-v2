# Networking Platform

A professional networking platform built with modern web technologies, featuring authentication, real-time updates, and a clean, responsive UI.

---

## Live Demo Disclaimer

Please note that the live demo linked above is intended **only** for development and testing. To keep hosting costs low:
- New user registrations may be restricted or disabled at any time.
- Some features may be unstable or unavailable.
- Use this demo **at your own risk**; do **not** rely on it for production data.

---

## Employer / Hiring Inquiries

If you’re an employer interested in leveraging this project, or if you encounter an issue you’d like me to solve, please reach out!  
Email me at: **francesco.vurchio82@gmail.com** with:
1. A brief description of the problem or feature you need, and  
2. Any relevant deadlines or context.  
I’ll get back to you as soon as possible.

---

## Table of Contents
1. [Overview](#overview)
2. [Live Demo](#live-demo)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [Installation & Setup](#installation-and-setup)
6. [Project Structure](#project-structure)
7. [Development & Deployment](#development-and-deployment)
8. [Future Improvements](#future-improvements)]
9. [Contributions & Feedback](#contributions-and-feedback)

---

## Overview

This project is a full-stack networking platform where users can connect, interact, and engage through posts, comments, and messaging. Built using Next.js, it leverages Firebase for data storage and Clerk for authentication.

---

## 🚀 Live Demo

- [Live Demo](https://networked.vercel.app/)

---

## Tech Stack

Frontend:
-	Next.js (App Router) – Server-side rendering, static generation
-	TypeScript – Type safety
-	Tailwind CSS – Utility-first styling
-	shadcn/ui – Custom UI components

Backend & Services:
-	Firebase Firestore – NoSQL database
-	Clerk – Authentication provider
-	Vercel – Deployment & hosting
-   Cloudflare - R2 - Object Storage

Other Tools:
-	Lucide Icons – Modern UI icons
-   HTTP - Request - Fetching

## Features

✅ Authentication with Clerk (Google & Email)
✅ Post Creation & Commenting (Firestore-backed)
✅ Likes & Real-time Updates
✅ Responsive UI with Tailwind & shadcn/ui
✅ Dark Mode
✅ Optimised Performance (Server & Client Rendering)
✅ Secure Access with Firebase Rules

---

## Installation & Setup

1. Clone the Repository

```bash
git clone https://github.com/yourusername/networking-platform-v2.git
cd networking-platform-v2
```

2. Install Dependencies

```bash
npm install
# or
yarn install
```

3. Set Up Environment Variables

Create a .env.local file in the root and add:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

CLOUDFLARE_R2_ACCESS_KEY=your_cloudflare_r2_access_key
CLOUDFLARE_R2_SECRET_KEY=your_cloudflare_r2_secret_key
```

4. Start the Development Server

```bash
npm run dev
```

The app should now be running at http://localhost:3000 🚀

---

## Project Structure

src/
│── app/
│   ├── page.tsx       # Home Page
│   ├── layout.tsx     # Layout Wrapper
│── components/
│   ├── Header.tsx     # Navigation Bar
│   ├── Post.tsx       # Post Component
│   ├── Comment.tsx    # Comment Section
│   ├── ThemeToggle.tsx # Dark Mode Switch
│── lib/
│   ├── firebase.ts    # Firebase Config
│   ├── auth.ts        # Authentication Helpers
│── styles/
│   ├── globals.css    # Tailwind Styles

---

## Development & Deployment

Local Development
•	Runs on http://localhost:3000
•	Uses Firebase Firestore Emulator (optional)

Deploying to Vercel
1.	Push your code to GitHub
2.	Connect the repo to Vercel
3.	Add environment variables
4.	Deploy 🎉

Future Improvements
•	Optimised Search with Firestore queries
•	Messaging System for real-time chats
•	Notifications for user interactions
•	Improved Mobile UI

---

## Contributions & Feedback

This project is open to improvements! If you have suggestions or want to contribute, feel free to open an issue or submit a pull request. 🚀

Happy coding! 🚀