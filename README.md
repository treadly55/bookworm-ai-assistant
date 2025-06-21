# 📚 The Bookworm's Companion

**The Bookworm's Companion** is an AI-powered book recommendation web application that suggests personalized reading recommendations based on user preferences. The application leverages OpenAI's Assistant API with a custom knowledge base of curated book data to provide intelligent, context-aware book suggestions.

The AI assistant analyzes user input about reading preferences, favorite genres, or previous books they've enjoyed, then searches through its knowledge base to recommend the most suitable titles from a curated collection.

**📱 Device Ready**
* Configured to function as a PWA on iOS and Android devices
* Installable app experience with offline capabilities

## 🛠 Tech Stack

**Frontend**: HTML5, CSS3, JavaScript (ES6+)
**Build Tool**: Vite  
**Backend**: Vercel Serverless Functions (Node.js)

**APIs Used:**
* OpenAI Assistant API (for AI recommendation logic)
* OpenAI Vector Store (for book knowledge base)

**Hosting**: Vercel

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing.

### 📦 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/bookworm-ai-companion.git
cd bookworm-ai-companion
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:

**For the serverless functions:**
```
OPENAI_API_KEY="your_openai_api_key_here"
ASSISTANT_ID="your_assistant_id_here"
```

4. **Run the development server:**
```bash
# Frontend only
npm run dev

# Full-stack with API functions (recommended)
vercel dev
```

5. **Build for production:**
```bash
npm run build
```

## 🏗 Project Structure

```
/
├── api/
│   └── ask-assistant.js
├── public/
│   └── icons/
├── src/
│   ├── main.js
│   └── style.css
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

## 🤖 AI Assistant Setup

This project uses a pre-configured OpenAI Assistant with:

1. **Custom Knowledge Base**: Book data uploaded to OpenAI Vector Store
2. **File Search Capabilities**: Enables intelligent search through book database
3. **Optimized Instructions**: Tailored for book recommendation responses

The setup process (referenced in code comments) involves:
- Creating an OpenAI Assistant
- Uploading book data to a Vector Store
- Linking the Vector Store to the Assistant with file search tools

## 🌟 Features

* AI-powered book recommendations based on user preferences
* Progressive Web App with offline capabilities
* Responsive design for all device sizes
* Serverless backend architecture
* Real-time recommendation responses

## 📄 License

This project is licensed under the MIT License.