import uuid
from datetime import datetime
from typing import Dict, Any, List
from ..schemas.reports import ReportGenerateRequest, ReportGenerateResponse

class ReportsService:
    @classmethod
    def generate_report(cls, req: ReportGenerateRequest) -> ReportGenerateResponse:
        analysis = req.site_analysis
        score = analysis.get("score", 75.0)
        factors = analysis.get("factors", {})
        metrics = analysis.get("metrics", {})
        constraints = analysis.get("constraints", [])
        site_name = req.site_name or "Candidate Site Analysis"
        biz_type = req.business_type or "retail"

        created_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
        report_id = f"REP-{uuid.uuid4().hex[:8].upper()}"

        verdict = "APPROVED" if score >= 80 else "CONDITIONALLY APPROVED" if score >= 65 else "REQUIRES REVISION"

        recommendations: List[str] = [
            f"Prioritize primary arterial frontage to maximize reachable catchment ({metrics.get('population_10min', 'N/A')} residents in 10m isochrone).",
            f"Implement differentiation strategy against {metrics.get('competitors_3km', 0)} competitors identified within 3km.",
            "Conduct micro-topography inspection to verify storm drainage baseline.",
            "Verify municipal permitting for signage and delivery parking access."
        ]

        if constraints:
            for c in constraints:
                recommendations.insert(0, f"CRITICAL ACTION: Address constraint: {c}")

        markdown = f"""# Site Readiness Evaluation Report
**Report ID:** {report_id}  
**Date:** {created_at}  
**Target Category:** {biz_type.capitalize()}  
**Overall Readiness Score:** {score}/100 — **{verdict}**

---

## 1. Executive Summary
The site was evaluated using multi-criteria geospatial analytics across population density, multimodal accessibility, competitive pressure, land use compatibility, and environmental risk.

## 2. Factor Breakdown
- **Population Catchment:** {factors.get('population', 'N/A')}/100
- **Accessibility & Transit:** {factors.get('accessibility', 'N/A')}/100
- **Competition Score:** {factors.get('competition', 'N/A')}/100
- **Land Use Zoning:** {factors.get('land_use', 'N/A')}/100
- **Environmental Risk:** {factors.get('risk', 'N/A')}/100

## 3. Key Catchment Metrics
- **10-min Isochrone Population:** {metrics.get('population_10min', 'N/A')}
- **20-min Isochrone Population:** {metrics.get('population_20min', 'N/A')}
- **30-min Isochrone Population:** {metrics.get('population_30min', 'N/A')}
- **Nearby Competitors (1km / 3km / 5km):** {metrics.get('competitors_1km', 0)} / {metrics.get('competitors_3km', 0)} / {metrics.get('competitors_5km', 0)}

## 4. Strategic Recommendations
""" + "\n".join([f"- {r}" for r in recommendations])

        return ReportGenerateResponse(
            report_id=report_id,
            title=site_name,
            created_at=created_at,
            score=score,
            status=verdict,
            summary_markdown=markdown,
            factors=factors,
            metrics=metrics,
            recommendations=recommendations
        )
