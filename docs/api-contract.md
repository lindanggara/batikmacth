# API Contract

## GET /health
{ "status": "ok" }

## POST /search
multipart/form-data field `file`.
Response: `{ "results": [{ "motif": "parang", "score": 0.93 }] }`

## POST /predict
Response: `{ "predictions": [{ "label": "parang", "confidence": 0.92 }] }`
