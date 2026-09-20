from typing import List
from ..schemas.layers import LayersResponse, LayerItem

class LayerService:
    @staticmethod
    def get_layers() -> LayersResponse:
        layers: List[LayerItem] = [
            LayerItem(
                id="population",
                name="Population Density",
                type="polygon",
                feature_count=1240,
                status="active",
                source="Global Human Settlement Layer / Census",
                metadata={"unit": "persons/sqkm", "resolution": "100m"}
            ),
            LayerItem(
                id="transportation",
                name="Road Network & Speed Limits",
                type="linestring",
                feature_count=3850,
                status="active",
                source="OpenStreetMap Transport Vectors",
                metadata={"modes": ["drive", "transit", "walk"]}
            ),
            LayerItem(
                id="competitors",
                name="Commercial Competitors & POIs",
                type="point",
                feature_count=890,
                status="active",
                source="Commercial POI Registry",
                metadata={"categories": ["Retail", "Logistics", "EV", "Telecom"]}
            ),
            LayerItem(
                id="land_use",
                name="Land Use & Zoning",
                type="polygon",
                feature_count=640,
                status="active",
                source="Urban Planning & Cadastral Dataset",
                metadata={"types": ["Commercial", "Mixed-Use", "Industrial", "Residential"]}
            ),
            LayerItem(
                id="environmental_risk",
                name="Environmental & Flood Risk",
                type="raster",
                feature_count=310,
                status="active",
                source="Hydrological Risk Map",
                metadata={"return_period": "100yr"}
            ),
            LayerItem(
                id="h3_grid",
                name="H3 Hexagonal Readiness Grid",
                type="hex",
                feature_count=2100,
                status="active",
                source="GeoSpatial Readiness Engine",
                metadata={"resolution": 8}
            ),
        ]
        return LayersResponse(layers=layers)
