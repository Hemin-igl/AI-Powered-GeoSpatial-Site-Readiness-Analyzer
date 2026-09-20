import math
from typing import List
from ..schemas.accessibility import IsochroneRequest, IsochroneResponse, IsochroneBand
from .spatial import create_isochrone_polygon

class AccessibilityService:
    COLOR_PALETTES = {
        "drive": [
            {"color": "rgba(99, 102, 241, 0.45)", "strokeColor": "#4f46e5"},
            {"color": "rgba(129, 140, 248, 0.28)", "strokeColor": "#6366f1"},
            {"color": "rgba(165, 180, 252, 0.16)", "strokeColor": "#818cf8"},
        ],
        "walk": [
            {"color": "rgba(16, 185, 129, 0.40)", "strokeColor": "#059669"},
            {"color": "rgba(52, 211, 153, 0.25)", "strokeColor": "#10b981"},
            {"color": "rgba(110, 231, 183, 0.15)", "strokeColor": "#34d399"},
        ]
    }

    @classmethod
    def calculate_isochrones(cls, req: IsochroneRequest) -> IsochroneResponse:
        bands: List[IsochroneBand] = []
        mode = req.mode.lower()
        if mode not in cls.COLOR_PALETTES:
            mode = "drive"
        
        palette = cls.COLOR_PALETTES[mode]

        # Calculate population density context derived from latitude/longitude
        base_density = 1400.0 + (abs(math.sin(req.latitude * 5) + math.cos(req.longitude * 5)) * 1800.0)

        for idx, mins in enumerate(req.minutes):
            color_info = palette[idx % len(palette)]
            geom = create_isochrone_polygon(req.latitude, req.longitude, mins, mode=mode)
            
            # Theoretical reach area in sq km
            speed = 36.0 if mode == "drive" else 4.5
            radius_km = speed * (mins / 60.0)
            area_sqkm = round(math.pi * (radius_km ** 2) * 0.85, 1)  # adjusted for road network efficiency
            reachable_pop = int(area_sqkm * base_density * 0.72)

            bands.append(
                IsochroneBand(
                    minutes=mins,
                    reachablePopulation=reachable_pop,
                    areaSqKm=area_sqkm,
                    color=color_info["color"],
                    strokeColor=color_info["strokeColor"],
                    label=f"{mins} min {mode.capitalize()}",
                    geometry=geom
                )
            )

        return IsochroneResponse(
            center=[req.longitude, req.latitude],
            mode=mode,
            bands=bands
        )
