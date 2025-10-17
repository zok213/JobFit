# JobFit.AI

A comprehensive AI-powered job matching and career development platform built with Next.js.

## 🚀 Features

### For Job Seekers

- **AI CV Assistant**: Intelligent CV analysis, building, and optimization
- **Smart Job Matching**: AI-powered job-candidate compatibility analysis
- **Career Roadmap Generator**: Personalized career development paths
- **AI Interview Practice**: Voice-enabled interview simulation with real-time feedback

### For Employers

- **Advanced Dashboard**: Comprehensive hiring management and analytics
- **Smart Job Posting**: AI-optimized job descriptions
- **Intelligent Candidate Matching**: Advanced filtering and compatibility scoring
- **Interview Management**: Automated scheduling and AI-assisted evaluation

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Authentication**: Supabase Auth with role-based access control
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand with persistence
- **UI Components**: Custom components with Radix UI primitives
- **Animations**: Framer Motion
- **AI Integration**: DeepSeek, OpenAI, ElevenLabs, AssemblyAI

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm 8.0 or higher
- Supabase account (for authentication and database)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd jobfit-ai
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your API keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your actual configuration:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI API Keys (Optional - for AI features)
DEEPSEEK_API_KEY=your_deepseek_api_key
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ASSEMBLYAI_API_KEY=your_assemblyai_api_key

# Python Backend (For Roadmap Generation)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
