# LearnEdge - AI-Powered Adaptive Learning Platform

Transform your study materials into interactive, personalized learning experiences with AI.

## 🚀 Features

- **AI-Powered Analysis**: Upload PDFs, DOCX, or paste text - AI extracts key concepts automatically
- **Adaptive Quizzing**: Questions that adjust to your mastery level
- **Smart Feedback**: Get explanations, analogies, and real-world examples for every answer
- **Progress Tracking**: Visual mastery charts for each topic
- **Material Library**: Organize and manage all your study materials in one place

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

### Quick Deploy

1. **Push to GitHub** (already done!)

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo: `harikarthick12/Learnedge`
   - Configure:
     - **Name**: `learnedge-api`
     - **Root Directory**: `server`
     - **Build Command**: `npm install && npx prisma generate && npm run build`
     - **Start Command**: `npx prisma migrate deploy && npm run start:prod`
     - **Environment Variables**:
       - `DATABASE_URL`: (from Render PostgreSQL)
       - `GEMINI_API_KEY`: Your Google AI key
       - `JWT_SECRET`: Generate a secure random string
       - `PORT`: 3001

4. **Create PostgreSQL Database**
   - Click "New +" → "PostgreSQL"
   - Name: `learnedge-db`
   - Copy the **Internal Database URL**
   - Add it to your backend's `DATABASE_URL` environment variable

5. **Deploy Frontend**
   - Click "New +" → "Web Service"
   - Connect same repo
   - Configure:
     - **Name**: `learnedge-client`
     - **Root Directory**: `client`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm run start`
     - **Environment Variables**:
       - `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., `https://learnedge-api.onrender.com`)

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
- `POST /quiz/submit/:questionId` - Submit answer
- `GET /quiz/performance` - Get progress stats

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
