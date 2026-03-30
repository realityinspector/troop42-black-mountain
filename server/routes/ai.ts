import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "anthropic/claude-sonnet-4-20250514";

interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

async function callOpenRouter(messages: OpenRouterMessage[], maxTokens = 2000): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY environment variable is not set");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://troop42blackmountain.org",
      "X-Title": "Troop 42 Black Mountain CMS",
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("OpenRouter API error:", response.status, errorBody);
    throw new Error(`OpenRouter API returned ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content in OpenRouter response");
  }

  return content;
}

const SYSTEM_PROMPTS: Record<string, string> = {
  blog_post: `You are a content writer for Troop 42 Black Mountain, a Boy Scout troop based in Black Mountain, North Carolina. Write engaging, family-friendly blog posts about scout activities, outdoor adventures, leadership development, and community service. Use a warm, enthusiastic tone that appeals to both scouts and their families. Reference the beautiful Blue Ridge Mountains setting when appropriate. Format the output as HTML suitable for a rich text editor.`,

  event_description: `You are a content writer for Troop 42 Black Mountain, a Boy Scout troop in Black Mountain, NC. Write clear, informative event descriptions that include what participants should expect, what to bring, and any important details. Keep the tone welcoming and organized. The troop meets at the Black Mountain Presbyterian Church. Format the output as HTML suitable for a rich text editor.`,

  announcement: `You are writing announcements for Troop 42 Black Mountain, a Boy Scout troop in Black Mountain, NC. Write concise, clear announcements that convey important information to scout families. Use a direct but friendly tone. Keep it brief and actionable.`,

  packing_list: `You are creating gear and packing lists for Troop 42 Black Mountain, a Boy Scout troop in Black Mountain, NC near the Blue Ridge Mountains. Create well-organized, practical packing lists appropriate for the Western North Carolina climate. Consider seasonal weather, altitude, and typical scout camping conditions. Format the output as HTML with organized sections and bullet points or checkboxes.`,
};

/**
 * POST /api/ai/generate
 * Generate content using AI. Auth required.
 */
router.post("/generate", requireAuth, async (req: Request, res: Response) => {
  try {
    const { prompt, type } = req.body;

    if (!prompt) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    const validTypes = ["blog_post", "event_description", "announcement", "packing_list"];
    const contentType = validTypes.includes(type) ? type : "blog_post";
    const systemPrompt = SYSTEM_PROMPTS[contentType];

    const content = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ]);

    res.json({ content, type: contentType });
  } catch (error) {
    console.error("AI generate error:", error);
    const message = error instanceof Error ? error.message : "AI generation failed";

    if (message.includes("OPENROUTER_API_KEY")) {
      res.status(503).json({ error: "AI service is not configured" });
      return;
    }

    res.status(500).json({ error: message });
  }
});

/**
 * POST /api/ai/suggest-title
 * Generate title suggestions based on content or a topic.
 */
router.post("/suggest-title", requireAuth, async (req: Request, res: Response) => {
  try {
    const { content, topic, type } = req.body;

    if (!content && !topic) {
      res.status(400).json({ error: "Content or topic is required" });
      return;
    }

    const userMessage = content
      ? `Based on the following content, suggest 5 compelling titles for a scout troop ${type || "blog post"}. Return only the titles, one per line, numbered 1-5.\n\nContent:\n${content.slice(0, 2000)}`
      : `Suggest 5 compelling titles for a scout troop ${type || "blog post"} about: ${topic}. Return only the titles, one per line, numbered 1-5.`;

    const result = await callOpenRouter(
      [
        {
          role: "system",
          content:
            "You are a helpful assistant for Troop 42 Black Mountain, a Boy Scout troop in Black Mountain, NC. Generate catchy, appropriate titles for scout-related content.",
        },
        { role: "user", content: userMessage },
      ],
      500
    );

    // Parse numbered titles from the response
    const titles = result
      .split("\n")
      .map((line) => line.replace(/^\d+[\.\)\-]\s*/, "").trim())
      .filter((line) => line.length > 0);

    res.json({ titles });
  } catch (error) {
    console.error("AI suggest-title error:", error);
    const message = error instanceof Error ? error.message : "Title suggestion failed";

    if (message.includes("OPENROUTER_API_KEY")) {
      res.status(503).json({ error: "AI service is not configured" });
      return;
    }

    res.status(500).json({ error: message });
  }
});

/**
 * POST /api/ai/improve
 * Improve existing content using AI.
 */
router.post("/improve", requireAuth, async (req: Request, res: Response) => {
  try {
    const { content, instructions } = req.body;

    if (!content) {
      res.status(400).json({ error: "Content is required" });
      return;
    }

    const userMessage = instructions
      ? `Improve the following content according to these instructions: "${instructions}"\n\nContent:\n${content}`
      : `Improve the following content. Make it more engaging, well-structured, and polished while preserving the original meaning and scout-appropriate tone. If the content is HTML, maintain the HTML formatting.\n\nContent:\n${content}`;

    const improved = await callOpenRouter(
      [
        {
          role: "system",
          content:
            "You are an editor for Troop 42 Black Mountain, a Boy Scout troop in Black Mountain, NC. Improve content while keeping it family-friendly, engaging, and appropriate for a scout audience. Preserve the original format (HTML if provided).",
        },
        { role: "user", content: userMessage },
      ],
      3000
    );

    res.json({ content: improved });
  } catch (error) {
    console.error("AI improve error:", error);
    const message = error instanceof Error ? error.message : "Content improvement failed";

    if (message.includes("OPENROUTER_API_KEY")) {
      res.status(503).json({ error: "AI service is not configured" });
      return;
    }

    res.status(500).json({ error: message });
  }
});

export default router;
