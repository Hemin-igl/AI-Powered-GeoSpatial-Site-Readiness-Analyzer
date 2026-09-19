# 19_DECISION_LOG.md

# Architecture Decision Log

## ADR-001 — AI is not the GIS engine

Decision:
GIS and scoring calculations remain deterministic backend services.

Reason:
Numerical reproducibility, auditability, and protection against hallucinated measurements.

## ADR-002 — PostGIS is the spatial system of record

Decision:
Persist production spatial datasets in PostgreSQL/PostGIS.

Reason:
Centralized spatial queries, indexing, persistence, and integration with Python GIS tooling.

## ADR-003 — GeoJSON for web interchange

Decision:
Use GeoJSON for browser-facing feature exchange where appropriate.

Reason:
It is a standard web-friendly geographic interchange format.

## ADR-004 — H3 for city-wide aggregation

Decision:
Use H3 cells for opportunity aggregation and visualization.

Reason:
Consistent spatial units and efficient city-wide analytical visualization.

## ADR-005 — Configurable scoring profiles

Decision:
Business profiles are configuration, not separate scoring implementations.

Reason:
Avoid duplicated logic and allow future business types.

## ADR-006 — Mock-first frontend

Decision:
Frontend can operate entirely on deterministic mock services.

Reason:
Parallel development and reliable demonstrations before backend completion.
