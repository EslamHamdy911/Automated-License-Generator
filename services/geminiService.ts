import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FormData, GeneratedDocs, LicenseType } from '../types';

const apiKey = process.env.API_KEY;

// Schema for the structured output
const docSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    readmeContent: {
      type: Type.STRING,
      description: "The content of the README.md file in Markdown format, bilingual (Arabic and English). Must include Attribution, IP Rights, and Project Description sections.",
    },
    licenseContent: {
      type: Type.STRING,
      description: "The full text content of the LICENSE file.",
    },
  },
  required: ["readmeContent", "licenseContent"],
};

export const generateDocs = async (data: FormData): Promise<GeneratedDocs> => {
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  let licenseInstructions = '';
  const currentYear = new Date().getFullYear();

  if (data.licenseType === LicenseType.MIT) {
    licenseInstructions = `
      1. LICENSE: Must be the full official MIT License text.
         - At the top, include EXACTLY: "Copyright (c) ${currentYear} ${data.authorName}".
         - At the bottom, repeat: "© ${currentYear} ${data.authorName}. All rights reserved."
    `;
  } else {
    // Default to CC BY-SA 4.0
    licenseInstructions = `
      1. LICENSE: Must be the "Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)". Provide the text in a way that is legally sound, including an Arabic translation or summary if standard, followed by the English text.
    `;
  }

  const prompt = `
    You are a legal and technical documentation expert.
    
    Create a README.md and a LICENSE file for the following project:
    - Project Name: ${data.projectName}
    - Author/Owner: ${data.authorName}
    - Type: ${data.projectType}
    - License Type: ${data.licenseType}
    - Description: ${data.projectDescription}

    Requirements:
    ${licenseInstructions}

    2. README.md: 
       - Must be bilingual (Arabic and English).
       - Must include a section for "Attribution" (نسب المصنف) stating that credit must be given to ${data.authorName}.
       - Must include a section for "Intellectual Property" (الملكية الفكرية).
       - Must include a project description based on the user input.
       - Include a "Features" section and "Tools Used" section based on the description provided.
       - At the end, add a "License" section that states: "This project is licensed under the ${data.licenseType === LicenseType.MIT ? 'MIT License' : 'CC BY-SA 4.0 License'} – see the LICENSE file for details."
       - Finally, add a footer line: "© ${currentYear} ${data.authorName}. All rights reserved."
       - If the project type is 'commercial', emphasize usage restrictions or permissions based on the selected license.
       - If 'experimental', add a disclaimer about warranty.
    
    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: docSchema,
        temperature: 0.3, // Low temperature for consistent legal/technical text
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response received from Gemini");
    }

    const parsedResult = JSON.parse(resultText) as GeneratedDocs;
    return parsedResult;

  } catch (error) {
    console.error("Error generating docs:", error);
    throw error;
  }
};