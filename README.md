# LearnEdge - AI-Powered Adaptive Learning Platform

Transform your study materials into interactive, personalized learning experiences with AI.

## 🚀 Features

- **AI-Powered Analysis**: Upload PDFs, DOCX, or paste text - AI extracts key concepts automatically
- **Adaptive Quizzing**: Questions that adjust to your mastery level
- **AI Study Planner**: Generate personalized daily schedules based on content and available time
- **Concept Graphing**: Visual mind-maps showing relationships between study topics
- **Multi-Style Explanations**: "Explain like I'm 10", "Deep Dive", or "Real-world Analogy" modes
- **Smart Feedback**: Detailed mistake analysis showing what was missing and how to improve
- **Confidence Tracking**: Performance metrics based on accuracy, speed, and consistency
- **Revision Mode**: Automatically target weak topics for focused review

## 🛠️ Tech Stack

### Backend
- **NestJS** - Scalable Node.js framework
- **Prisma** - Type-safe ORM
- **PostgreSQL** - Production database
- **Google Gemini AI** - Content analysis and evaluation
- **JWT** - Secure authentication

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client

## 📦 Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL (for production) or SQLite (for dev)
- Google Gemini API key

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/harikarthick12/Learnedge.git
cd Learnedge
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create `server/.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/learnedge"
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your_super_secret_jwt_key
PORT=3001
```

4. **Run database migrations**
```bash
cd server
npx prisma migrate dev
npx prisma generate
```

5. **Start development servers**
```bash
# From root directory
npm run dev
```

This starts:
- Backend API: http://localhost:3001
- Frontend: http://localhost:3000

## 🌐 Deployment to Render

### Quick Deploy (Unified)

1. **Push to GitHub**
   
2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Create PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Name: `learnedge-db`
   - Copy the **Internal Database URL**

4. **Deploy Unified Web App**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo: `harikarthick12/Learnedge`
   - Configure:
     - **Name**: `learnedge-app`
     - **Root Directory**: `.` (empty)
     - **Build Command**: `npm run install:all && npm run build`
     - **Start Command**: `npx prisma migrate deploy --schema server/prisma/schema.prisma && npm start`
     - **Environment Variables**:
       - `DATABASE_URL`: (from Render PostgreSQL)
       - `GEMINI_API_KEY`: Your Google AI key
       - `JWT_SECRET`: Generate a secure random string
       - `PORT`: 3001
       - `NEXT_PUBLIC_API_URL`: (leave empty for unified deployment)

### Environment Variables Reference

#### Backend (`server/.env`)
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `GEMINI_API_KEY` | Google AI API key | `AIzaSy...` |
| `JWT_SECRET` | Secret for JWT tokens | `your-secret-key` |
| `PORT` | Server port | `3001` |

#### Frontend (`client/.env.local`)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://learnedge-api.onrender.com` |

## 📝 API Endpoints

### Authentication
- `POST /auth/signup` - Create account
- `POST /auth/login` - Login

### Materials
- `POST /materials/upload` - Upload file
- `POST /materials/raw` - Paste text
- `GET /materials` - Get all materials
- `GET /materials/:id` - Get single material

### Quiz
- `POST /quiz/generate/:materialId` - Generate questions
- `POST /quiz/submit/:questionId` - Submit answer (includes mistake analysis)
- `GET /quiz/performance` - Get progress and confidence stats

### Study & AI
- `POST /study/plan` - Generate AI study plan
- `GET /study/plans` - List study plans
- `GET /study/metrics` - Experience confidence analytics
- `POST /materials/explain` - Explain content in specific styles (CHILD, EXAM, CODE, ANALOGY)

## 🔒 Security Notes

- Never commit `.env` files
- Use strong JWT secrets in production
- Rotate API keys regularly
- Enable CORS only for your frontend domain in production

## 📄 License

MIT License - feel free to use this project for learning!

## 🤝 Contributing

Contributions welcome! Please open an issue first to discuss changes.

## 💡 Getting Help

- Check the [Issues](https://github.com/harikarthick12/Learnedge/issues) page
- Review the code comments
- Contact: [Your contact info]

---

Built with ❤️ using AI and modern web technologies
