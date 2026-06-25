# KREDO Prototype

KREDO is a relationship-based credit risk tool for agricultural SACCOs in Kenya. This monorepo contains both the FastAPI Python backend and the React (Vite) + Tailwind frontend.

## Project Structure

```
kredo/
├── backend/       # FastAPI application and AI agents
└── frontend/      # React, Vite, and Tailwind CSS web application
```

## Prerequisites

- Node.js (v18+)
- Python (3.9+)

## Setup Instructions

### Environment Variables

Both the backend and frontend rely on environment variables. We have provided `.env.example` files in both directories.

1. **Backend**:
   ```bash
   cd backend
   cp .env.example .env
   ```
   *Make sure to add your `FEATHERLESS_API_KEY` to `backend/.env`!*

2. **Frontend**:
   ```bash
   cd frontend
   cp .env.example .env
   ```
   *(Defaults to connecting to `http://localhost:8000/api`)*

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. (Optional but recommended) Create and activate a virtual environment.
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

Once both servers are running, navigate to `http://localhost:5173` in your browser. 
You can test the application using the mock phone number: `+254712345678`.
