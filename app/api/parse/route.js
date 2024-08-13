import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

export async function POST(req) {
  const { bankStatement } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that parses bank statements and extracts expense details like name, cost, and category. You only respond with an array of expenses in JSON string format.",
        },
        {
          role: "user",
          content: `Extract expenses from the following bank statement and return them in JSON string format with the fields: name, cost, and category: ${bankStatement}. Only use these categories: groceries, dining, entertainment, transportation, other. Make the names readable.`,
        },
      ],
    });

    // Log the response content before parsing
    let content = completion.choices[0].message.content;
    console.log("OpenAI API response:", content);

    // Use a regex to extract the content inside the square brackets
    const jsonArrayMatch = content.match(/\[.*\]/s);
    if (jsonArrayMatch) {
      content = jsonArrayMatch[0]; // Get the first match which should be the JSON array
    } else {
      throw new Error("No JSON array found in the response.");
    }

    // Attempt to parse the sanitized content as JSON
    const parsedExpenses = JSON.parse(content);

    return NextResponse.json({ expenses: parsedExpenses });
  } catch (error) {
    console.error("Error parsing bank statement:", error);
    return NextResponse.json({ error: "Error parsing bank statement" }, { status: 500 });
  }
}
