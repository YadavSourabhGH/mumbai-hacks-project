const express = require('express');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Load environment variables
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS

const port = 3000; // Set your port number
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }); // Initialize Groq client

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });
  
app.post('/assess', async (req, res) => {
    const userData = req.body; // Get user data from the request body

    // Extract user data from the request
    const {
        is_employed,
        is_married,
        have_kids,
        num_kids,
        previous_loan,
        avg_monthly_spending,
        avg_monthly_saving,
        avg_monthly_investment,
        salary_amount_per_month,
        salary_statement_and_list,
        responsibility_based_payment,
        how_many_member_earn_in_family,
        avg_household_income_1_year
    } = userData;

    // Create the user prompt
    const message = `
User Data:
  - Employment Status: ${is_employed}
  - Marital Status: ${is_married}
  - Number of Kids: ${num_kids || 0}
  - Previous Loan Status: ${previous_loan}
  - Average Monthly Spending: ₹${avg_monthly_spending}
  - Average Monthly Saving: ₹${avg_monthly_saving}
  - Average Monthly Investment: ₹${avg_monthly_investment}
  - Monthly Salary: ₹${salary_amount_per_month}
  - Salary Statement: ${salary_statement_and_list}
  - Responsibility-Based Payments: ₹${responsibility_based_payment}
  - Family Earning Members: ${how_many_member_earn_in_family}
  - Average Household Income (1 Year): ₹${avg_household_income_1_year}
`;

    try {
        // Call the Groq API
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `
                    “You are an AI-based creditworthiness assessment model designed specifically for evaluating financial stability in India. Instead of relying solely on traditional credit scores, your assessment takes into account a range of non-traditional data points, including utility payments, mobile usage, e-commerce spending, salary, rent payments, and loan repayment history. Your primary task is to assign a credit score from 1 to 10, where 1 represents very poor creditworthiness and 10 represents excellent creditworthiness.

To evaluate creditworthiness accurately, use the following criteria:

Income Level: Higher income should increase the score, indicating better financial stability.
Payment Consistency: On-time payment of utilities, rent, and previous loans reflects positive financial responsibility.
Spending Patterns: High spending without adequate savings may indicate financial risk and should reduce the score.
Mobile Data Usage: Heavy mobile usage can indicate tech-savviness, but balance it with income data to avoid penalizing low-income users who rely on their phones.
Rent and Loan Repayments: Consistent and timely repayments improve the score, while missed or delayed payments lower it.
Your output should be a single integer score 0 or 1 and a brief explanatory sentence or two summarizing the key reasons for that score. If data is missing or unclear, generate the best possible score based on available information, noting any limitations. remember that max-token is 40 only

Example Response Format:

Score: [either 0 or 1]
Explanation: [Brief message on scoring rationale, e.g., "Consistent income and timely rent payments improve score, though high spending relative to income lowers it slightly."]`
                },
                {
                    role: 'user',
                    content: message,
                }
            ],
            model: "llama-3.1-70b-versatile",
            temperature: 0.1,
            max_tokens: 50,
            top_p: 0.5
        });

        // Send the AI's response back to the frontend
        const aiResponse = chatCompletion.choices[0].message.content;
        res.json({ ai_response: aiResponse });
    } catch (error) {
        console.error("Error fetching AI response:", error);
        res.status(500).json({ error: 'Failed to fetch AI response' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
