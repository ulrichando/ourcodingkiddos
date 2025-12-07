# Vercel Deployment Guide

## Required Environment Variables

Go to your Vercel project → Settings → Environment Variables and add:

### 1. Database (REQUIRED)
```
DATABASE_URL=your-postgres-connection-string
```
**Important:** Use a production PostgreSQL database (e.g., Vercel Postgres, Supabase, Neon, Railway)

### 2. Authentication (REQUIRED)
```
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://ourcodingkiddos.com
```

Generate NEXTAUTH_SECRET with:
```bash
openssl rand -base64 32
```

### 3. Optional (but recommended for full functionality)
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM="Our Coding Kiddos <hello@ourcodingkiddos.com>"
```

## Common Deployment Errors

### Error: "Prisma Client did not initialize yet"
**Solution:**
- Make sure `DATABASE_URL` is set in Vercel environment variables
- Ensure it's set for all environments (Production, Preview, Development)

### Error: "Build failed" or "Type errors"
**Solution:**
- Run `npm run build` locally first to catch errors
- Check the Vercel deployment logs for specific TypeScript errors

### Error: "Database connection failed"
**Solution:**
- Verify your DATABASE_URL is correct and accessible from Vercel's network
- Make sure your database allows connections from Vercel's IP range
- For Vercel Postgres, use the connection string from the Vercel dashboard

### Error: "Module not found" or dependency issues
**Solution:**
- Ensure all dependencies are in `package.json` (not just devDependencies)
- Delete `node_modules` and `package-lock.json`, then run `npm install`

## Deployment Steps

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to vercel.com → New Project
   - Import your Git repository
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Set Environment Variables**
   - Click "Environment Variables"
   - Add all required variables listed above
   - **IMPORTANT:** Apply to all environments

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## Database Setup

### Option 1: Vercel Postgres (Recommended)
1. Go to your Vercel project → Storage → Create Database
2. Select Postgres
3. Copy the `DATABASE_URL` to environment variables
4. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Option 2: External Provider (Supabase, Neon, Railway)
1. Create a PostgreSQL database
2. Get the connection string
3. Add to Vercel environment variables as `DATABASE_URL`
4. Run migrations from local machine or Vercel deployment

## Post-Deployment

### Run Database Migrations
After first deployment, you may need to run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Run migration
vercel env pull .env.production
npx prisma migrate deploy
```

### Create Admin User
Run this after deployment to create your first admin user:

```bash
# SSH into Vercel (or use a separate script endpoint)
# Or create via your database dashboard
```

## Troubleshooting Tips

1. **Check Vercel Logs**
   - Go to your project → Deployments → Click on failed deployment
   - Check "Build Logs" and "Function Logs" for errors

2. **Test Build Locally**
   ```bash
   npm run build
   npm start
   ```

3. **Verify Environment Variables**
   - Go to Settings → Environment Variables
   - Make sure all required variables are set
   - Click "Redeploy" after adding variables

4. **Database Connection**
   - Test your DATABASE_URL locally
   - Ensure SSL is enabled if required (add `?sslmode=require` to connection string)

5. **Prisma Issues**
   - Make sure `prisma generate` runs in postinstall
   - Check that `@prisma/client` version matches `prisma` version

## Need Help?

If you're still having issues, check:
- Vercel deployment logs (specific error message)
- Browser console for client-side errors
- Vercel function logs for API route errors

Common error patterns:
- `ECONNREFUSED`: Database not accessible
- `P1001`: Can't reach database server
- `Invalid environment variable`: Missing required env var
- TypeScript errors: Run `npm run build` locally to see them
