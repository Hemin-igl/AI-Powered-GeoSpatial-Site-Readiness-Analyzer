# 10_AI_SPECIFICATION.md

# AI Specification

## AI's role

The AI is an explanation and natural-language interface layer.

It is NOT the GIS calculation engine.

## Allowed AI tasks

- explain a score
- summarize factors
- describe trade-offs
- answer questions about computed metrics
- translate user language into structured filters
- generate report narrative
- explain GIS algorithms in plain language

## Forbidden AI behavior

The AI must not:
- invent population numbers
- invent competitor counts
- invent distances
- change the calculated score
- fabricate GIS calculations
- claim simulated data is real
- silently change scoring weights
- override hard constraints

## Grounding

AI receives structured analysis JSON.

Example:
```json
{
  "score": 84,
  "factors": {
    "population": 91,
    "accessibility": 87,
    "competition": 63,
    "land_use": 95,
    "risk": 78
  }
}
```

The AI must reference only values present in the analysis payload.

## Explanation format

When asked "Why this score?", respond with:

1. Overall score
2. Strongest positive factors
3. Limiting factors
4. Important measurable evidence
5. Constraints if present
6. Short conclusion

## Natural-language search

User:
"Find areas with high population, low competition and good accessibility."

AI converts this into structured parameters:

```json
{
  "population": "high",
  "competition": "low",
  "accessibility": "high"
}
```

The GIS backend performs the search.

AI does not directly select coordinates.

## Hallucination policy

If data is missing:
- say it is unavailable
- do not estimate silently

If data is simulated:
- explicitly identify it as simulated

If the user asks for a calculation:
- use backend-calculated values

## AI prompt contract

System prompt must include:
- product role
- data-grounding rules
- output format
- demo-data disclaimer
- no numerical invention rule
