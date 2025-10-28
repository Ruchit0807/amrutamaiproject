# Multi-stage Dockerfile for AMRUTAM AI

# Stage 1: Backend with Python dependencies
FROM python:3.9-slim as backend

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy model and Python files
COPY best_efficientnet.pth .
COPY app.py .
COPY skin_disease_module.py .
COPY ayurvedic_remedies.py .

# Stage 2: Frontend with Node.js
FROM node:18-alpine as frontend

WORKDIR /app

# Copy package files
COPY amrutam-ai/package*.json ./amrutam-ai/
WORKDIR /app/amrutam-ai

# Install dependencies
RUN npm ci

# Copy frontend files
WORKDIR /app
COPY amrutam-ai ./amrutam-ai/

# Build Next.js app
WORKDIR /app/amrutam-ai
RUN npm run build

# Final stage: Production runtime
FROM python:3.9-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

# Copy Python backend from backend stage
COPY --from=backend /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=backend /usr/local/bin /usr/local/bin
COPY --from=backend /app /app/backend

# Copy Node.js runtime from frontend stage  
COPY --from=frontend /usr/local/bin/node /usr/local/bin/
COPY --from=frontend /app/amrutam-ai /app/amrutam-ai

# Expose ports
EXPOSE 8000 3000

# Start both services
CMD ["sh", "-c", "cd /app/backend && python app.py & cd /app/amrutam-ai && npm start"]

