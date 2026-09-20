import math
import hashlib
from typing import List
from ..schemas.competition import CompetitionAnalyzeRequest, CompetitionAnalyzeResponse, CompetitorItem
from .spatial import haversine_distance

class CompetitionService:
    @staticmethod
    def calculate_decay(distance_km: float, decay_type: str = "exponential", k: float = 0.5) -> float:
        """
        Calculate distance decay factor for competitor influence.
        """
        if distance_km <= 0.0:
            return 1.0
        
        if decay_type == "exponential":
            return math.exp(-k * distance_km)
        elif decay_type == "power":
            return 1.0 / (1.0 + (distance_km ** k))
        elif decay_type == "linear":
            return max(0.0, 1.0 - (distance_km / 10.0))
        return math.exp(-k * distance_km)

    @classmethod
    def analyze_competition(cls, req: CompetitionAnalyzeRequest) -> CompetitionAnalyzeResponse:
        lat, lon = req.latitude, req.longitude
        radius = req.radius_km
        k = req.decay.k if req.decay else 0.5
        decay_type = req.decay.type if req.decay else "exponential"

        # Generate continuous deterministic competitor locations in the neighborhood
        seed = int(hashlib.sha256(f"{round(lat, 3)}_{round(lon, 3)}_comp".encode()).hexdigest()[:8], 16)
        num_competitors = 4 + (seed % 9)

        competitors: List[CompetitorItem] = []
        total_pressure = 0.0

        categories = [
            "Supermarket / Grocery",
            "Convenience Store",
            "Department Store",
            "Specialty Retail",
            "Commercial Hub"
        ]

        for i in range(num_competitors):
            angle = (i * (360.0 / num_competitors) + (seed % 45)) % 360.0
            dist_fraction = 0.15 + (0.8 * ((i * 37 + seed) % 100) / 100.0)
            c_dist_km = round(dist_fraction * radius, 2)

            # Convert polar displacement to coordinates
            d_lat = (c_dist_km / 111.0) * math.cos(math.radians(angle))
            d_lon = (c_dist_km / (111.0 * math.cos(math.radians(lat)))) * math.sin(math.radians(angle))
            c_lat = round(lat + d_lat, 6)
            c_lon = round(lon + d_lon, 6)

            decay_wt = round(cls.calculate_decay(c_dist_km, decay_type=decay_type, k=k), 3)
            total_pressure += decay_wt

            competitors.append(
                CompetitorItem(
                    id=f"comp_{i+1:03d}",
                    name=f"Commercial Competitor {chr(65 + i)}",
                    category=categories[i % len(categories)],
                    distance_km=c_dist_km,
                    decay_weight=decay_wt,
                    coordinates=[c_lon, c_lat]
                )
            )

        # Sort competitors by distance
        competitors.sort(key=lambda c: c.distance_km)

        # Normalize pressure to 0-100 score: lower pressure = higher score
        # Base scale: pressure of 0 -> 100, pressure of 6 -> ~30
        normalized_score = max(10.0, min(100.0, round(100.0 - (total_pressure * 11.5), 1)))

        return CompetitionAnalyzeResponse(
            center=[lon, lat],
            radius_km=radius,
            competitor_count=len(competitors),
            total_pressure=round(total_pressure, 2),
            normalized_score=normalized_score,
            competitors=competitors
        )
