// api/ask-assistant.js
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { question } = req.body;
        
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        const assistantId = process.env.ASSISTANT_ID;
        
        if (!assistantId) {
            return res.status(500).json({ error: 'Assistant ID not configured' });
        }

        console.log(`Asking Assistant (ID: ${assistantId}): "${question}"`);

        // Create thread
        const thread = await openai.beta.threads.create();
        console.log("Thread created. ID:", thread.id);
        
        // Add message to thread
        await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: question
        });
        console.log("Message added to thread.");

        // Run the assistant
        const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
            assistant_id: assistantId
        });
        console.log("Run completed! Status:", run.status);

        if (run.status === 'completed') {
            const messagesPage = await openai.beta.threads.messages.list(thread.id, { order: "asc" });
            const assistantMessages = messagesPage.data.filter(msg => msg.role === 'assistant');
            
            if (assistantMessages.length > 0) {
                let fullReply = "";
                const latestAssistantMsg = assistantMessages[assistantMessages.length - 1]; 
                latestAssistantMsg.content.forEach(contentItem => {
                    if (contentItem.type === 'text') {
                        fullReply += contentItem.text.value + "\n";
                        if (contentItem.text.annotations) {
                            contentItem.text.annotations.forEach(annotation => {
                                if (annotation.type === 'file_citation' || annotation.type === 'file_path') {
                                    console.log("Assistant cited a file:", annotation);
                                }
                            });
                        }
                    }
                });
                
                const assistantReplyText = fullReply.trim();
                console.log("Assistant's reply:", assistantReplyText);
                
                return res.status(200).json({ 
                    success: true, 
                    text: assistantReplyText 
                });
            } else {
                console.log("No new assistant messages found after run completion.");
                return res.status(200).json({ 
                    success: false, 
                    text: "I'm sorry, I didn't find a specific answer this time." 
                });
            }
        } else {
            console.error("Run did not complete successfully. Status:", run.status, run);
            return res.status(500).json({ 
                error: `Run failed with status ${run.status}. Check console for details.` 
            });
        }
    } catch (error) {
        console.error('Error during interaction with assistant:', error);
        return res.status(500).json({ 
            error: `An error occurred: ${error.message}. Check console.` 
        });
    }
}