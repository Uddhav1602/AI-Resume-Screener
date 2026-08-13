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

    ═══════════════════════════════════════════════════════════════
    KEYWORD CLASSIFICATION — REQUIRED vs PREFERRED
    ═══════════════════════════════════════════════════════════════

    1. Read the job description carefully and extract all technical skills,
       tools, concepts, and qualifications mentioned.
    2. Classify each keyword as either "required" or "preferred":
       - REQUIRED: keywords from sections like "Requirements", "Must have",
         "Qualifications", "What you'll need", "Responsibilities", or any
         skill stated as mandatory/essential. When in doubt, treat as required.
       - PREFERRED: keywords from sections like "Nice to have", "Bonus",
         "Preferred", "Plus", or any skill stated as optional/desirable.
    3. Then check the resume for each keyword:
       - matched_required: required keywords found in the resume
       - missing_required: required keywords NOT found in the resume
       - matched_preferred: preferred keywords found in the resume
       - missing_preferred: preferred keywords NOT found in the resume

    SCORING METHODOLOGY:
    - Compute match_score as a weighted combination:
      80% weight on required keyword match rate + 20% weight on preferred keyword match rate
    - Example: if 8/10 required matched (80%) and 2/5 preferred matched (40%):
      score = 0.8 * 80 + 0.2 * 40 = 72
    - Also factor in resume quality, experience relevance, and section completeness

    ═══════════════════════════════════════════════════════════════
    RECOMMENDATION GROUNDING RULES (CRITICAL)
    ═══════════════════════════════════════════════════════════════

    Before writing ANY recommendation:
    1. READ the resume's Summary, Experience, Projects, and Skills sections
    2. If the resume ALREADY addresses a skill or topic, do NOT recommend adding it
    3. Only recommend changes for GENUINE gaps — things truly absent from the resume
    4. NEVER contradict what the resume already states
    5. If the resume says "full-stack developer" in the summary, do NOT say
       "lacks focus on full-stack development"
    6. Cross-check every recommendation against the actual resume content

    ═══════════════════════════════════════════════════════════════
    REWRITE SUGGESTIONS
    ═══════════════════════════════════════════════════════════════

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

    CRITICAL RULES for rewrite quality:
    - Pull in SPECIFIC details already in the resume: project names, exact
      tech stack used, metrics/numbers if present, team size, timeline context
    - DO NOT produce generic paraphrases that just echo JD keywords back
    - The rewritten version must read like the candidate wrote it, incorporating
      their real experience details, just reframed to highlight relevance
    - Preserve any quantifiable achievements (numbers, percentages, user counts)
    - If the resume mentions "built a dashboard with React and Chart.js", the
      rewrite should keep those specific details, not replace them with generic text

    ═══════════════════════════════════════════════════════════════
    OUTPUT FORMAT
    ═══════════════════════════════════════════════════════════════

    Provide your response in the following EXACT JSON format (no extra text, just JSON):
    {{
        "match_score": <number between 0 and 100>,
        "score_explanation": "<1-2 sentence justification of the score, e.g. 'Strong on required frontend/backend skills; missing preferred DevOps experience'>",
        "matched_required": [<list of REQUIRED keywords found in the resume>],
        "missing_required": [<list of REQUIRED keywords NOT found in the resume>],
        "matched_preferred": [<list of PREFERRED keywords found in the resume>],
        "missing_preferred": [<list of PREFERRED keywords NOT found in the resume>],
        "recommendations": [
            {{
                "section": "<section name>",
                "issue": "<what is genuinely wrong or missing — must be verified against resume>",
                "suggestion": "<specific actionable suggestion>"
            }}
        ],
        "rewrite_suggestions": [
            {{
                "section": "<ONLY one of: Summary, Experience, Projects>",
                "project_name": "<name of project if section is Projects, else empty string>",
                "original": "<EXACT complete text from resume including ALL bullet points>",
                "rewritten": "<complete rewritten version using SPECIFIC details from the resume, reframed for target role>",
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
            max_tokens=5000
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
            "score_explanation": "Analysis could not be completed.",
            "matched_required": [],
            "missing_required": [],
            "matched_preferred": [],
            "missing_preferred": [],
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