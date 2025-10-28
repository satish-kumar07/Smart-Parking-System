from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict
import requests
import google.generativeai as genai
import os

# Initialize FastAPI app
app = FastAPI(title="Smart Parking Chatbot API")

# Configure CORS (update in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Google Gemini
genai.configure(api_key=os.getenv("API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

# Your Firebase Realtime Database URL
FIREBASE_URL = "https://smart-parking-1289-default-rtdb.firebaseio.com/slots.json"

# Chat message schema
class ChatMessage(BaseModel):
    message: str


# Root endpoint
@app.get("/")
async def root():
    return {"message": "🚗 Smart Parking Chatbot API is running!"}


@app.options("/api/chat/")
async def handle_options():
    return JSONResponse(content={}, status_code=200)


# 🧠 Chatbot endpoint
@app.post("/api/chat")
async def chat(message: ChatMessage) -> Dict[str, str]:
    """
    Smart Parking AI chatbot.
    Responds to user questions using Gemini + Firebase live data.
    """

    # Step 1: Fetch live parking data from Firebase
    try:
        firebase_data = requests.get(FIREBASE_URL).json()
    except Exception as e:
        firebase_data = {}
        print("⚠️ Could not fetch Firebase data:", e)

    # Step 2: Prepare AI prompt
    prompt = f"""
    You are an intelligent Smart Parking assistant for an IoT-based parking system in India.
    You help users find available parking spots, EV charging stations, and directions.

    Current live parking slot data (from Firebase):
    {firebase_data}

    The user might ask about:
    - Parking for 2/3/4 wheelers
    - Where to go or how to park
    - Pricing or smart allocation
    - Or general info about the system

    If data is not available, politely say that live data is temporarily unavailable.
    Always provide clear, friendly, and step-by-step guidance.

    User question: {message.message}

    Keep the reply under 60 words. Be helpful and precise.
    Provide the best possible answer based on the live data above.
    Respond in a conversational manner.
    Don't mention Firebase or technical details and avoid disclaimers.
    don't say distance and iot output data.
    """

    try:
        # Step 3: Generate response using Gemini
        response = model.generate_content(prompt)
        return {"response": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chatbot error: {str(e)}")
