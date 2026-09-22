import axios from 'axios';

// System context prompt for Krishi Digital Marketplace
const SYSTEM_PROMPT = `
You are KrishiBot, an intelligent and friendly AI assistant for the "Krishi Digital Marketplace" platform (a Smart India Hackathon agricultural innovation project).
Your mission is to assist farmers, FPO managers, bulk buyers, consumers, logistics drivers, and administrators.

Platform Capabilities you are expert in:
1. Produce & Crop Listings: Farmers and FPOs can list fresh harvests with details like variety, moisture, quantity (kg), base price, and photos.
2. FPO Aggregation & Pooling: Smallholder farmers' crop lots can be aggregated into pooled consignments for bulk buyer pricing power and lower transport costs.
3. Smart Logistics & VRP Route Optimization: Real-time route optimization using Vehicle Routing Problem (VRP) algorithms to schedule dispatches and minimize transport time.
4. Blockchain Escrow Security: Buyer payments are locked safely in smart contract escrow and released to farmers once delivery and quality checks pass.
5. AI Quality Grading: Computer vision & sensor-based inspection for grading agricultural produce into Grade A/B/C.
6. Mandi Rates & Fair Pricing: Transparency in agricultural pricing to prevent middlemen exploitation.

Tone & Style Guidelines:
- Helpful, encouraging, and respectful towards farmers and agricultural stakeholders.
- Provide structured answers using clean bullet points and short paragraphs.
- If asked general farming or weather questions, give practical, agronomic recommendations.
- Keep answers concise yet informative.
`;

// Built-in intelligent answers for offline/fallback mode when GEMINI_API_KEY is not set or throttled
const getFallbackResponse = (message) => {
  const query = message.toLowerCase();

  if (query.includes('list') || query.includes('sell') || query.includes('produce') || query.includes('add crop')) {
    return `### 🌾 How to List Your Produce on Krishi:
1. **Navigate to Farmer Dashboard**: Go to your dashboard and click the **"+ Add Produce"** button.
2. **Enter Harvest Details**: Provide crop name, variety, harvest date, available quantity (in kg), and expected price per kg.
3. **Upload Quality Images**: Add clear photos of your harvest for AI quality inspection.
4. **Publish**: Your produce will immediately appear in the live marketplace for verified buyers and FPOs!`;
  }

  if (query.includes('pool') || query.includes('fpo') || query.includes('aggregate')) {
    return `### 🤝 How FPO Pooling Works:
- **Pooling Small Harvests**: Individual farmers often have small yields. The FPO portal allows aggregating multiple small lots into a single high-volume consignment.
- **Better Bargaining Power**: Pooled consignments attract bulk commercial buyers at premium prices.
- **Shared Logistics**: Reduces per-kg freight expenses by sharing transport vehicles.
- **Access**: Visit the **FPO Portal** (/fpo-dashboard) to see available lots and initiate pooling.`;
  }

  if (query.includes('logistics') || query.includes('track') || query.includes('vrp') || query.includes('route') || query.includes('delivery')) {
    return `### 🚚 Logistics & VRP Route Optimization:
- **Real-Time Tracking**: Access the **Logistics Portal** (/logistics) to view active delivery trucks, transit temperature, and estimated arrival times on an interactive map.
- **VRP Optimizer**: Our Vehicle Routing Problem (VRP) engine computes the shortest, fuel-efficient multi-stop routes for farm pick-ups and destination cold storages.
- **Dispatch Scheduling**: Drivers receive automated trip assignments with pickup points.`;
  }

  if (query.includes('escrow') || query.includes('payment') || query.includes('money') || query.includes('secure') || query.includes('pay')) {
    return `### 🔒 Blockchain Escrow Payment Protection:
- **Zero Risk for Farmers**: When a buyer places an order, payment is locked securely in a smart contract escrow.
- **Guaranteed Payout**: Funds are held until produce is delivered and inspected.
- **Instant Release**: Once verified, the escrow releases funds directly to the farmer/FPO bank account or digital wallet without middlemen deductions!`;
  }

  if (query.includes('quality') || query.includes('grade') || query.includes('ai') || query.includes('inspect')) {
    return `### 🔬 AI Quality Assessment:
- Our computer vision system inspects produce images to detect defects, ripeness, and color uniformity.
- Harvests are classified into **Grade A** (export/premium), **Grade B** (standard market), and **Grade C**.
- Higher quality grades earn verified trust badges and unlock premium buyer bids!`;
  }

  if (query.includes('price') || query.includes('mandi') || query.includes('market') || query.includes('rate')) {
    return `### 📊 Mandi Price Insights:
- Krishi Digital Marketplace monitors live wholesale APMC mandi rates to suggest optimal pricing for your harvest.
- Check the **Analytics & Reports** tab on your dashboard to see price trends, demand forecasts, and seasonal spikes.`;
  }

  if (query.includes('who are you') || query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('help')) {
    return `👋 **Namaste! I am KrishiBot**, your AI agricultural companion powered by Google Gemini.

I can assist you with:
- 🌾 Listing and pricing your farm produce
- 🤝 Joining FPO aggregation pools for higher margins
- 🚚 Tracking cold-chain dispatches & route optimization
- 🔒 Securing payments through blockchain escrow
- 🔬 AI crop grading & agronomy tips

Feel free to ask me any question!`;
  }

  return `### 🤖 Krishi AI Assistant:
Thank you for your question! Here is how our digital agricultural platform can support you:
- **Direct Trade**: Connect directly between verified farmers and institutional buyers without intermediary fee cuts.
- **Smart Logistics**: Live GPS tracking and VRP routing for multi-farm pickups.
- **Escrow Guarantee**: Safe payments protected by smart contracts.

*(Tip: To enable custom generative responses directly from Google Gemini, ensure \`GEMINI_API_KEY\` is added in your backend \`.env\` file).*`;
};

/**
 * Handle incoming chat message
 * POST /api/chat
 */
export const handleChatMessage = async (req, res) => {
  try {
    const { message, history = [], customApiKey } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required.',
      });
    }

    const apiKey = customApiKey || process.env.GEMINI_API_KEY;

    // If an API key is available, call Google Gemini API
    if (apiKey && apiKey.trim()) {
      try {
        // Format history for Gemini generateContent
        const contents = [
          {
            role: 'user',
            parts: [{ text: `${SYSTEM_PROMPT}\n\nPlease respond to the user query.` }],
          },
          {
            role: 'model',
            parts: [{ text: "Understood! I am KrishiBot, ready to assist with all Krishi Digital Marketplace features and agricultural inquiries." }],
          },
        ];

        // Append recent conversation turns
        if (Array.isArray(history)) {
          const recentHistory = history.slice(-6);
          recentHistory.forEach((item) => {
            if (item.sender === 'user') {
              contents.push({ role: 'user', parts: [{ text: item.text }] });
            } else if (item.sender === 'bot') {
              contents.push({ role: 'model', parts: [{ text: item.text }] });
            }
          });
        }

        // Add current user prompt
        contents.push({
          role: 'user',
          parts: [{ text: message.trim() }],
        });

        // Try primary model (gemini-1.5-flash or gemini-2.0-flash)
        const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
        let geminiResponse = null;
        let lastError = null;

        for (const model of models) {
          try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
            const response = await axios.post(
              url,
              { contents },
              {
                headers: { 'Content-Type': 'application/json' },
                timeout: 12000,
              }
            );

            if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
              geminiResponse = response.data.candidates[0].content.parts[0].text;
              break;
            }
          } catch (err) {
            lastError = err;
            // Continue to try next model fallback if model not found or rate limited
          }
        }

        if (geminiResponse) {
          return res.status(200).json({
            success: true,
            reply: geminiResponse,
            source: 'gemini',
          });
        }

        console.warn('Gemini API call failed, using intelligent domain fallback:', lastError?.message);
      } catch (geminiErr) {
        console.warn('Gemini request failed, falling back to local domain KB:', geminiErr.message);
      }
    }

    // Graceful intelligent fallback if key is not configured or network failed
    const fallbackReply = getFallbackResponse(message);
    return res.status(200).json({
      success: true,
      reply: fallbackReply,
      source: 'fallback',
      note: apiKey ? 'Fallback used due to API quota/error' : 'Configure GEMINI_API_KEY for live generative responses',
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process chat query.',
      error: error.message,
    });
  }
};
