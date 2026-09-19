# 13_TESTING_SPEC.md

# Testing Specification

## Unit tests

Test:
- weight normalization
- score calculation
- factor normalization
- distance decay
- competition score
- constraint handling
- deterministic mock data

## Example score test

Given:
```text
population=91
accessibility=87
competition=63
land_use=95
risk=78
```

and weights:
```text
0.30, 0.25, 0.15, 0.15, 0.15
```

Expected:
`84.45`, displayed as `84` if integer display is configured.

## Integration tests

Test:
- frontend → API
- API → scoring service
- API → spatial service
- AI service receives analysis payload

## UI tests

Test:
- navigation
- site selection
- weight sliders
- map layer toggles
- opportunity filters
- comparison selection
- AI assistant
- report generation

## Contract tests

API request and response structures must match `06_API_CONTRACT.md`.

## Regression rule

Changing scoring behavior requires:
- updated algorithm version
- updated tests
- updated documentation

## Demo test

Before presentation, verify:
1. app loads
2. map renders
3. layer toggles work
4. site click works
5. score appears
6. weights update score
7. accessibility appears
8. competition appears
9. AI explanation works
10. opportunity search works
11. comparison works
12. report flow works
