# NextAuth Configuration Check
# This file helps verify that NEXTAUTH_SECRET is properly configured

if [ -z "$NEXTAUTH_SECRET" ]; then
  echo "ERROR: NEXTAUTH_SECRET environment variable is not set!"
  echo "Please add NEXTAUTH_SECRET to your Netlify environment variables."
  echo "You can generate a secure secret with: openssl rand -base64 32"
  exit 1
else
  echo "✅ NEXTAUTH_SECRET is configured"
fi

if [ -z "$MONGODB_URI" ]; then
  echo "ERROR: MONGODB_URI environment variable is not set!"
  echo "Please add MONGODB_URI to your Netlify environment variables."
  exit 1
else
  echo "✅ MONGODB_URI is configured"
fi

echo "✅ All required environment variables are set"
