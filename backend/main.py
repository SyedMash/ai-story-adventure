from fastapi import FastAPI
from pydantic import BaseModel
from agents import Agent, Runner, OpenAIChatCompletionsModel, SQLiteSession
import os
from openai import AsyncOpenAI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,  # Set to True if your frontend needs to send credentials (e.g., cookies, auth headers)
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, etc.)
    allow_headers=["*"],  # Allows all headers
)

chat_history = []


class StoryRequest(BaseModel):
    country: str
    city: str
    companion: str
    budget: str
    duration: str
    relationShipDynamics: str | None = None
    adventuresStyle: str | None = None
    tone: str | None = None
    conflict: str | None = None


class ChoiceRequest(BaseModel):
    previous_history: list
    choice: str


class Adventure(BaseModel):
    intro_story: str
    option_a: str
    option_b: str
    is_end: bool


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
external_client = AsyncOpenAI(
    api_key=GEMINI_API_KEY,
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)
model = OpenAIChatCompletionsModel(
    model="gemini-2.0-flash", openai_client=external_client
)


def dynamic_instructions(
    country: str,
    city: str,
    companion: str,
    budget: str,
    duration,
    relationShipDynamics: str | None = None,
    adventuresStyle: str | None = None,
    tone: str | None = None,
    conflict: str | None = None,
) -> str:
    instr = f"""
You are a travel story creator agent. The user is going on a trip.

Trip details:
- Country: {country}
- City: {city}
- Companion: {companion}
- Budget: {budget}
- Duration: {duration} days
"""
    if relationShipDynamics:
        instr += f"- Relationship dynamics: {relationShipDynamics}\n"
    if adventuresStyle:
        instr += f"- Adventure style: {adventuresStyle}\n"
    if tone:
        instr += f"- Story tone: {tone}\n"
    if conflict:
        instr += f"- Conflict/twist: {conflict}\n"

    instr += """
Instructions:
1. Always start with a short immersive intro about the trip, based on the details above.
2. After the intro, give exactly TWO choices for what happens next.
   Format strictly as:
   Intro/Story: <your story here>
   Option A: <choice A>
   Option B: <choice B>
3. If the user makes a choice, continue the story based only on that option.
4. End each continuation with exactly TWO new options (A and B).
"""

    return instr.strip()


@app.post("/start")
async def start_story(request: StoryRequest):
    instructions = dynamic_instructions(
        country=request.country,
        city=request.city,
        companion=request.companion,
        budget=request.budget,
        duration=request.duration,
        adventuresStyle=request.adventuresStyle,
        conflict=request.conflict,
        relationShipDynamics=request.relationShipDynamics,
        tone=request.tone,
    )

    agent = Agent(
        name="Story Agent",
        instructions=instructions,
        model=model,
        output_type=Adventure,
    )

    result = await Runner.run(starting_agent=agent, input=request.city)
    chat_history.append({"role": "user", "content": request})
    chat_history.append(chat_history)
    chat_history.append({"role": "assistant", "content": result.final_output.dict()})
    print(chat_history)
    return result.final_output.dict()


@app.post("/continue")
async def continue_story(request: ChoiceRequest):
    choice = request.choice.strip().upper()
    if choice not in ["A", "B"]:
        return {"error": "Invalid choice. Must be 'A' or 'B'."}

    agent = Agent(
        name="Story Agent",
        instructions=(
            "You are a travel story creator agent. "
            "Continue the interactive travel adventure based on the user's previous choices.\n\n"
            "⚡ Rules:\n"
            "- Always provide a rich and immersive continuation of the story with vivid detail.\n"
            "- The story should unfold gradually, across multiple steps, not end after just one or two choices.\n"
            "- Do NOT set 'Is End: true' until the story has gone through at least 5–6 major decisions, unless the user explicitly asks to end it.\n"
            "- If the story should continue, always provide exactly TWO new options labeled as:\n"
            "   Option A: <choice A>\n"
            "   Option B: <choice B>\n"
            "- If the story is not finished, set 'Is End: false'.\n"
            "- Only when the story reaches a satisfying, natural conclusion should you set 'Is End: true' and provide no new options.\n\n"
            "Output format:\n"
            "Intro/Story: <your story>\n"
            "Option A: <choice A or null>\n"
            "Option B: <choice B or null>\n"
            "Is End: <true/false>\n"
        ),
        model=model,
        output_type=Adventure,
    )

    result = await Runner.run(
        starting_agent=agent,
        input=f"{request.previous_history}\nContinue the story based on Option {choice}",
    )
    chat_history.append({"role": "assistant", "content": result.final_output.dict()})
    return result.final_output.dict()
