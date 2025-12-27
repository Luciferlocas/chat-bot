## How to Run Locally

### Prerequisites
- Node.js (v18+)
- pnpm (v9+)
- PostgreSQL Database
- Redis Server
- Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/Luciferlocas/chat-bot.git
cd chat-bot
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Create a `.env` file:

**`.env` Configuration:**
```env
PORT=3000
CORS_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://user:password@localhost:5432/mini_ai_db
GEMINI_API_KEY=your_gemini_api_key_here
REDIS_URL=redis://localhost:6379
```

Install dependencies:
```bash
pnpm install
```

Run Database Migrations:
```bash
pnpm db:push
```

Start the Server:
```bash
pnpm dev
```
The backend will run on `http://localhost:3000`.

### 3. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Create a `.env` file:
```env
VITE_BACKEND_URL=http://localhost:3000/api
```

Install dependencies:
```bash
pnpm install
```

Start the Development Server:
```bash
pnpm dev
```
The frontend will run on `http://localhost:5173`.

---

## Architecture Overview

The project follows a modular, layered architecture to ensure separation of concerns and maintainability.

### Backend Structure
- **`controller/`**: Handles incoming HTTP requests, validates input using Zod schemas, and sends responses.
- **`service/`**: Contains business logic.
  - `chat.service.ts`: Manages conversation flow, history retrieval, and database interactions.
  - `llm.service.ts`: Encapsulates the interaction with the Gemini API, including error parsing.
- **`dto/`**: Data Transfer Objects / Data Access Layer. Abstraction over Drizzle ORM queries.
- **`schema/`**: Zod schemas for runtime validation of API requests.
- **`middleware/`**: Redis-based rate limiter middleware.

### Design Decisions
1.  **Drizzle ORM**: Chosen for its type safety and lightweight nature compared to Prisma. It allows for raw SQL control when needed but provides a great DX.
2.  **Optimistic Updates**: The frontend adds the user's message to the store immediately and shows a loading state. This makes the app feel faster and more responsive than waiting for the server round-trip.
3.  **Session Management**: A `clientId` is generated and stored in `localStorage`. This allows users to refresh the page and keep their identity without a full login system.
4.  **Error masking**: Technical errors (like "Invalid API Key") are caught in the Service layer and translated into generic, friendly messages ("We are experiencing technical issues") to avoid leaking internal state to the user.

---

## LLM Integration Notes

- **Provider**: Google Gemini (via `@google/generative-ai` SDK).
- **Model**: `gemini-3-flash-preview` (Chosen for speed and cost-efficiency).
- **Prompting Strategy**:
  - A comprehensive **System Instruction** is initialized with the model.
  - It defines the persona ("Helpful support agent").
  - It embeds a "Knowledge Base" (Shipping policy, Return policy, etc.) directly into the context.
  - It includes strict rules on fallback behavior ("If you don't know, say contact support").
- **Context Window**: The full conversation history (up to the token limit) is sent with each request to ensure continuity.

---

## Trade-offs & "If I had more time..."

1.  **WebSockets vs. HTTP Polling**:
    - *Current*: Standard HTTP POST requests.
    - *Better*: Use WebSockets (Socket.io) for real-time streaming of the AI response (token by token) instead of waiting for the full text. This would improve perceived latency.
2.  **Strict Typing Shared Package**:
    - *Current*: Schemas are defined in frontend and backend.
    - *Better*: A Monorepo structure (Turborepo) with a `shared` package for Zod schemas and TypeScript types to ensure the frontend and backend contracts never drift apart.
3.  **Testing**:
    - *Current*: Manual testing.
    - *Better*: Add Jest/Vitest for unit testing the Service layer and Cypress/Playwright for E2E testing the chat flow.
