## Multi-Header JSON Service
## What is this app?
A smart backend service that returns different JSON configurations based on HTTP headers you send. It's like a "smart config loader" that picks the right settings file for different users.

## What it's built with:
Node.js + Express.js - Backend framework

In-memory caching - For fast responses

File system - Stores JSON config files

Winston logging - For tracking requests

Security middleware - Helmet, CORS, rate limiting

## Start Server
npm run dev    # Development
npm start      # Production

**Server runs on:** 
`http://localhost:3000`

API Testing Cheatsheet

## Base URL
`http://localhost:3000`

## Available Endpoints

### 1. **Get Configuration** - `GET /config`
Returns JSON based on headers.

**Headers:**
- `X-Country` (optional) - e.g., `IN`, `US`, `UK`
- `X-Gender` (optional) - e.g., `male`, `female`  
- `X-Age` (optional) - e.g., `18`, `25`, `30`

**cURL Examples:**
```bash
# All headers
curl -H "X-Country: IN" -H "X-Gender: male" -H "X-Age: 18" http://localhost:3000/config

# Only country
curl -H "X-Country: US" http://localhost:3000/config

# Country + gender  
curl -H "X-Country: IN" -H "X-Gender: female" http://localhost:3000/config

# No headers (fallback)
curl http://localhost:3000/config

# Non-existent (tests fallback)
curl -H "X-Country: FR" -H "X-Gender: unknown" http://localhost:3000/config
```

---

### 2. **Health Check** - `GET /health`
Check if server is running.

**cURL:**
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-06T10:30:00.000Z",
  "uptime": 123.45
}
```

---

## Quick Test Commands (Copy & Paste)

# 1. Test health first
curl http://localhost:3000/health

# 2. Test with all headers
curl -H "X-Country: IN" -H "X-Gender: male" -H "X-Age: 18" http://localhost:3000/config

# 3. Test partial headers
curl -H "X-Country: US" http://localhost:3000/config

# 4. Test fallback
curl http://localhost:3000/config

# 5. Test non-existent combination
curl -H "X-Country: XX" http://localhost:3000/config

