from groq import Groq
import json
import re
from app.config import get_settings

settings = get_settings()
client = Groq(api_key=settings.groq_api_key)

def analyze_resume(resume_text: str, job_description: str) -> dict:
    """Send resume + job description to Groq and get analysis"""

    prompt = f"""
    You are an expert HR consultant and resume analyzer.

    Analyze the following resume against the job description and provide a detailed analysis.

    RESUME:
    {resume_text}

    JOB DESCRIPTION:
    {job_description}

    Provide your response in the following EXACT JSON format (no extra text, just JSON):
    {{
        "match_score": <number between 0 and 100>,
        "matched_keywords": [<list of keywords/skills found in both resume and JD>],
        "missing_keywords": [<list of important keywords/skills in JD but missing from resume>],
        "recommendations": [
            {{
                "section": "<resume section name e.g. Skills, Experience, Summary>",
                "issue": "<what is wrong or missing>",
                "suggestion": "<specific actionable suggestion to improve>"
            }}
        ],
        "rewrite_suggestions": [
            {{
                "section": "<section name e.g. Skills, Summary, Experience>",
                "original": "<copy the actual text from resume for this section, or 'Not found' if section missing>",
                "rewritten": "<provide improved version of this section text tailored to the job description>",
                "reason": "<explain in one sentence why this change improves the resume>"
            }}
        ],
        "overall_summary": "<2-3 sentence overall assessment and advice>"
    }}

    Important rules:
    - rewrite_suggestions must have 3-5 items covering the most important sections
    - original must be actual text extracted from the resume
    - rewritten must be specific, professional and tailored to the job description
    - Keep rewritten content realistic and achievable
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=3000
        )

        response_text = response.choices[0].message.content.strip()

        # Remove markdown code blocks if present
        response_text = re.sub(r'^```json\s*', '', response_text)
        response_text = re.sub(r'^```\s*', '', response_text)
        response_text = re.sub(r'\s*```$', '', response_text)

        analysis = json.loads(response_text)
        return analysis

    except json.JSONDecodeError:
        return {
            "match_score": 0,
            "matched_keywords": [],
            "missing_keywords": [],
            "recommendations": [
                {
                    "section": "General",
                    "issue": "Could not parse AI response",
                    "suggestion": "Please try again"
                }
            ],
            "rewrite_suggestions": [],
            "overall_summary": "Analysis could not be completed. Please try again."
        }
    except Exception as e:
        raise Exception(f"Groq API error: {str(e)}")