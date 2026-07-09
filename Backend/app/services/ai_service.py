from groq import Groq
import json
import re
from app.config import get_settings

settings = get_settings()
client = Groq(api_key=settings.groq_api_key)

def analyze_resume(resume_text: str, job_description: str) -> dict:

    prompt = f"""
    You are an expert resume consultant who helps candidates tailor their resumes
    for specific job roles.

    Analyze the following resume against the job description below.

    RESUME:
    {resume_text}

    JOB DESCRIPTION:
    {job_description}

    IMPORTANT INSTRUCTIONS for rewrite_suggestions:

    1. ONLY rewrite these sections: Summary, Experience, Projects
    2. DO NOT rewrite: Education, Skills, Achievements, Certifications, Activities

    3. For PROJECTS section (most important):
       - Look at each project and its bullet points carefully
       - Rewrite the ENTIRE project entry including ALL bullet points
       - Rewrite bullets to highlight aspects relevant to the job role
       - Example: if applying for FRONTEND role, emphasize React components,
         UI/UX decisions, responsive design, TypeScript, TailwindCSS etc.
         and downplay backend/database work
       - Do this for EVERY project in the resume
       - Keep the rewrite realistic based on actual technologies used

    4. For EXPERIENCE section:
       - Reframe job responsibilities to highlight skills matching the target role

    5. For SUMMARY section:
       - Completely reposition the candidate as ideal for this specific role

    6. The "original" field must contain the EXACT text from the resume
       including all bullet points for that section

    7. The "rewritten" field must contain the complete rewritten version
       with ALL bullet points rewritten

    Provide your response in the following EXACT JSON format (no extra text, just JSON):
    {{
        "match_score": <number between 0 and 100>,
        "matched_keywords": [<list of keywords found in both resume and JD>],
        "missing_keywords": [<list of important keywords in JD but missing from resume>],
        "recommendations": [
            {{
                "section": "<section name>",
                "issue": "<what is wrong or missing>",
                "suggestion": "<specific actionable suggestion>"
            }}
        ],
        "rewrite_suggestions": [
            {{
                "section": "<ONLY one of: Summary, Experience, Projects>",
                "project_name": "<name of project if section is Projects, else empty string>",
                "original": "<EXACT complete text from resume including ALL bullet points>",
                "rewritten": "<complete rewritten version with ALL bullet points rewritten for target role>",
                "reason": "<one sentence explaining how this reframing targets the specific job role>"
            }}
        ],
        "overall_summary": "<2-3 sentence overall assessment>"
    }}

    Rules:
    - For Projects: create one rewrite_suggestion entry PER PROJECT
    - Each entry must include ALL bullet points rewritten
    - Rewrites must be authentic and based on real technologies in the resume
    - Never add technologies that are not in the original project
    - Max 5 rewrite suggestions total
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=4000
        )

        response_text = response.choices[0].message.content.strip()
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