# AI Chatbot SaaS

A production-ready AI-powered chatbot platform built with **Next.js**, **TypeScript**, **PostgreSQL**, **Prisma**, and **OpenAI API**. The application provides a modern ChatGPT-style experience with authentication, conversation management, chat history, and a responsive SaaS dashboard.

---
<img width="3200" height="2292" alt="image" src="https://github.com/user-attachments/assets/0b5c0d80-deb7-4e9e-8f6b-8b505450b33a" />


## 🚀 Live Demo

### Demo Account

**Email:** [demo@example.com](mailto:demo@example.com)

**Password:** demo1234

---

## ✨ Features

### Authentication

* User Registration
* Secure Login & Logout
* Protected Routes
* User Profile Management

### AI Chat

* ChatGPT-style Interface
* AI-Powered Conversations
* Real-time Response Streaming
* Markdown Support
* Code Syntax Highlighting
* Auto Scroll to Latest Message

### Conversation Management

* Create New Conversations
* Rename Conversations
* Delete Conversations
* Search Chat History
* Persistent Message Storage

### Dashboard

* Total Conversations
* Total Messages
* Recent Activity
* Usage Statistics

### User Experience

* Dark Mode
* Light Mode
* Mobile Responsive Design
* Modern SaaS Interface
* Sidebar Navigation
* Smooth Animations

---

## 🛠 Tech Stack

### Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* Shadcn UI

### Backend

* Next.js API Routes
* Server Actions

### Database

* PostgreSQL
* Prisma ORM

### Authentication

* NextAuth.js

### AI Integration

* OpenAI API

### Deployment

* Vercel
* Docker

---

## 📂 Project Structure

```bash
src/
│
├── app/
├── components/
├── features/
├── hooks/
├── lib/
├── services/
├── types/
├── utils/
└── prisma/
```

---

## 📸 Screenshots

### Login Page

(Add Screenshot Here)

---

### Dashboard

(Add Screenshot Here)

---

### AI Chat Interface

(Add Screenshot Here)

---

### Conversation History

(Add Screenshot Here)

---

### Mobile View

(Add Screenshot Here)

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/ai-chatbot-saas.git
```

### Navigate to Project

```bash
cd ai-chatbot-saas
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=
NEXTAUTH_SECRET=
OPENAI_API_KEY=
```

### Run Database Migration

```bash
npx prisma migrate dev
```

### Start Development Server

```bash
npm run dev
```

---

## 🗄 Database Schema

### User

```ts
id
name
email
password
createdAt
```

### Conversation

```ts
id
title
userId
createdAt
```

### Message

```ts
id
conversationId
role
content
createdAt
```

---

## 🎯 Future Improvements

* Multiple AI Models (GPT, Claude, Gemini)
* Document Upload & Analysis
* AI Image Generation
* Team Workspaces
* Subscription Plans
* Usage Billing
* Voice Chat Support

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork this repository and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Support

If you find this project useful, please consider giving it a star on GitHub.
