import math
from typing import List
from ..schemas.opportunities import OpportunitySearchRequest, OpportunitySearchResponse, OpportunityZone
from .spatial import create_geodesic_buffer_polygon

class OpportunityService:
    @classmethod
    def search_opportunities(cls, req: OpportunitySearchRequest) -> OpportunitySearchResponse:
        center_lon, center_lat = req.center if req.center else [72.8311, 21.1702]
        min_score = req.minimum_score
        filters = req.filters
        biz_type = req.business_type

        # Generate candidate opportunity clusters around search area
        candidate_offsets = [
            (0.015, 0.012, "North-East Corridor", 88.5, 92, 86, 74, 95, 84),
            (-0.018, 0.015, "West Commercial Center", 84.0, 88, 89, 68, 90, 80),
            (0.022, -0.016, "South Metro Interchange", 81.5, 85, 94, 62, 85, 78),
            (-0.012, -0.022, "South-West Logistics Belt", 79.0, 78, 82, 85, 88, 82),
            (0.030, 0.005, "East Tech Cluster", 76.5, 82, 80, 70, 82, 75),
            (-0.028, -0.008, "Expressway Transit Node", 73.0, 74, 88, 65, 78, 72),
        ]

        zones: List[OpportunityZone] = []

        for idx, (d_lat, d_lon, name, base_score, pop, acc, comp, lu, risk) in enumerate(candidate_offsets):
            # Check filter alignments
            if min_score and base_score < min_score:
                continue

            z_lat = round(center_lat + d_lat, 6)
            z_lon = round(center_lon + d_lon, 6)
            geom = create_geodesic_buffer_polygon(z_lat, z_lon, radius_km=0.65, num_points=16)

            factors = {
                "population": pop,
                "accessibility": acc,
                "competition": comp,
                "land_use": lu,
                "risk": risk
            }

            zones.append(
                OpportunityZone(
                    id=f"zone_{idx+1:03d}",
                    score=base_score,
                    center=[z_lon, z_lat],
                    geometry=geom,
                    factors=factors,
                    metrics={
                        "name": name,
                        "business_type": biz_type,
                        "catchment_population": int(pop * 1850),
                        "transit_connectivity": "High" if acc > 80 else "Moderate"
                    }
                )
            )

        # Sort zones by descending readiness score
        zones.sort(key=lambda z: z.score, reverse=True)

        return OpportunitySearchResponse(zones=zones)
