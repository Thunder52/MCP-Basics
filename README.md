# 🚀 MCP File System Editor with AI (Gemini API)

A modern, interactive web application that allows users to **upload**, **create**, **edit**, **delete**, and **download** files within a folder — enhanced by **AI-powered editing** using Google's **Gemini API**.

> Built with **React**, **Express (Node.js)**, and integrated with **Gemini 1.5 Flash API**.

---

## 🧠 Features

- 📂 Upload entire folders and manage files easily.
- 📝 Create new files with custom content.
- 🛠 Edit files manually or using **AI prompt-based editing**.
- 🤖 Integrated with **Gemini AI API** (Google Vertex AI).
- 🗑 Delete individual files.
- ⬇ Download files after editing.
- 💡 Example prompts to get started quickly.
- 🎨 Beautiful, animated TailwindCSS-based UI.

---

## ⚙️ Tech Stack

| Tech          | Description                          |
|---------------|--------------------------------------|
| React         | Frontend UI                          |
| Node.js + Express | Backend file operations & API        |
| Tailwind CSS  | UI Styling & Animations              |
| Gemini 1.5 API| AI file editing with instructions     |
| Axios         | HTTP requests                        |
| Lucide-React  | Icons                                |

---

## 📦 Folder Structure

MCP-AI-Editor/
├── client/ # React Frontend
├── server/ # Node.js Backend
│ ├── uploads/ # Uploaded/created files
│ └── server.js # Express API routes
├── .env # API keys and configs
└── README.md
## 🚀 Getting Started

### 1. Clone the Repo
git clone https://github.com/Thunder52/MCP-Basics.git
2. Setup Backend (Node.js)
bash
Copy
Edit
cd server
npm install
🔐 Create .env file:
env
Copy
Edit
GEMINI_API_KEY=your_google_gemini_api_key
You can get a Gemini API key from: https://makersuite.google.com/app

Start the Server
bash
Copy
Edit
node server.js
3. Setup Frontend (React)
bash
Copy
Edit
cd client
npm install
npm start

Example Prompts to Use with AI

Replace "foo" with "bar"

Add "Hello World" at the beginning

Remove all console.log statements

Convert to arrow functions

Format code with Prettier

Add TypeScript types
