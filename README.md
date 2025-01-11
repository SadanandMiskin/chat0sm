# Chat0sm
- A chatGpt like clone using Gemini and google OAuth

### Demo
https://github.com/user-attachments/assets/62280d01-3f2e-496f-a61f-0c866f593a76

### Backend
- Express
- NodeJS
- MongoDB
- TypeScript

### Frontend
- React + TS
- Google OAuth
- Gemini API

### Installation



-  <h2>Backend</h2>
- create Env file `.env`
```bash
GEMINI_API_KEY=
MONGODB=
JWT_SECRET=
GOOGLE_CLIENT_ID=
FRONTEND_URL=
```
- `yarn install` -> Install
-  `yarn dev` -> Run Server

-  <h2>Frontend</h2>
- add backend url in `frontend/src/services/api.ts` as `API_URL=<backend_url>`
- `yarn install` -> Install
-  `yarn dev` -> Run Server
  
