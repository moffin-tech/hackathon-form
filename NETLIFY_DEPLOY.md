# Netlify Deployment Instructions

## Required Environment Variables

You MUST configure these environment variables in your Netlify dashboard:

### 1. Go to Netlify Dashboard
- Visit your site dashboard
- Go to **Site settings** → **Environment variables**

### 2. Add These Variables

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackathon-forms?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-site.netlify.app
```

### 3. Important Notes

- **MONGODB_URI**: Replace with your actual MongoDB Atlas connection string
- **NEXTAUTH_SECRET**: Generate a random secret key (32+ characters)
- **NEXTAUTH_URL**: Replace with your actual Netlify site URL

### 4. After Adding Variables

1. Save the environment variables
2. Trigger a new deploy (or push new changes)
3. The build should now succeed

## Troubleshooting

If the build still fails:

1. **Check variable names**: Ensure exact spelling (case-sensitive)
2. **Check MongoDB URI**: Test the connection string
3. **Check Netlify logs**: Look for specific error messages
4. **Redeploy**: Sometimes a fresh deploy is needed

## Alternative: Use netlify.toml

You can also uncomment and set the variables in `netlify.toml`:

```toml
[build.environment]
  MONGODB_URI = "your-mongodb-uri-here"
  NEXTAUTH_SECRET = "your-secret-here"
  NEXTAUTH_URL = "https://your-site.netlify.app"
```

But the dashboard method is recommended for security.
