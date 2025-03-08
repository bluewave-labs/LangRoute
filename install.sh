#!/bin/bash

echo "🚀 Starting LangRoute Installation..."

# Check for required tools
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting."; exit 1; }
command -v psql >/dev/null 2>&1 || { echo "❌ PostgreSQL client is required but not installed. Aborting."; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
npm install || { echo "❌ Failed to install dependencies"; exit 1; }

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "🔑 Generating encryption keys..."
    ENCRYPTION_KEY=$(openssl rand -hex 32)
    IV=$(openssl rand -hex 16)
    
    cat > .env << ENVEOF
ENCRYPTION_KEY="${ENCRYPTION_KEY}"
IV="${IV}"

# API Keys (Please fill these in)
OPENAI_API_KEY=""
MISTRAL_API_KEY=""

# Database URL (Update if needed)
DATABASE_URL="postgresql://langroute:langroute@127.0.0.1:5432/langroute"
ENVEOF
    echo "✅ Created .env file"
fi

# Test database connection
echo "🔍 Testing database connection..."
DB_URL=$(grep DATABASE_URL .env | cut -d '"' -f 2)
psql "${DB_URL}" -c '\q' >/dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Could not connect to database. Please check your DATABASE_URL in .env"
    echo "   Current URL: ${DB_URL}"
    exit 1
fi

# Run database migrations
echo "🔄 Running database migrations..."
npx sequelize-cli db:migrate || { echo "❌ Database migration failed"; exit 1; }

# Load initial configuration
echo "⚙️ Loading initial configuration..."
node -e "require('./app.js').loadConfigFromFile()" || { echo "❌ Failed to load configuration"; exit 1; }

echo "✨ Installation complete! Next steps:"
echo "1. Add your API keys to .env file"
echo "2. Start the server with: npm start"
