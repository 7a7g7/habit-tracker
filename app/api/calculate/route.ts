import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { settings, daily } = body;

    if (!settings || !daily) {
      return NextResponse.json(
        { error: "Missing settings or daily stats" },
        { status: 400 }
      );
    }

    const prompt = `
You are a calorie and fitness calculator. Using the Mifflin-St Jeor BMR formula, calculate the user's estimated calories burned today and compare it to their calories eaten.

USER STATS:
- Sex: ${settings.sex}
- Age: ${settings.age} years
- Height: ${settings.heightInches} inches
- Weight: ${settings.weightLbs} lbs

TODAY'S DATA:
- Calories eaten: ${daily.caloriesEaten}
- Steps today: ${daily.steps}
- Lifted weights today: ${daily.liftedToday ? "yes" : "no"}

INSTRUCTIONS:
1. Calculate BMR using Mifflin-St Jeor:
   - For men: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
   - For women: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
   - Convert: weight_kg = lbs / 2.205, height_cm = inches × 2.54
2. Estimate total calories burned:
   - Start with BMR
   - Add calories from steps: steps × 0.04
   - If they lifted: add 250 calories
3. Compare calories eaten to calories burned:
   - If eaten is more than 100 below burned: calorie_level = "under"
   - If eaten is within 100 calories of burned (either direction): calorie_level = "at"
   - If eaten is more than 100 above burned: calorie_level = "over"
4. Calculate deficit or surplus: calories eaten minus calories burned (negative = deficit)

Respond ONLY with this exact JSON format, no other text:
{
  "calorie_level": "under" | "at" | "over",
  "estimated_deficit_or_surplus": number,
  "insight": "one sentence about today"
}
`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    const clean = responseText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Calculate API error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json(
      { error: "Failed to calculate" },
      { status: 500 }
    );
  }
}