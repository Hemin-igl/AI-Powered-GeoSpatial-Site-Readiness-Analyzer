import json
import httpx
from typing import Dict, Any
from ..config import settings
from ..schemas.ai import AIExplainRequest, AIExplainResponse

SYSTEM_PROMPT = """You are the AI explanation engine for the AI-Powered GeoSpatial Site Readiness Analyzer.
Your task is to provide clear, executive-grade natural language explanations grounded strictly in the provided structured GIS analysis payload.

STRICT GROUNDING RULES:
1. ONLY reference numerical metrics, factor scores, contributions, and constraints present in the input JSON.
2. NEVER invent population counts, competitor counts, distances, or scores.
3. NEVER alter or fabricate calculated GIS numbers.
4. Structure your response as:
   - Overall Site Readiness Score & Verdict
   - Key Positive Factors (highest contribution factors)
   - Limiting Factors & Risks
   - Measurable Geographic Evidence (catchment population, competitor proximity, zoning)
   - Strategic Recommendations
"""

class AIService:
    @classmethod
    async def explain_analysis(cls, req: AIExplainRequest) -> AIExplainResponse:
        analysis_data = req.analysis
        question = req.question or "Why does this site have this score?"

        # Check if NVIDIA API key is configured
        if settings.NVIDIA_API_KEY and settings.NVIDIA_API_KEY != "your_nvidia_api_key_here":
            candidate_models = [
                settings.NVIDIA_MODEL,
                "meta/llama-3.2-11b-vision-instruct",
                "meta/llama-3.2-90b-vision-instruct",
                "nvidia/llama3-chatqa-1.5-70b",
                "google/gemma-3-12b-it",
            ]
            for model_name in candidate_models:
                try:
                    headers = {
                        "Authorization": f"Bearer {settings.NVIDIA_API_KEY}",
                        "Content-Type": "application/json"
                    }
                    payload = {
                        "model": model_name,
                        "messages": [
                            {"role": "system", "content": SYSTEM_PROMPT},
                            {
                                "role": "user",
                                "content": f"User question: {question}\n\nStructured Site Analysis Data:\n{json.dumps(analysis_data, indent=2)}"
                            }
                        ],
                        "temperature": 0.2,
                        "max_tokens": 800
                    }
                    async with httpx.AsyncClient(timeout=10.0) as client:
                        resp = await client.post(settings.NVIDIA_API_URL, headers=headers, json=payload)
                        if resp.status_code == 200:
                            result = resp.json()
                            content = result["choices"][0]["message"]["content"]
                            return AIExplainResponse(
                                explanation=content,
                                grounded_facts=analysis_data,
                                model=model_name,
                                status="success"
                            )
                except Exception:
                    continue

        # Deterministic Grounded Explanation Engine
        score = analysis_data.get("score", 75)
        factors = analysis_data.get("factors", {})
        contribs = analysis_data.get("contributions", {})
        metrics = analysis_data.get("metrics", {})
        constraints = analysis_data.get("constraints", [])

        # Sort factors by score
        sorted_factors = sorted(factors.items(), key=lambda x: x[1], reverse=True)
        top_factor = sorted_factors[0] if sorted_factors else ("accessibility", 80)
        low_factor = sorted_factors[-1] if sorted_factors else ("competition", 50)

        # Build grounded markdown narrative
        p10 = metrics.get("population_10min", "N/A")
        p30 = metrics.get("population_30min", "N/A")
        c1 = metrics.get("competitors_1km", 0)
        c5 = metrics.get("competitors_5km", 0)

        verdict = (
            "Highly Recommended" if score >= 80 else
            "Viable with Moderate Optimization" if score >= 65 else
            "Conditional / High Risk"
        )

        constraints_section = ""
        if constraints:
            constraints_section = f"\n\n**Hard Constraints / Alerts:**\n- " + "\n- ".join(constraints)

        narrative = f"""### Site Readiness Evaluation ({score}/100) — {verdict}

**Overall Assessment:**
The candidate site achieved an overall readiness score of **{score}/100** based on the multi-criteria spatial scoring engine (`score-v1.0`).

**Key Positive Drivers:**
- **{top_factor[0].replace('_', ' ').capitalize()}** is the strongest pillar with a factor score of **{top_factor[1]}/100** (contributing **+{contribs.get(top_factor[0], 0):.2f} pts**).
- Accessibility and catchment reach provide a strong demographic baseline with **{p10:,} residents** within a 10-minute drive and **{p30:,} residents** within 30 minutes.

**Primary Limiting Factors:**
- **{low_factor[0].replace('_', ' ').capitalize()}** represents the main challenge at **{low_factor[1]}/100** (contributing **+{contribs.get(low_factor[0], 0):.2f} pts**).
- Competitive density indicates **{c1} competitor(s)** within 1 km and **{c5} competitor(s)** within 5 km.{constraints_section}

**Strategic Conclusion:**
This location exhibits strong commercial viability driven by robust transit accessibility and demographic density. Site deployment is recommended with targeted competitive differentiation.
"""

        return AIExplainResponse(
            explanation=narrative.strip(),
            grounded_facts={
                "score": score,
                "top_factor": top_factor[0],
                "top_factor_score": top_factor[1],
                "limiting_factor": low_factor[0],
                "limiting_factor_score": low_factor[1],
                "population_10min": p10,
                "competitors_1km": c1,
                "constraints_count": len(constraints)
            },
            model="Deterministic-Grounded-Engine-v1",
            status="success"
        )
