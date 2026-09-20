import math
import numpy as np
from typing import List, Dict, Any, Optional
from sklearn.cluster import DBSCAN
import h3

from ..schemas.hotspots import HotspotsResponse, HotspotFeature

class HotspotService:
    @classmethod
    def calculate_hotspots(
        cls,
        algorithm: str = "h3",
        layer: str = "readiness",
        center_lat: float = 21.1702,
        center_lon: float = 72.8311,
        radius_km: float = 8.0
    ) -> HotspotsResponse:
        algo = algorithm.lower()
        if algo == "h3":
            return cls._calculate_h3_grid(center_lat, center_lon, layer)
        elif algo == "dbscan":
            return cls._calculate_dbscan(center_lat, center_lon, layer)
        elif algo in ["gi_star", "getis_ord", "gistar"]:
            return cls._calculate_getis_ord(center_lat, center_lon, layer)
        else:
            return cls._calculate_h3_grid(center_lat, center_lon, layer)

    @classmethod
    def _calculate_h3_grid(cls, center_lat: float, center_lon: float, layer: str) -> HotspotsResponse:
        # Generate H3 resolution 8 cells around center (approx 450m edge length)
        resolution = 8
        center_hex = h3.latlng_to_cell(center_lat, center_lon, resolution)
        hex_cells = list(h3.grid_disk(center_hex, 3))

        features: List[HotspotFeature] = []

        for idx, cell in enumerate(hex_cells):
            boundary = h3.cell_to_boundary(cell)
            # GeoJSON polygon: [ [ [lon, lat], ... ] ]
            geojson_coords = [[round(lon, 6), round(lat, 6)] for lat, lon in boundary]
            geojson_coords.append(geojson_coords[0])  # Close ring

            cell_lat, cell_lon = h3.cell_to_latlng(cell)
            # Deterministic variation
            dist = math.sqrt((cell_lat - center_lat)**2 + (cell_lon - center_lon)**2)
            noise = (math.sin(cell_lat * 20) + math.cos(cell_lon * 20) + 2) / 4.0

            pop_score = max(30, min(95, int(85 - dist * 400 + noise * 15)))
            acc_score = max(35, min(98, int(80 - dist * 350 + (1 - noise) * 20)))
            comp_score = max(20, min(90, int(60 + noise * 30)))
            readiness = max(25, min(97, int((pop_score * 0.35) + (acc_score * 0.35) + (comp_score * 0.30))))

            value_map = {
                "population": pop_score,
                "competition": comp_score,
                "readiness": readiness,
                "accessibility": acc_score
            }
            target_val = value_map.get(layer, readiness)

            features.append(
                HotspotFeature(
                    geometry={
                        "type": "Polygon",
                        "coordinates": [geojson_coords]
                    },
                    properties={
                        "h3_index": cell,
                        "resolution": resolution,
                        "score": target_val,
                        "readiness_score": readiness,
                        "population_score": pop_score,
                        "accessibility_score": acc_score,
                        "competition_score": comp_score,
                        "center": [round(cell_lon, 6), round(cell_lat, 6)],
                        "status": "High Opportunity" if target_val >= 75 else "Moderate" if target_val >= 50 else "Low Opportunity"
                    }
                )
            )

        return HotspotsResponse(
            algorithm="h3",
            layer=layer,
            feature_count=len(features),
            features=features
        )

    @classmethod
    def _calculate_dbscan(cls, center_lat: float, center_lon: float, layer: str) -> HotspotsResponse:
        # Generate sample points around center
        np.random.seed(42)
        n_points = 45
        angles = np.random.uniform(0, 2 * np.pi, n_points)
        radii = np.random.exponential(scale=0.03, size=n_points)
        
        lats = center_lat + radii * np.sin(angles)
        lons = center_lon + radii * np.cos(angles)
        coords = np.column_stack([lats, lons])

        # Run DBSCAN (converting approx km to degrees, eps = ~1.2km -> 0.011 deg)
        db = DBSCAN(eps=0.012, min_samples=3).fit(coords)
        labels = db.labels_

        features: List[HotspotFeature] = []
        core_sample_set = set(int(x) for x in db.core_sample_indices_)
        for i, (lat, lon, label) in enumerate(zip(lats, lons, labels)):
            is_noise = bool(int(label) == -1)
            cluster_id = f"cluster_{int(label)}" if not is_noise else "noise"
            
            features.append(
                HotspotFeature(
                    geometry={
                        "type": "Point",
                        "coordinates": [round(float(lon), 6), round(float(lat), 6)]
                    },
                    properties={
                        "point_id": f"pt_{i+1:03d}",
                        "cluster_id": cluster_id,
                        "cluster_label": int(label),
                        "is_core_sample": bool(int(i) in core_sample_set),
                        "is_noise": is_noise,
                        "algorithm": "DBSCAN (eps=0.012, min_samples=3)"
                    }
                )
            )

        return HotspotsResponse(
            algorithm="dbscan",
            layer=layer,
            feature_count=len(features),
            features=features
        )

    @classmethod
    def _calculate_getis_ord(cls, center_lat: float, center_lon: float, layer: str) -> HotspotsResponse:
        """
        Calculate Getis-Ord Gi* spatial autocorrelation statistic for grid cells.
        Gi* = (sum(w_ij * x_j) - X_bar * sum(w_ij)) / (S * sqrt((n * sum(w_ij^2) - (sum(w_ij))^2) / (n - 1)))
        """
        # First generate local grid points
        grid_dim = 6
        step = 0.015
        lats = np.linspace(center_lat - (grid_dim / 2) * step, center_lat + (grid_dim / 2) * step, grid_dim)
        lons = np.linspace(center_lon - (grid_dim / 2) * step, center_lon + (grid_dim / 2) * step, grid_dim)

        grid_coords = []
        values = []
        for lat in lats:
            for lon in lons:
                dist = math.sqrt((lat - center_lat)**2 + (lon - center_lon)**2)
                val = max(10.0, 100.0 - dist * 600.0 + np.sin(lat * 30) * 15.0)
                grid_coords.append((lat, lon))
                values.append(val)

        values = np.array(values)
        n = len(values)
        x_bar = np.mean(values)
        s = np.std(values, ddof=1) if np.std(values, ddof=1) > 0 else 1.0

        features: List[HotspotFeature] = []

        for i, (lat_i, lon_i) in enumerate(grid_coords):
            # Spatial distance-based weights within threshold
            w_ij = np.zeros(n)
            for j, (lat_j, lon_j) in enumerate(grid_coords):
                d = math.sqrt((lat_i - lat_j)**2 + (lon_i - lon_j)**2)
                if d <= 0.025:  # neighborhood threshold
                    w_ij[j] = 1.0 / (1.0 + d * 50.0)

            sum_w = np.sum(w_ij)
            sum_w2 = np.sum(w_ij ** 2)
            numerator = np.sum(w_ij * values) - (x_bar * sum_w)
            denom = s * math.sqrt((n * sum_w2 - (sum_w ** 2)) / (n - 1.0)) if (n * sum_w2 - (sum_w ** 2)) > 0 else 1.0

            z_score = round(float(numerator / denom), 3) if denom > 0 else 0.0

            if z_score >= 2.58:
                classification = "Hotspot (99% confidence)"
            elif z_score >= 1.96:
                classification = "Hotspot (95% confidence)"
            elif z_score >= 1.65:
                classification = "Hotspot (90% confidence)"
            elif z_score <= -1.96:
                classification = "Coldspot (95% confidence)"
            else:
                classification = "Not Significant"

            # Polygon bounding box for cell
            half = step / 2.0
            polygon_coords = [
                [round(lon_i - half, 6), round(lat_i - half, 6)],
                [round(lon_i + half, 6), round(lat_i - half, 6)],
                [round(lon_i + half, 6), round(lat_i + half, 6)],
                [round(lon_i - half, 6), round(lat_i + half, 6)],
                [round(lon_i - half, 6), round(lat_i - half, 6)],
            ]

            features.append(
                HotspotFeature(
                    geometry={
                        "type": "Polygon",
                        "coordinates": [polygon_coords]
                    },
                    properties={
                        "cell_id": f"gi_cell_{i+1:03d}",
                        "value": round(float(values[i]), 1),
                        "gi_star_zscore": z_score,
                        "classification": classification,
                        "center": [round(lon_i, 6), round(lat_i, 6)]
                    }
                )
            )

        return HotspotsResponse(
            algorithm="gi_star",
            layer=layer,
            feature_count=len(features),
            features=features
        )
