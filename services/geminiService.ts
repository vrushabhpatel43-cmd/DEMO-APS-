
import { GoogleGenAI } from "@google/genai";
import type { DailyReport } from '../types';

const getAiInstance = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateReportSummary = async (report: DailyReport): Promise<string> => {
  const ai = getAiInstance();

  const fullPrompt = `
    Generate a concise and professional end-of-day (EOD) summary for a telecaller based on the following data.
    The summary should highlight key metrics and outcomes.

    **Daily Report Data for ${new Date(report.date).toLocaleDateString()}:**
    - Telecaller Name: ${report.telecallerName}
    - CP Firm (Dialing For): ${report.cpFirmDialingFor}
    - Total Calls Dialed: ${report.callsDialed}
    - Calls Connected: ${report.callsConnected}
    - Projects Explained: ${report.projectsExplained}

    **Site Visits Scheduled (${report.scheduledVisits.length}):**
    ${report.scheduledVisits.map(v => `- ${v.clientName} (${v.cpFirm}) - Contact: ${v.clientContact}`).join('\n') || 'None'}

    **Site Visits Completed Today (${report.completedVisits.length}):**
    ${report.completedVisits.map(v => `- ${v.clientName} (${v.cpFirm}) - Status: ${v.status}`).join('\n') || 'None'}

    **New Leads / Notes (${report.leads.length}):**
    ${report.leads.map(l => `- ${l.clientName} (${l.contactInfo}): ${l.notes}`).join('\n') || 'No new leads.'}

    **Instructions:**
    - Start with a brief opening statement mentioning the telecaller's name and the date.
    - Summarize the key statistics (dials, connections, explanations).
    - List the scheduled and completed site visits clearly.
    - Include the leads/notes section.
    - Maintain a professional and data-driven tone.
    - Do not add any preamble like "Here is the summary...". Just start the summary.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating report summary with Gemini API:", error);
    throw new Error("Failed to generate report summary. Please try again.");
  }
};


export const getAIInsights = async (reports: DailyReport[], question: string): Promise<string> => {
  if (reports.length === 0) {
    return "There is no report data to analyze.";
  }

  const ai = getAiInstance();

  const fullPrompt = `
    You are an expert data analyst for a sales team. Your task is to answer questions based on the provided End-of-Day (EOD) report data.
    The data is provided as a JSON array. Each object in the array represents one daily report from a telecaller.

    **EOD Report Data:**
    \`\`\`json
    ${JSON.stringify(reports, null, 2)}
    \`\`\`

    **User's Question:**
    "${question}"

    **Instructions:**
    - Analyze the provided JSON data to answer the user's question.
    - Provide a clear, concise, and data-driven answer.
    - If the data is insufficient to answer the question accurately, state that clearly.
    - Base your answer *only* on the information present in the JSON data. Do not invent information.
    - Present the answer in a professional and easy-to-understand format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating AI insights with Gemini API:", error);
    throw new Error("Failed to get AI insights. The model may be unavailable or the request may have failed.");
  }
};
