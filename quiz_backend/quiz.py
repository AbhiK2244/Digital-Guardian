from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import re
import traceback
import json
import time
from typing import List, Optional, Dict, Any
import requests
from dotenv import load_dotenv
import uvicorn

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuizRequest(BaseModel):
    category: str
    difficulty_levels: List[str] = ["Beginner", "Intermediate", "Advanced"]

API_KEY = os.getenv("GEMINI_APIKEY")
if not API_KEY:
    print("WARNING: GEMINI_API_KEY environment variable not set!")

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"


def parse_quiz_text_to_json(raw_text: str) -> List[Dict[str, Any]]:
    raw_text = raw_text.strip()

    try:
        if raw_text.startswith("```"):
            raw_text = re.sub(r"^```json\s*|\s*```$", "", raw_text, flags=re.IGNORECASE | re.MULTILINE).strip()

        if raw_text.startswith("[") and raw_text.endswith("]"):
            parsed = json.loads(raw_text)
            if isinstance(parsed, list) and all(isinstance(q, dict) for q in parsed):
                return parsed
    except Exception as e:
        print(f"JSON parsing failed, fallback to regex: {e}")

    questions = []
    question_pattern = r'(?:^|\n)(\d+)\.\s*(.*?)(?=\n\d+\.|$)'
    question_matches = re.findall(question_pattern, raw_text, re.DOTALL | re.MULTILINE)

    for question_num, question_block in question_matches:
        try:
            lines = question_block.strip().split('\n')

            question_lines = []
            option_start = -1
            for i, line in enumerate(lines):
                if re.match(r'^\s*[A-D]\)\s*', line):
                    option_start = i
                    break
                question_lines.append(line.strip())

            question_text = ' '.join(question_lines).strip()
            if option_start == -1:
                continue

            options = {}
            answer = None
            for line in lines[option_start:]:
                line = line.strip()
                option_match = re.match(r'^([A-D])\)\s*(.*)', line)
                if option_match:
                    opt_letter, opt_text = option_match.groups()
                    options[opt_letter] = opt_text.strip()
                answer_match = re.search(r'Answer:\s*([A-D])', line, re.IGNORECASE)
                if answer_match:
                    answer = answer_match.group(1)

            if question_text and len(options) >= 2:
                questions.append({
                    "question": question_text,
                    "options": options,
                    "answer": answer
                })

        except Exception as e:
            print(f"Parsing error for question {question_num}: {e}")
            continue

    return questions



def generate_quiz_by_category_and_level(category: str, difficulty: str) -> List[Dict[str, Any]]:
    if not API_KEY:
        raise HTTPException(
            status_code=500,
            detail="API key not configured. Please set GEMINI_API_KEY environment variable."
        )
    prompt = f"""
            Generate exactly 3 multiple choice quiz questions about digital safety and responsible online behavior 
            under the theme of Media and Information Literacy (MIL), for the topic "{category}" at {difficulty} level.

            Requirements:
            - Frame questions around **real-life digital scenarios** (e.g., online scams, phishing emails, fake news, password safety, data privacy, cyberbullying, social media awareness).
            - Avoid technical jargon (firewalls, encryption, protocols).
            - Make it understandable to the general public, including students, parents, and casual internet users.
            - Each question must raise awareness about safe digital practices or dangers of digital crimes.
            - Provide 4 options labeled "A", "B", "C", "D", with **only one correct answer**.
            - Ensure the correct answer helps the user learn about digital safety.

            Output Format:
            Return ONLY valid JSON in this format (no extra text, no markdown):

            [
            {{
                "question": "You receive an email saying you won a lottery you never joined. What should you do?",
                "options": {{"A": "Click the link immediately", "B": "Reply with your bank details", "C": "Delete or report the email", "D": "Forward it to friends"}},
                "answer": "C"
            }},
            {{
                "question": "When creating a password for your social media account, which option is safest?",
                "options": {{"A": "123456", "B": "Your name and birthdate", "C": "A mix of letters, numbers, and symbols", "D": "Password"}},
                "answer": "C"
            }},
            {{
                "question": "If you see a news article on social media that seems unbelievable, what should you do first?",
                "options": {{"A": "Share it quickly", "B": "Check if it's from a reliable source", "C": "Trust it because a friend posted it", "D": "Ignore all news"}},
                "answer": "B"
            }}
            ]
        Generate the questions now:"""

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.7,
            "topP": 0.8,
            "topK": 40,
            "maxOutputTokens": 2048,
        }
    }

    headers = {
        "Content-Type": "application/json"
    }

    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = requests.post(
                f"{GEMINI_API_URL}?key={API_KEY}",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if 'candidates' in data and len(data['candidates']) > 0:
                    candidate = data['candidates'][0]
                    if 'content' in candidate and 'parts' in candidate['content']:
                        response_text = ""
                        for part in candidate['content']['parts']:
                            if 'text' in part:
                                response_text += part['text']
                        
                        if response_text.strip():
                            parsed_questions = parse_quiz_text_to_json(response_text.strip())
                            
                            if parsed_questions and len(parsed_questions) > 0:
                                print(f"Generated {len(parsed_questions)} questions for {category} - {difficulty}")
                                return parsed_questions
                            else:
                                raise Exception("No valid questions could be parsed from response")
                        else:
                            raise Exception("Empty response from API")
                    else:
                        raise Exception("Invalid response structure")
                else:
                    raise Exception("No candidates in API response")
            else:
                try:
                    error_data = response.json()
                    error_msg = error_data.get('error', {}).get('message', f"HTTP {response.status_code}")
                except:
                    error_msg = f"HTTP {response.status_code}: {response.text[:200]}"
                raise Exception(f"API Error: {error_msg}")
                
        except requests.exceptions.RequestException as e:
            print(f"Request error on attempt {attempt + 1}: {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
            else:
                raise Exception(f"Network error after {max_retries} attempts: {str(e)}")
        except Exception as e:
            print(f"Attempt {attempt + 1} failed for {category} {difficulty}: {e}")
            if attempt < max_retries - 1:
                time.sleep(2 ** attempt)
            else:
                raise HTTPException(
                    status_code=500,
                    detail=f"Failed to generate quiz after {max_retries} attempts: {str(e)}"
                )


@app.post("/generate_quiz")
async def generate_quiz(request: QuizRequest):
    if not request.category:
        raise HTTPException(status_code=400, detail="Category is required")
    
    if not request.difficulty_levels:
        raise HTTPException(status_code=400, detail="At least one difficulty level is required")
    
    category = request.category.strip()
    difficulty_levels = [level.strip() for level in request.difficulty_levels]
    result = {}
    total_questions = 0

    try:
        for level in difficulty_levels:
            print(f"Generating questions for {category} - {level}")
            quiz_questions = generate_quiz_by_category_and_level(category, level)
            result[level] = quiz_questions
            total_questions += len(quiz_questions)

        quiz_data = {
            "category": category,
            "quiz": result,
            "total_questions": total_questions,
            "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "status": "success"
        }

        try:
            safe_category = re.sub(r'[^\w\-_\.]', '_', category.lower())
            filename = f"quiz_{safe_category}_{int(time.time())}.json"
            print(quiz_data)
            with open(filename, "w", encoding="utf-8") as f:
                json.dump(quiz_data, f, indent=2, ensure_ascii=False)
            print(f"Quiz saved to {filename}")
        except Exception as e:
            print(f"Warning: Could not save quiz to file: {e}")
 
        return quiz_data

    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error generating quiz: {e}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=500, 
            detail=f"Internal server error: {str(e)}"
        )


@app.get("/")
async def root():
    return {
        "message": "Digital Guardian Quiz API",
        "version": "1.0.0",
        "endpoints": {
            "generate_quiz": "POST /generate_quiz - Generate quiz questions",
        },
        "status": "active"
    }

if __name__ == "__main__":
    print("Starting Digital Guardian Quiz API...")
    uvicorn.run(
        app,  
        host="127.0.0.1",
        port=8000,
        log_level="info"
    )
