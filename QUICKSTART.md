# PodBrief Quick Start Guide

Get PodBrief up and running in 5 minutes! 🚀

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

## Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (you'll need it in step 3)

## Step 2: Clone and Setup

```bash
# Clone the repository (if not already done)
git clone <your-repo-url>
cd PodBrief

# Install all dependencies
npm run install-all
```

## Step 3: Configure Environment

```bash
# Copy the environment template
cp server/env.example server/.env

# Edit the .env file and add your OpenAI API key
nano server/.env
```

Add your OpenAI API key:
```env
PORT=5000
OPENAI_API_KEY=sk-your-actual-api-key-here
NODE_ENV=development
```

## Step 4: Start the Application

```bash
# Start both frontend and backend
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## Step 5: Test the Application

1. Open http://localhost:3000 in your browser
2. Fill in the guest information:
   - **Name**: John Doe (required)
   - **Link**: https://johndoe.com (optional)
   - **Topic**: AI and Machine Learning (optional)
3. Click "Generate Brief"
4. Wait for the AI to generate your content
5. Copy any section to your clipboard using the copy buttons

## Alternative: Docker Deployment

If you prefer Docker:

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run in development mode
docker-compose --profile dev up --build
```

## Troubleshooting

### Common Issues

1. **"Failed to generate brief" error**
   - Check your OpenAI API key in `server/.env`
   - Ensure you have credits in your OpenAI account

2. **Port already in use**
   - Change the port in `server/.env`
   - Or kill the process using the port

3. **Database errors**
   - Delete `server/data/` folder and restart
   - The database will be recreated automatically

4. **Frontend not loading**
   - Check if the backend is running on port 5000
   - Check browser console for errors

### Testing the API

Run the test script to verify everything is working:

```bash
node test-api.js
```

## Next Steps

- Customize the AI prompts in `server/routes/generate.js`
- Add authentication and user management
- Deploy to production (Heroku, Vercel, AWS, etc.)
- Add more features like brief history, templates, etc.

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the logs in the terminal
3. Check the browser console for frontend errors
4. Verify your OpenAI API key and credits

Happy podcasting! 🎙️ 