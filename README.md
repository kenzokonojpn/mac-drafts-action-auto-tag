# Drafts Auto-Tagging Script

Automatically generate Japanese tags for your [Drafts](https://getdrafts.com) notes using Anthropic's Claude AI.

## 🌟 Features

- **Intelligent Tagging**: Generates 3 relevant Japanese tags per draft using Claude 3 Haiku
- **Batch Processing**: Processes multiple drafts efficiently with rate limiting
- **Smart Filtering**: Only processes drafts with fewer than 3 existing tags
- **Multi-Folder Support**: Searches inbox, archive, and untagged folders
- **Cost Effective**: Uses Claude 3 Haiku for optimal cost/performance balance
- **Progress Tracking**: Console logging with detailed progress information
- **Error Handling**: Robust error handling with detailed logging

## 📋 Prerequisites

- [Drafts app](https://getdrafts.com) (iOS/iPadOS/macOS)
- [Anthropic API key](https://console.anthropic.com/)
- Basic understanding of Drafts Actions

## 🚀 Installation

1. **Get an Anthropic API Key**
   - Sign up at [Anthropic Console](https://console.anthropic.com/)
   - Generate an API key
   - Fund your account (estimated cost: ~$0.012 per draft)

2. **Download the Script**
   - Download `drafts-auto-tagging.js` from this repository

3. **Configure the Script**
   ```javascript
   const API_KEY = "your-anthropic-api-key-here"; // Replace with your API key
   const MAX_DRAFTS = 100; // Adjust batch size as needed
   ```

4. **Install in Drafts**
   - Open Drafts app
   - Go to Actions → Import Action
   - Create a new Script Action
   - Paste the script code
   - Save the action

## ⚙️ Configuration

### Key Settings

```javascript
const API_KEY = "your-api-key";     // Your Anthropic API key
const BATCH_SIZE = 10;              // Drafts processed per batch
const MAX_DRAFTS = 100;             // Maximum drafts per run
```

### Batch Size Recommendations

- **Small test**: `MAX_DRAFTS = 5-10`
- **Regular use**: `MAX_DRAFTS = 50-100`
- **Bulk processing**: `MAX_DRAFTS = 1000-3000`

## 📖 Usage

1. **Run the Action**
   - Select the auto-tagging action in Drafts
   - Confirm the processing parameters
   - Wait for completion

2. **Monitor Progress**
   - Check the console log for detailed progress
   - Review the final summary report

3. **Review Results**
   - Generated tags are automatically added to drafts
   - Processing log is saved as a new draft
   - Check for any errors in the summary

## 💰 Cost Estimation

- **Claude 3 Haiku**: ~$0.012 per draft
- **100 drafts**: ~$1.20
- **1000 drafts**: ~$12.00

*Costs may vary based on content length and API pricing changes.*

## 🔒 Security Notes

- **Never commit your API key to version control**
- **Use environment variables in production**
- **Monitor your API usage regularly**
- **Revoke unused API keys**

## 🛠️ Troubleshooting

### Common Issues

1. **"undefined is not an object" error**
   - Check that Drafts can access your folders
   - Ensure you have drafts in your workspace

2. **API authentication errors**
   - Verify your API key is correct
   - Check your Anthropic account balance

3. **No drafts found for processing**
   - Check folder permissions
   - Verify drafts have fewer than 3 tags

### Debug Mode

Enable detailed logging by checking the console output during execution.

## 📝 How It Works

1. **Draft Discovery**: Searches inbox, archive, and untagged folders
2. **Filtering**: Identifies drafts with fewer than 3 tags
3. **AI Processing**: Sends draft content to Claude 3 Haiku
4. **Tag Generation**: Receives 3 relevant Japanese tags
5. **Application**: Adds new tags to drafts (avoiding duplicates)
6. **Logging**: Creates detailed processing report

## 🏷️ Tag Examples

The AI generates contextually relevant Japanese tags:

- Business emails → `契約`, `取引`, `金融`
- Meeting notes → `会議議事録`, `販売戦略`, `ブランド管理`
- Technical docs → `ネットワーク機器`, `パッチケーブル`, `ケーブル注文`

## 🔄 Version History

- **v1.0.0** - Initial release with basic auto-tagging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This script interacts with external AI services and modifies your Drafts data. Always:
- Test with a small batch first
- Backup important drafts
- Monitor API costs
- Review generated tags for accuracy

## 🔗 Links

- [Drafts App](https://getdrafts.com)
- [Anthropic Console](https://console.anthropic.com)
- [Claude API Documentation](https://docs.anthropic.com/claude/reference)
- [Drafts Scripting Guide](https://docs.getdrafts.com/docs/actions/scripting)

---

**Made with ❤️ for the Drafts community**
