import './style.css'

// Configuration and HTML Elements
const responseArea = document.getElementById('responseArea');
const questionField = document.getElementById('questionField');
const submitButton = document.getElementById('submitButton');
const responseSpace = document.getElementById('responsespace')
const retryButton = document.getElementById('retry');
const loadingOverlay = document.getElementById('loadingOverlay');

console.log("Application initialized. Ready to interact with Assistant.");
if (responseArea) responseArea.textContent = "Application ready. Our AI bookworm is standing by for recommendations!";

// ONE-TIME SETUP FUNCTIONS (Reference Documentation)
// These functions were used for the initial setup of the assistant and vector store.
// They are preserved here for documentation purposes and can be used to recreate the setup if needed.
/*
// STEP 1 - CREATE ASSISTANT (Run Once)
async function step1_createAssistant() {
    if (!openai) { console.error("OpenAI client not initialized..."); return null; }
    console.log("Attempting to create a new Assistant (Step 1)...");
    try {
        const assistantConfig = {
            name: "Movie Recommender",
            instructions: "You are an expert at recommending movies based on user preferences. When asked a question, use the information in the provided file to form a friendly response. If you cannot find the answer in the file, do your best to infer what the answer should be.",
            model: "gpt-4o",
            tools: [] // Tools like file_search are added/configured when linking vector store
        };
        const assistant = await openai.beta.assistants.create(assistantConfig);
        console.log("Assistant created successfully (Step 1)!");
        console.log("   Assistant ID:   ", assistant.id); // IMPORTANT: Save this ID
        return assistant.id;
    } catch (error) {
        console.error("Error during Assistant creation (Step 1):", error);
        return null;
    }
}

// FILE HANDLING HELPER (Used by Step 2)
async function getFileObjectFromPublicPath(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) { throw new Error(`Failed to fetch file: ${filePath}`); }
        const blob = await response.blob();
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
        console.log(`File fetched successfully for upload: ${fileName}`);
        return new File([blob], fileName, { type: blob.type || 'text/plain' });
    } catch (error) {
        console.error(`Error fetching or creating File object for ${filePath}:`, error);
        return null;
    }
}

// STEP 2 - CREATE VECTOR STORE & UPLOAD FILES (Run Once)
async function step2_createVectorStoreAndUploadFiles() {
    if (!openai) { console.error("OpenAI client not initialized..."); return null; }
    console.log("Attempting to create Vector Store and upload files (Step 2)...");
    try {
        const filePathsToUpload = ["/books.txt"]; // Ensure this is in your /public folder
        const fileObjects = await Promise.all(
            filePathsToUpload.map(path => getFileObjectFromPublicPath(path))
        );
        const validFileObjects = fileObjects.filter(file => file !== null);
        if (validFileObjects.length === 0) { return null; }
        
        console.log("   Creating Vector Store (using `openai.vectorStores.create`)...");
        if (!openai.vectorStores || typeof openai.vectorStores.create !== 'function') {
            console.error("Error: `openai.vectorStores.create` is not available...");
            return null;
        }
        const vectorStore = await openai.vectorStores.create({ name: "Book Files Knowledge Base" });
        console.log("   Vector Store created! ID:", vectorStore.id); // IMPORTANT: Save this ID

        console.log(`   Uploading files to Vector Store ID: ${vectorStore.id}...`);
        if (!openai.vectorStores.fileBatches || typeof openai.vectorStores.fileBatches.uploadAndPoll !== 'function') {
            console.error("Error: `openai.vectorStores.fileBatches.uploadAndPoll` is not available...");
            return null;
        }
        await openai.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, { files: validFileObjects });
        console.log("   Files uploaded to Vector Store!");
        return vectorStore.id;
    } catch (error) {
        console.error("Error during Vector Store setup (Step 2):", error);
        return null;
    }
}

// STEP 3 - LINK VECTOR STORE TO ASSISTANT (Run Once After Step 1 & 2)
async function step3_linkVectorStoreToAssistant(assistantId, vectorStoreId) {
    if (!openai || !assistantId || !vectorStoreId) { console.error("Missing client, assistantId, or vectorStoreId for link."); return null; }
    console.log(`Linking Vector Store (ID: ${vectorStoreId}) to Assistant (ID: ${assistantId}) (Step 3)...`);
    try {
        const updatedAssistant = await openai.beta.assistants.update(assistantId, {
            tools: [{ type: "file_search" }],
            tool_resources: { file_search: { vector_store_ids: [vectorStoreId] } }
        });
        console.log("Assistant updated with Vector Store (Step 3)!");
        console.log("   Tools enabled:", updatedAssistant.tools);
        console.log("   Tool Resources:", updatedAssistant.tool_resources);
        return updatedAssistant;
    } catch (error) {
        console.error("Error updating Assistant with Vector Store (Step 3):", error);
        return null;
    }
}
*/

// Primary interaction function for ongoing use
async function askAssistant(userQuestion) {
    console.log(`Asking Assistant: "${userQuestion}"`);
    
    try {
        const response = await fetch('/api/ask-assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: userQuestion })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('API Response received:', result);
        
        return result;
    } catch (error) {
        console.error('Error calling API:', error);
        return { error: `Network error: ${error.message}` };
    }
}

// Main function to set up the interaction listener
function setupInteraction() {
    console.log('Setting up UI interaction');
    
    if (responseArea && responseArea.textContent === '...') {
        responseArea.textContent = "Describe your preferred reading style or a book you liked, and I'll try to find a match!";
    }

    if (submitButton && questionField && loadingOverlay && responseSpace && responseArea) {
        submitButton.addEventListener('click', async () => {
            const question = questionField.value.trim();
            if (!question) {
                alert('Please describe what kind of book you are looking for.');
                return;
            }
            
            // Show Loading State
            loadingOverlay.style.display = 'flex';
            responseSpace.style.display = 'none';
            submitButton.disabled = true;
            submitButton.textContent = 'Thinking...';

            // Call API
            const result = await askAssistant(question);

            // Hide Loading State
            loadingOverlay.style.display = 'none';

            // Process and Display Response
            if (result.error) {
                responseArea.innerHTML = `<strong>You:</strong> ${question}<br><strong>Error:</strong> ${result.error}`;
            } else if (result.success) {
                responseArea.innerHTML = `<strong>You:</strong> ${question}<br><strong>AI Worm:</strong> ${result.text.replace(/\n/g, "<br>")}`;
            } else {
                responseArea.innerHTML = `<strong>You:</strong> ${question}<br><strong>AI Worm:</strong> ${result.text ? result.text.replace(/\n/g, "<br>") : "An unexpected issue occurred."}`;
            }
            
            responseSpace.style.display = 'flex';
            responseSpace.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        });
        console.log("Submit button event listener attached.");
    } else {
        console.error("Could not find all required elements for submit functionality.");
    }

    if (retryButton && questionField && responseSpace && responseArea) {
        retryButton.addEventListener('click', () => {
            questionField.value = "";
            responseSpace.style.display = 'none';
            if (responseArea.textContent !== "Describe your preferred reading style or a book you liked, and I'll try to find a match!"){
                 responseArea.innerHTML = "...";
            }
            questionField.focus();
            console.log("Retry button clicked. Search reset.");
        });
        console.log("Retry button event listener attached.");
    } else {
        console.error("Could not find all elements for retry button functionality.");
    }
    console.log("UI Interaction setup finished.");
}

// Initialize the application
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupInteraction);
} else {
    setupInteraction(); 
}