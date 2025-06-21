# 📚 The Bookworm's Companion

**The Bookworm's Companion** is an AI-powered book recommendation web application that utlizies OpenAI's Assistants API to ingest custom information and then search that information with a programmed 'agent'. 

Using this codebase you can create your own agent and ingest your own custom information by following the instructions below. 

You can also just use the OpenAI platform to generate an assistants ID and update the code accordingly.

This version of the AI assistant uses the GoodReads top 50 books for the month of May 2025 as the custom informaiton. The agent uses this information to suggest a book based on the users query.

## Working Example 
https://bookworm-companion-sooty.vercel.app/

## Tech Stack

**Frontend**: HTML5, CSS3, JavaScript (ES6+)
**Build Tool**: Vite  
**Backend**: Vercel Serverless Functions (Node.js)

## Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing.


### Installation

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

### Creating Your Own Assistant

The code includes commented setup functions in `src/main.js` that show how to create your own assistant from scratch:

1. **Uncomment the setup functions** in `src/main.js`
2. **Prepare your data file**: Place your book data (e.g., `books.txt`) in the `public/` folder
3. **Run the setup process**:

```javascript
// Step 1: Create the assistant
const assistantId = await step1_createAssistant();

// Step 2: Create vector store and upload your book data
const vectorStoreId = await step2_createVectorStoreAndUploadFiles();

// Step 3: Link the vector store to your assistant
await step3_linkVectorStoreToAssistant(assistantId, vectorStoreId);
```

4. **Update your environment variables** with the new Assistant ID
5. **Comment out the setup functions** once complete

**Note**: The setup functions require the OpenAI SDK on the frontend. For production use, these should be run in a separate Node.js script or moved to serverless functions.

## 📄 License

This project is licensed under the MIT License.