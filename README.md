#  Noz-Extension Backend

Noz-Extension Backend is the core orchestration layer of the AI-powered SRE Assistant. It integrates **SigNoz MCP**, **GitHub MCP**, and **OpenAI GPT-5** to answer production-related questions by combining observability data with source code context.

---

## Features

- Connects to SigNoz MCP Server
- Connects to GitHub MCP Server
- OpenAI GPT-5 integration
- Automatic MCP tool invocation
- Service ↔ Repository mapping
- AI-powered production investigation
- REST APIs for frontend communication

---

## Architecture

```
React Frontend
       |
       |
Express Backend
       |
       +----------------------+
       |                      |
 GitHub MCP              SigNoz MCP
       |                      |
 Repository Data      Logs • Traces • Metrics
       |
       +-----------+
                   |
              OpenAI GPT-5
                   |
            AI Generated Response
```

---

## Tech Stack

- Node.js
- Express.js
- OpenAI SDK
- GitHub MCP
- SigNoz MCP

---

## API Endpoints

### Get Workspace

```
GET /api/connect
```

Returns

- GitHub repositories
- SigNoz services
- Workspace status

---

### Save Mapping

```
POST /api/mapping
```

Maps services with repositories.

Example

```json
{
  "mappings": [
    {
      "service": "User-Service",
      "repository": "user-api"
    }
  ]
}
```

---

### Chat

```
POST /api/chat/ask
```

Example

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Why is User-Service failing?"
    }
  ]
}
```

---

## Environment Variables

Create a `.env`

```env
OPENAI_API_KEY=

SIGNOZ_URL=
SIGNOZ_API_KEY=

GITHUB_PERSONAL_ACCESS_TOKEN=
```

---

## Installation

```bash
npm install
```

Run

```bash
npm run dev
```

---

## Future Improvements


- Scheduled Handoff Reports
- Email Reports
- GitHub OAuth
- SigNoz OAuth
- Multi-user Support

---

## License

MIT
