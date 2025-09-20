// Drafts Auto-Tagging Setup Helper
// This script helps you configure the auto-tagging system

// ========================================
// Setup Wizard
// ========================================

async function setupAutoTagging() {
    let setupComplete = false;
    
    try {
        // Welcome message
        const welcomeMessage = `🎉 Welcome to Drafts Auto-Tagging Setup!

This wizard will help you configure the auto-tagging system.

Requirements:
✅ Drafts app installed
⚠️ Anthropic API key needed
💰 API credits in your account

Ready to begin?`;

        const startSetup = await showConfirmation("Setup Wizard", welcomeMessage);
        
        if (!startSetup) {
            alert("Setup cancelled. Run this script again when ready!");
            return;
        }

        // Step 1: API Key check
        const apiKeyPrompt = Prompt.create();
        apiKeyPrompt.title = "🔑 API Key Configuration";
        apiKeyPrompt.message = `Please enter your Anthropic API key:

Get your key from: https://console.anthropic.com/

Format: sk-ant-api03-...`;
        apiKeyPrompt.addTextField("apiKey", "API Key", "");
        apiKeyPrompt.addButton("Continue");
        apiKeyPrompt.addButton("Cancel");
        
        if (!apiKeyPrompt.show() || apiKeyPrompt.buttonPressed === "Cancel") {
            alert("Setup cancelled.");
            return;
        }
        
        const apiKey = apiKeyPrompt.fieldValues["apiKey"].trim();
        
        if (!apiKey || !apiKey.startsWith("sk-ant-api03-")) {
            alert("❌ Invalid API key format. Please check and try again.");
            return;
        }

        // Step 2: Processing configuration
        const configPrompt = Prompt.create();
        configPrompt.title = "⚙️ Processing Configuration";
        configPrompt.message = `Configure your processing settings:

Recommended for first run: 10 drafts
For bulk processing: 100-1000 drafts`;
        configPrompt.addTextField("maxDrafts", "Max Drafts", "10");
        configPrompt.addTextField("batchSize", "Batch Size", "10");
        configPrompt.addButton("Continue");
        configPrompt.addButton("Cancel");
        
        if (!configPrompt.show() || configPrompt.buttonPressed === "Cancel") {
            alert("Setup cancelled.");
            return;
        }
        
        const maxDrafts = parseInt(configPrompt.fieldValues["maxDrafts"]) || 10;
        const batchSize = parseInt(configPrompt.fieldValues["batchSize"]) || 10;

        // Step 3: Generate configuration
        const configCode = `// Auto-generated configuration - ${new Date().toISOString()}

// ========================================
// Configuration Section
// ========================================
const API_KEY = "${apiKey}";
const API_URL = "https://api.anthropic.com/v1/messages";
const BATCH_SIZE = ${batchSize};
const MAX_DRAFTS = ${maxDrafts};

// ========================================
// Estimated Costs
// ========================================
// Cost per draft: ~$0.012
// Estimated cost for ${maxDrafts} drafts: ~$${(maxDrafts * 0.012).toFixed(2)}

// Ready to use! Copy this configuration to your main script.`;

        // Step 4: Save configuration
        const configDraft = Draft.create();
        configDraft.content = configCode;
        configDraft.addTag("auto-tagging");
        configDraft.addTag("configuration");
        configDraft.addTag("setup");
        configDraft.update();

        // Step 5: Final instructions
        const finalMessage = `✅ Setup Complete!

📝 Configuration saved as new draft
⚙️ Settings:
   • Max Drafts: ${maxDrafts}
   • Batch Size: ${batchSize}
   • Estimated Cost: ~$${(maxDrafts * 0.012).toFixed(2)}

🚀 Next Steps:
1. Copy the configuration from the saved draft
2. Paste it into your main auto-tagging script
3. Run the auto-tagging action

⚠️ Security Reminder:
Keep your API key secure and never share it publicly!

Ready to start tagging?`;

        const runNow = await showConfirmation("🎉 Setup Complete", finalMessage);
        
        if (runNow) {
            alert("Great! Look for your saved configuration draft and update your main script.");
        }
        
        setupComplete = true;
        
    } catch (error) {
        console.log("Setup error:", error);
        alert(`❌ Setup error: ${error.message}\n\nPlease try again or configure manually.`);
    }
    
    return setupComplete;
}

// ========================================
// Test API Connection
// ========================================
async function testApiConnection(apiKey) {
    try {
        const http = HTTP.create();
        
        const testPrompt = "Test connection - respond with just 'OK'";
        
        const requestData = {
            model: "claude-3-haiku-20240307",
            max_tokens: 10,
            messages: [{
                role: "user",
                content: testPrompt
            }]
        };
        
        const response = http.request({
            url: "https://api.anthropic.com/v1/messages",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01"
            },
            data: requestData
        });
        
        if (response.statusCode === 200) {
            return { success: true, message: "API connection successful!" };
        } else {
            return { success: false, message: `API error: ${response.statusCode}` };
        }
        
    } catch (error) {
        return { success: false, message: `Connection failed: ${error.message}` };
    }
}

// ========================================
// Utility Functions
// ========================================
function showConfirmation(title, message) {
    return new Promise((resolve) => {
        const p = Prompt.create();
        p.title = title;
        p.message = message;
        p.addButton("Yes");
        p.addButton("No");
        
        if (p.show()) {
            resolve(p.buttonPressed === "Yes");
        } else {
            resolve(false);
        }
    });
}

// ========================================
// Run Setup
// ========================================
setupAutoTagging();