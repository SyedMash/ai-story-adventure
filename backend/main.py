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

session = SQLiteSession("story-db")


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
    choice: str


class Adventure(BaseModel):
    intro_story: str
    option_a: str
    option_b: str


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

    result = await Runner.run(starting_agent=agent, input=request.city, session=session)
    return result.final_output.dict()


@app.post("/continue")
async def continue_story(request: ChoiceRequest):
    choice = request.choice.strip().upper()
    if choice not in ["A", "B"]:
        return {"error": "Invalid choice. Must be 'A' or 'B'."}

    agent = Agent(
        name="Story Agent",
        instructions="Continue the story based on the user's previous choices. "
        "Always follow the same structure:\n"
        "Intro/Story: <story>\n"
        "Option A: <choice A>\n"
        "Option B: <choice B>",
        model=model,
        output_type=Adventure,
    )

    result = await Runner.run(
        starting_agent=agent,
        input=f"Continue the story based on Option {choice}",
        session=session,
    )
    return result.final_output.dict()
