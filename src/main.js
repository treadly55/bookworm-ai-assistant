import OpenAI from 'openai';
import './style.css'
// --- Configuration and HTML Elements ---
const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const responseArea = document.getElementById('responseArea');
const questionField = document.getElementById('questionField'); // Get reference to the input field
const submitButton = document.getElementById('submitButton');   // Get reference to the submit button
const responseSpace = document.getElementById('responsespace')
const retryButton = document.getElementById('retry'); // <<<< ENSURE THIS LINE EXISTS AND IS CORRECT


// --- Initialize OpenAI Client (Essential for all operations) ---
let openai;
if (VITE_OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: VITE_OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
    });
    console.log("✅ OpenAI Client Initialized successfully.");
    if (responseArea) responseArea.textContent = "OpenAI client initialized. Ready to interact with Assistant.";
} else {
    console.error("🔴 FATAL: OpenAI API Key not found. Please ensure VITE_OPENAI_API_KEY is set in your .env file and accessible.");
    if (responseArea) responseArea.textContent = "FATAL: OpenAI API Key not found. Interaction disabled.";
}

// --- ONE-TIME SETUP FUNCTIONS (Commented out as setup is complete) ---
// These functions were used for the initial setup of the assistant and vector store.
// You can uncomment and run them if you need to recreate or modify the setup.
/*
// -----------------------------------------------------------------------------
// SECTION: STEP 1 - CREATE ASSISTANT (Run Once)
// -----------------------------------------------------------------------------
async function step1_createAssistant() {
    if (!openai) { console.error("🔴 OpenAI client not initialized..."); return null; }
    console.log("🔄 Attempting to create a new Assistant (Step 1)...");
    try {
        const assistantConfig = {
            name: "Movie Recommender",
            instructions: "You are an expert at recommending movies based on user preferences. When asked a question, use the information in the provided file to form a friendly response. If you cannot find the answer in the file, do your best to infer what the answer should be.",
            model: "gpt-4o",
            tools: [] // Tools like file_search are added/configured when linking vector store
        };
        const assistant = await openai.beta.assistants.create(assistantConfig);
        console.log("✅🎉 Assistant created successfully (Step 1)!");
        console.log("   Assistant ID:   ", assistant.id); // IMPORTANT: Save this ID
        return assistant.id;
    } catch (error) {
        console.error("🔴 Error during Assistant creation (Step 1):", error);
        return null;
    }
}

// -----------------------------------------------------------------------------
// SECTION: FILE HANDLING HELPER (Used by Step 2)
// -----------------------------------------------------------------------------
async function getFileObjectFromPublicPath(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) { throw new Error(`Failed to fetch file: ${filePath}`); }
        const blob = await response.blob();
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
        console.log(`📄 File fetched successfully for upload: ${fileName}`);
        return new File([blob], fileName, { type: blob.type || 'text/plain' });
    } catch (error) {
        console.error(`🔴 Error fetching or creating File object for ${filePath}:`, error);
        return null;
    }
}

// -----------------------------------------------------------------------------
// SECTION: STEP 2 - CREATE VECTOR STORE & UPLOAD FILES (Run Once)
// -----------------------------------------------------------------------------


// async function getFileObjectFromPublicPath(filePath) {
//     try {
//         const response = await fetch(filePath);
//         if (!response.ok) { throw new Error(`Failed to fetch file: ${filePath}`); }
//         const blob = await response.blob();
//         const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
//         console.log(`📄 File fetched successfully for upload: ${fileName}`);
//         return new File([blob], fileName, { type: blob.type || 'text/plain' });
//     } catch (error) {
//         console.error(`🔴 Error fetching or creating File object for ${filePath}:`, error);
//         return null;
//     }
// }


// async function step2_createVectorStoreAndUploadFiles() {
//     if (!openai) { console.error("🔴 OpenAI client not initialized..."); return null; }
//     console.log("🔄 Attempting to create Vector Store and upload files (Step 2)...");
//     try {
//         const filePathsToUpload = ["/books.txt"]; // Ensure this is in your /public folder
//         const fileObjects = await Promise.all(
//             filePathsToUpload.map(path => getFileObjectFromPublicPath(path))
//         );
//         const validFileObjects = fileObjects.filter(file => file !== null);
//         if (validFileObjects.length === 0) { return null; }
        
//         console.log("   Creating Vector Store (using `openai.vectorStores.create`)...");
//         if (!openai.vectorStores || typeof openai.vectorStores.create !== 'function') {
//             console.error("🔴 Error: `openai.vectorStores.create` is not available...");
//             return null;
//         }
//         const vectorStore = await openai.vectorStores.create({ name: "Book Files Knowledge Base" });
//         console.log("   ✅ Vector Store created! ID:", vectorStore.id); // IMPORTANT: Save this ID

//         console.log(`   Uploading files to Vector Store ID: ${vectorStore.id}...`);
//         if (!openai.vectorStores.fileBatches || typeof openai.vectorStores.fileBatches.uploadAndPoll !== 'function') {
//             console.error("🔴 Error: `openai.vectorStores.fileBatches.uploadAndPoll` is not available...");
//             return null;
//         }
//         await openai.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, { files: validFileObjects });
//         console.log("   ✅ Files uploaded to Vector Store!");
//         return vectorStore.id;
//     } catch (error) {
//         console.error("🔴 Error during Vector Store setup (Step 2):", error);
//         return null;
//     }
// }
// -----------------------------------------------------------------------------
// SECTION: STEP 3 - LINK VECTOR STORE TO ASSISTANT (Run Once After Step 1 & 2)
// -----------------------------------------------------------------------------
async function step3_linkVectorStoreToAssistant(assistantId, vectorStoreId) {
    if (!openai || !assistantId || !vectorStoreId) { console.error("🔴 Missing client, assistantId, or vectorStoreId for link."); return null; }
    console.log(`🔄 Linking Vector Store (ID: ${vectorStoreId}) to Assistant (ID: ${assistantId}) (Step 3)...`);
    try {
        const updatedAssistant = await openai.beta.assistants.update(assistantId, {
            tools: [{ type: "file_search" }],
            tool_resources: { file_search: { vector_store_ids: [vectorStoreId] } }
        });
        console.log("✅🎉 Assistant updated with Vector Store (Step 3)!");
        console.log("   Tools enabled:", updatedAssistant.tools);
        console.log("   Tool Resources:", updatedAssistant.tool_resources);
        return updatedAssistant;
    } catch (error) {
        console.error("🔴 Error updating Assistant with Vector Store (Step 3):", error);
        return null;
    }
}
*/


// --- ACTIVE FUNCTION: INTERACT WITH THE ASSISTANT (Primary function for ongoing use) ---
/**
 * Creates a thread, adds a message, runs the assistant, and gets the reply.
 * @param {string} assistantId The ID of the pre-configured assistant to run.
 * @param {string} userQuestion The question to ask the assistant.
 * @returns {Promise<string|null>} The assistant's reply or null on failure.
 */


async function askAssistant(assistantId, userQuestion) {
    if (!openai || !assistantId) {
        console.error("🔴 OpenAI client or Assistant ID missing. Cannot ask question.");
        // Return an error object
        return { error: "Client or Assistant ID missing for interaction." };
    }

    console.log(`💬 Asking Assistant (ID: ${assistantId}): "${userQuestion}"`);
    // REMOVE any lines here that set responseArea.innerHTML for "Thinking..."

    try {
        console.log("   Creating a new thread...");
        const thread = await openai.beta.threads.create();
        console.log("   ✅ Thread created. ID:", thread.id);

        console.log(`   Adding message to thread: "${userQuestion}"`);
        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: userQuestion
        });
        console.log("   ✅ Message added to thread.");

        console.log("   Creating and polling run (this may take a moment)...");
        const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: assistantId
        });
        console.log("   ✅ Run completed! Status:", run.status);

        if (run.status === 'completed') {
            console.log("   Fetching messages from the thread...");
            const messagesPage = await openai.beta.threads.messages.list(thread.id, { order: "asc" });
            const assistantMessages = messagesPage.data.filter(msg => msg.role === 'assistant');
            
            if (assistantMessages.length > 0) {
                let fullReply = "";
                // Consider taking only the last assistant message for the current turn
                const latestAssistantMsg = assistantMessages[assistantMessages.length - 1]; 
                latestAssistantMsg.content.forEach(contentItem => {
                    if (contentItem.type === 'text') {
                        fullReply += contentItem.text.value + "\n";
                        if (contentItem.text.annotations) {
                            contentItem.text.annotations.forEach(annotation => {
                                if (annotation.type === 'file_citation' || annotation.type === 'file_path') {
                                    console.log("   🔍 Assistant cited a file:", annotation);
                                }
                            });
                        }
                    }
                });
                
                const assistantReplyText = fullReply.trim();
                console.log("   🗣️ Assistant's reply:", assistantReplyText);
                // Return a success object with the text
                return { success: true, text: assistantReplyText };
            } else {
                console.log("   ⚠️ No new assistant messages found after run completion.");
                // Return an object indicating success false (or an error, depending on how you want to treat this)
                // but still provide text for the user.
                return { success: false, text: "I'm sorry, I didn't find a specific answer this time." };
            }
        } else {
            console.error("🔴 Run did not complete successfully. Status:", run.status, run);
            // Return an error object
            return { error: `Run failed with status ${run.status}. Check console for details.` };
        }
    } catch (error) {
        console.error("🔴 Error during interaction with assistant:", error);
        // Return an error object
        return { error: `An error occurred: ${error.message}. Check console.` };
    }
}

/**
 * Main function to set up the interaction listener.
 */
function setupInteraction() {
    if (!openai) {
        console.log("🔴 OpenAI client not initialized. Cannot set up interaction.");
        // Further error display handled by initial check
        return;
    }

    const assistantIdToUse = "asst_izG16o3Nm10JCJrUns2uceBq"; // YOUR Assistant ID

    if (!assistantIdToUse) {
        console.error("🔴 FATAL: `assistantIdToUse` is not set.");
        if (responseArea) responseArea.textContent = "FATAL: Assistant ID not configured.";
        if (submitButton) submitButton.disabled = true;
        return;
    }
    
    console.log(`✅ Ready to interact with Assistant ID: ${assistantIdToUse}`);
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
            
            // 1. Show Loading State
            loadingOverlay.style.display = 'flex';
            responseSpace.style.display = 'none'; // Hide previous response
            submitButton.disabled = true;
            submitButton.textContent = 'Thinking...'; // Button text still useful

            // 2. Call API
            const result = await askAssistant(assistantIdToUse, question);

            // 3. Hide Loading State
            loadingOverlay.style.display = 'none';

            // 4. Process and Display Response
            if (result.error) {
                responseArea.innerHTML = `<strong>You:</strong> ${question}<br><strong>Error:</strong> ${result.error}`;
            } else if (result.success) {
                responseArea.innerHTML = `<strong>You:</strong> ${question}<br><strong>AI Worm:</strong> ${result.text.replace(/\n/g, "<br>")}`;
            } else { // Fallback for unexpected result structure or if 'text' is missing from success
                responseArea.innerHTML = `<strong>You:</strong> ${question}<br><strong>AI Worm:</strong> ${result.text ? result.text.replace(/\n/g, "<br>") : "An unexpected issue occurred."}`;
            }
            
            responseSpace.style.display = 'flex'; // Show the response container

            // 5. Scroll to the response div
            responseSpace.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // 6. Re-enable button (moved to a finally block if more complex error handling was needed, but fine here for now)
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        });
        console.log("✅ Submit button event listener attached.");
    } else {
        console.error("🔴 Could not find all required elements for submit functionality (questionField, submitButton, loadingOverlay, responseSpace, responseArea).");
    }

    if (retryButton && questionField && responseSpace && responseArea) {
        retryButton.addEventListener('click', () => {
            questionField.value = "";
            responseSpace.style.display = 'none';
            if (responseArea.textContent !== "Describe your preferred reading style or a book you liked, and I'll try to find a match!"){
                 responseArea.innerHTML = "..."; // Reset only if it's not the initial prompt
            }
            questionField.focus();
            console.log("🔄 Retry button clicked. Search reset.");
        });
        console.log("✅ Retry button event listener attached.");
    } else {
        console.error("🔴 Could not find all elements for retry button functionality.");
    }
    console.log("UI Interaction setup finished.");
}

if (openai) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupInteraction);
    } else {
        setupInteraction(); 
    }
} else {
    console.log("🔴 Main interaction setup not started (OpenAI client failed to initialize).");
    const initialSetupError = () => {
        if(responseArea && !VITE_OPENAI_API_KEY) {
            responseArea.innerHTML = "<strong>Application Error:</strong> OpenAI API Key is missing. Please configure it and refresh.";
            if (loadingOverlay) loadingOverlay.style.display = 'none';
        }
    };
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialSetupError);
    } else {
        initialSetupError();
    }
}

