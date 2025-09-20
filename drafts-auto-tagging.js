// Drafts Auto-Tagging Script
// Automatically generates Japanese tags for drafts using Anthropic Claude API
// Repository: https://github.com/yourusername/drafts-auto-tagging
// License: MIT
// Created: 2025-09-21

// ========================================
// Configuration Section
// ========================================
const API_KEY = "ここにAnthropicのAPIキーを入れる"; // Replace with your Anthropic API key
const API_URL = "https://api.anthropic.com/v1/messages";
const BATCH_SIZE = 10; // Number of drafts processed per batch
const MAX_DRAFTS = 100; // Maximum number of drafts to process in one run (set to 3000 for full processing)

// ========================================
// Main Processing Function
// ========================================
async function autoTagDrafts() {
    try {
        console.log("🚀 Starting auto-tagging process");
        
        // 1. Retrieve all drafts from multiple folders
        let allDrafts;
        try {
            // Try to get drafts from inbox folder
            const inboxDrafts = Draft.query("", "inbox", [], [], "created", false, false) || [];
            console.log(`Inbox drafts: ${inboxDrafts.length}`);
            
            // Try to get drafts from archive folder
            const archiveDrafts = Draft.query("", "archive", [], [], "created", false, false) || [];
            console.log(`Archive drafts: ${archiveDrafts.length}`);
            
            // Try to get drafts from untagged folder (if exists)
            let untaggedDrafts = [];
            try {
                untaggedDrafts = Draft.query("", "untagged", [], [], "created", false, false) || [];
                console.log(`Untagged drafts: ${untaggedDrafts.length}`);
            } catch (e) {
                console.log("Untagged folder not accessible (may not exist)");
            }
            
            // Combine all drafts (remove duplicates by UUID)
            const allDraftsMap = new Map();
            [...inboxDrafts, ...archiveDrafts, ...untaggedDrafts].forEach(draft => {
                allDraftsMap.set(draft.uuid, draft);
            });
            allDrafts = Array.from(allDraftsMap.values());
            console.log(`Total drafts (after deduplication): ${allDrafts.length}`);
            
        } catch (error) {
            console.log("Draft retrieval error:", error);
            // Fallback: inbox only
            allDrafts = Draft.query("", "inbox", [], [], "created", false, false) || [];
        }
        
        // Safety check
        if (!allDrafts || !Array.isArray(allDrafts)) {
            alert("❌ Failed to retrieve drafts.\n\nPlease check the Drafts app status.");
            return;
        }
        
        console.log(`Retrieved drafts: ${allDrafts.length}`);
        
        // 2. Filter drafts with less than 3 tags
        let targetDrafts = allDrafts.filter(d => d.tags.length < 3);
        
        if (targetDrafts.length > MAX_DRAFTS) {
            targetDrafts = targetDrafts.slice(0, MAX_DRAFTS);
        }
        
        console.log(`Target drafts for processing: ${targetDrafts.length}`);
        
        if (targetDrafts.length === 0) {
            alert("🎊 Excellent!\n\nNo drafts found that need tagging.\nAll drafts have sufficient tags!\n\n✨ The tagging system is ready for new drafts.");
            return;
        }
        
        // 3. Processing confirmation
        const estimatedCost = Math.round(targetDrafts.length * 0.012 * 100) / 100; // Claude 3 Haiku pricing
        const estimatedMinutes = Math.ceil(targetDrafts.length / BATCH_SIZE * 0.3);
        
        const proceed = await showConfirmation(
            `🚀 Auto-tagging Process`,
            `Process ${targetDrafts.length} drafts in batch.

✅ Method: Direct object transmission
🤖 AI Model: Claude 3 Haiku
💰 Estimated cost: ~$${estimatedCost}
⏱️ Estimated time: ~${estimatedMinutes} minutes
📦 Batch size: ${BATCH_SIZE} drafts per batch

🚀 Ready to start processing!
Continue?`
        );
        
        if (!proceed) {
            alert("Processing cancelled.");
            return;
        }
        
        // 4. Start processing
        let processedCount = 0;
        let successCount = 0;
        let errorCount = 0;
        const errors = [];
        const successfulTags = [];
        const startTime = new Date();
        
        for (let i = 0; i < targetDrafts.length; i += BATCH_SIZE) {
            const batch = targetDrafts.slice(i, i + BATCH_SIZE);
            const batchNum = Math.floor(i / BATCH_SIZE) + 1;
            const totalBatches = Math.ceil(targetDrafts.length / BATCH_SIZE);
            
            console.log(`🔄 Processing batch ${batchNum}/${totalBatches}...`);
            
            // Process each draft in the batch
            for (const draft of batch) {
                try {
                    const tags = await generateTagsForDraft(draft);
                    if (tags && tags.length > 0) {
                        // Add only new tags (avoid duplicates)
                        const newTags = tags.filter(tag => !draft.tags.includes(tag));
                        if (newTags.length > 0) {
                            newTags.forEach(tag => draft.addTag(tag));
                            draft.update();
                            successCount++;
                            successfulTags.push({
                                title: draft.displayTitle.substring(0, 30),
                                tags: newTags
                            });
                            console.log(`✅ "${draft.displayTitle.substring(0, 30)}" - Tags: ${newTags.join(', ')}`);
                        } else {
                            console.log(`ℹ️ "${draft.displayTitle.substring(0, 30)}" - No new tags (duplicate avoidance)`);
                        }
                    } else {
                        console.log(`⚠️ "${draft.displayTitle.substring(0, 30)}" - No tags generated`);
                    }
                } catch (error) {
                    console.log(`❌ "${draft.displayTitle.substring(0, 30)}" - ${error.message}`);
                    errorCount++;
                    errors.push({
                        title: draft.displayTitle.substring(0, 30),
                        error: error.message.substring(0, 50)
                    });
                }
                processedCount++;
                
                // API rate limiting - light delay
                syncDelay(150);
            }
            
            // Progress logging (console only for silent processing)
            const elapsed = Math.floor((new Date() - startTime) / 1000);
            const progress = Math.round((processedCount / targetDrafts.length) * 100);
            const successRate = Math.round(successCount / processedCount * 100);
            
            console.log(`📊 Progress: ${processedCount}/${targetDrafts.length} (${progress}%) | Success: ${successCount} (${successRate}%) | Errors: ${errorCount} | Elapsed: ${Math.floor(elapsed/60)}m${elapsed%60}s`);
            
            // Inter-batch delay (API load reduction)
            if (i + BATCH_SIZE < targetDrafts.length) {
                syncDelay(800);
            }
        }
        
        // 5. Final results report
        const totalTime = Math.floor((new Date() - startTime) / 1000);
        const actualCost = Math.round(processedCount * 0.012 * 100) / 100;
        const successRate = Math.round(successCount / processedCount * 100);
        const processingSpeed = Math.round(processedCount / (totalTime / 60));
        
        let reportText = `🎊 Auto-tagging completed successfully!

📊 Final Results:
Total processed: ${processedCount}
✅ Success: ${successCount} (${successRate}%)
❌ Errors: ${errorCount}
💰 Actual cost: $${actualCost}
⏱️ Processing time: ${Math.floor(totalTime/60)}m${totalTime%60}s
⚡ Processing speed: ${processingSpeed} drafts/min

🏆 ${successCount} drafts received new tags!

🔧 Technology: Direct object transmission method
🤖 AI Model: Claude 3 Haiku`;

        // Examples of successful tags (first 10)
        if (successfulTags.length > 0) {
            reportText += `\n\n🏷️ Sample added tags (first 10):\n`;
            successfulTags.slice(0, 10).forEach((item, index) => {
                reportText += `${index + 1}. "${item.title}..." → ${item.tags.join(', ')}\n`;
            });
        }
        
        // Error details (first 5)
        if (errors.length > 0) {
            reportText += `\n⚠️ Error details (first 5):\n`;
            errors.slice(0, 5).forEach((item, index) => {
                reportText += `${index + 1}. "${item.title}...": ${item.error}\n`;
            });
        }
        
        alert(reportText);
        
        // Save processing log
        const logDraft = Draft.create();
        logDraft.content = `✨ Auto-tagging Processing Log
Execution time: ${startTime.toISOString()}
Completion time: ${new Date().toISOString()}
Processing time: ${Math.floor(totalTime/60)}m${totalTime%60}s

🔧 Method: Direct object transmission
🤖 AI Model: Claude 3 Haiku

=== 📊 Processing Results ===
Total processed: ${processedCount}
Success: ${successCount} (${successRate}%)
Errors: ${errorCount}
Actual cost: $${actualCost}
Processing speed: ${processingSpeed} drafts/min

=== 🔧 Configuration ===
Batch size: ${BATCH_SIZE}
Max drafts: ${MAX_DRAFTS}
Progress display: Console only
HTTP method: Direct object transmission

=== 🏷️ Sample successful tags ===
${successfulTags.slice(0, 20).map((item, i) => `${i+1}. "${item.title}..." → ${item.tags.join(', ')}`).join('\n')}

=== ❌ Error details ===
${errors.map((item, i) => `${i+1}. "${item.title}...": ${item.error}`).join('\n')}`;
        
        logDraft.addTag("auto-tagging");
        logDraft.addTag("processing-log");
        logDraft.addTag("claude-api");
        logDraft.update();
        
        console.log("🚀 Auto-tagging process completed successfully!");
        
    } catch (error) {
        console.log("Main processing error:", error);
        alert(`❌ An unexpected error occurred: ${error.message}\n\nPlease check the console for details.`);
    }
}

// ========================================
// API Processing Function
// ========================================
async function generateTagsForDraft(draft) {
    const content = draft.content.substring(0, 1200);
    const title = draft.displayTitle;
    
    const prompt = `以下のノート内容を分析して、最も適切なタグを3つ提案してください。

タイトル: ${title}
内容: ${content}

条件:
- 日本語でタグを生成
- 内容に最も関連性の高いタグ3つ
- 各タグは2-10文字程度
- 一般的で検索しやすい用語を使用
- カテゴリ、トピック、用途、概念を考慮
- 専門用語も適切に使用

回答は以下のJSON形式のみで返してください:
{"tags": ["タグ1", "タグ2", "タグ3"]}`;

    try {
        const http = HTTP.create();
        
        // IMPORTANT: Send object directly (no JSON.stringify() needed)
        const requestData = {
            model: "claude-3-haiku-20240307",
            max_tokens: 250,
            messages: [{
                role: "user",
                content: prompt
            }]
        };
        
        const response = http.request({
            url: API_URL,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
                "anthropic-version": "2023-06-01"
            },
            data: requestData // ✅ Direct object transmission
        });
        
        if (response.statusCode === 200) {
            const data = JSON.parse(response.responseText);
            const aiResponse = data.content[0].text;
            
            // Extract JSON portion
            const jsonMatch = aiResponse.match(/\{.*\}/);
            if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                return result.tags || [];
            }
        } else {
            throw new Error(`API Error: ${response.statusCode}`);
        }
    } catch (error) {
        throw error;
    }
    
    return [];
}

// ========================================
// Utility Functions
// ========================================
function showConfirmation(title, message) {
    return new Promise((resolve) => {
        const p = Prompt.create();
        p.title = title;
        p.message = message;
        p.addButton("Start");
        p.addButton("Cancel");
        
        if (p.show()) {
            resolve(p.buttonPressed === "Start");
        } else {
            resolve(false);
        }
    });
}

function syncDelay(ms) {
    const start = new Date().getTime();
    while (new Date().getTime() < start + ms) {
        // Synchronous wait
    }
}

// ========================================
// Execute Auto-tagging
// ========================================
autoTagDrafts();