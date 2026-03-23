interface QuestionConfig {
  questionTypes: string[];
  questionsPerType: number;
  difficulty: string;
  jobTitle: string;
  jobDescription: string;
  requirements: string;
}

interface GeneratedQuestion {
  title: string;
  challenge_doc: string;
  max_pts: number;
  question_type: string;
  difficulty: string;
}

interface MCQQuestion extends GeneratedQuestion {
  question_type: "mcq";
  options: string[];
  correctAnswer: number;
}

interface DSAQuestion extends GeneratedQuestion {
  question_type: "dsa";
  inputFormat: string;
  outputFormat: string;
  sampleInput: string;
  sampleOutput: string;
  constraints: string[];
}

interface BackendQuestion extends GeneratedQuestion {
  question_type: "backend";
  endpoint: string;
  method: string;
  requestBody?: string;
  expectedResponse: string;
  statusCodes: number[];
}

interface FrontendQuestion extends GeneratedQuestion {
  question_type: "frontend";
  componentRequirements: string[];
  apiEndpoints: string[];
  expectedBehavior: string;
}

type Question = MCQQuestion | DSAQuestion | BackendQuestion | FrontendQuestion;

export async function generateQuestions(
  config: QuestionConfig,
): Promise<Question[]> {
  const {
    questionTypes,
    questionsPerType,
    difficulty,
    jobTitle,
    jobDescription,
    requirements,
  } = config;

  const systemPrompt = `You are an expert technical recruiter and problem setter. Generate ${questionsPerType} questions for each of the following types: ${questionTypes.join(", ")}.
   
   Job Title: ${jobTitle}
   Job Description: ${jobDescription}
   Requirements: ${requirements}
   Difficulty: ${difficulty}
   
   Return a JSON array with all questions. Each question must have:
   - title: string (problem title)
   - challenge_doc: string (full problem description with examples)
   - max_pts: number (points for the question, 100 for easy, 150 for medium, 200 for hard)
   - question_type: "mcq" | "dsa" | "backend" | "frontend"
   - difficulty: "${difficulty}"
   
   For MCQ questions, also include:
   - options: string[] (4 options)
   - correctAnswer: number (0-3)
   
   For DSA questions, also include:
   - inputFormat: string
   - outputFormat: string
   - sampleInput: string
   - sampleOutput: string
   - constraints: string[]
   
   For Backend questions, also include:
   - endpoint: string (e.g., /api/users)
   - method: string (GET, POST, PUT, DELETE)
   - requestBody: string (JSON schema if applicable)
   - expectedResponse: string (JSON response format)
   - statusCodes: number[] (e.g., [200, 201, 400, 404])
   
   For Frontend questions, also include:
   - componentRequirements: string[]
   - apiEndpoints: string[]
   - expectedBehavior: string
   
   Generate realistic, job-appropriate questions that test relevant skills.
   Return ONLY the JSON array, no other text.`;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://devforces.com",
          "X-Title": "DevForces",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.1-8b-instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: "Generate the questions now." },
          ],
          temperature: 0.7,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("OpenRouter error:", error);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in response");
    }

    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON array found in response");
    }

    const questions = JSON.parse(jsonMatch[0]);
    return questions as Question[];
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}

export function generateFallbackQuestions(
  config: QuestionConfig,
): GeneratedQuestion[] {
  const {
    questionTypes,
    questionsPerType,
    difficulty,
    jobTitle,
    jobDescription,
    requirements,
  } = config;
  const questions: GeneratedQuestion[] = [];

  const difficultyPoints: Record<string, number> = {
    easy: 100,
    medium: 150,
    hard: 200,
  };

  questionTypes.forEach((type) => {
    for (let i = 0; i < questionsPerType; i++) {
      const baseQuestion: GeneratedQuestion = {
        title: `${type.toUpperCase()} Problem ${i + 1} for ${jobTitle}`,
        challenge_doc: `This is a ${difficulty} ${type} problem based on the following requirements:\n\nRequirements: ${requirements}\n\nJob Description: ${jobDescription}\n\nPlease solve this problem according to the requirements.`,
        max_pts: difficultyPoints[difficulty] || 100,
        question_type: type,
        difficulty: difficulty,
      };
      questions.push(baseQuestion);
    }
  });

  return questions;
}
