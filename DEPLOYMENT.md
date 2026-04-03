# Deployment Guide - Vercel

This guide will help you deploy the Shri Ram Fitness gym management app to Vercel for free!

## Prerequisites

- GitHub account (free)
- Vercel account (free)
- Project pushed to GitHub

## Step 1: Push Your Project to GitHub

### Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right → "New repository"
3. Name it: `gym-billing-app`
4. Add description: "Gym Management and Billing System"
5. Click "Create repository"

### Push Your Code

In your project directory:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Gym management app"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/gym-billing-app.git

# Rename branch to main if needed
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 2: Deploy to Vercel

### Method 1: Using Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com) and sign up or log in
2. Click "Add New..." → "Project"
3. Select "Import Git Repository"
4. Paste your GitHub repository URL
5. Click "Continue"

### Configure Project

1. **Framework**: Select "Vite" (or leave as auto-detected)
2. **Build Command**: Keep as default or set to `npm run build`
3. **Output Directory**: Keep as `dist`
4. **Install Command**: Keep as default `npm install`

### Add Environment Variables

Before deploying, add your Firebase credentials:

1. In the Vercel import dialog, find "Environment Variables"
2. Add each variable:
   - `VITE_FIREBASE_API_KEY` = your Firebase API key
   - `VITE_FIREBASE_AUTH_DOMAIN` = your Firebase auth domain
   - `VITE_FIREBASE_PROJECT_ID` = your project ID
   - `VITE_FIREBASE_STORAGE_BUCKET` = your storage bucket
   - `VITE_FIREBASE_MESSAGING_SENDER_ID` = your sender ID
   - `VITE_FIREBASE_APP_ID` = your app ID

3. If using SendGrid or Twilio:
   - `VITE_SENDGRID_API_KEY` (optional)
   - `VITE_SENDGRID_FROM_EMAIL` (optional)
   - `VITE_TWILIO_ACCOUNT_SID` (optional)
   - `VITE_TWILIO_AUTH_TOKEN` (optional)

### Deploy

Click "Deploy" and wait for the build to complete!

Your app will be available at: `https://your-project-name.vercel.app`

## Vercel Domains

### Option 1: Vercel's Free Domain
Your app automatically gets a domain like:
- `gym-billing-app.vercel.app`

### Option 2: Custom Domain
1. In Vercel project settings → "Domains"
2. Add your custom domain
3. Update DNS records according to Vercel's instructions
4. Examples:
   - `gymbilling.com`
   - `shriramfitness.com`
   - `fitness.yourdomain.com`

## Setting Up Firebase Security

For production, update your Firebase security rules:

1. Go to Firebase Console
2. Firestore → Rules
3. Replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null || true;
    }
  }
}
```

**Note**: For a production app with user authentication, implement proper security rules.

## Continuous Deployment

Vercel automatically deploys whenever you push to your GitHub repository!

### Workflow:
1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your message"
   git push
   ```
3. Vercel automatically builds and deploys
4. Check deployment status in Vercel dashboard

## Environment Variables in Vercel

To update environment variables after deployment:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Edit or add new variables
4. Redeploy if needed:
   - Click "Deployments"
   - Click the three dots on the latest deployment
   - Select "Redeploy"

## Monitoring and Analytics

Vercel provides free analytics:

1. Go to project settings → "Analytics"
2. View:
   - Page performance
   - Core Web Vitals
   - Error tracking
   - Bandwidth usage

## Troubleshooting

### Build Fails
```
Check the build logs in Vercel dashboard:
1. Go to "Deployments"
2. Click on failed deployment
3. Scroll to see error messages
```

Common issues:
- Missing dependencies → Run `npm install` locally, commit lock file
- Environment variables → Double-check they're added correctly
- TypeScript errors → Run `npm run build` locally to test

### App Loads But No Data
- Check browser console for Firebase errors
- Verify environment variables are correct
- Check Firebase rules allow read/write

### Performance Issues
- Check Vercel Analytics
- Optimize Firebase queries
- Enable image optimization
- Review bundle size

## Domain Setup Examples

### Using Namecheap
1. Buy domain on Namecheap
2. Go to DNS settings
3. Add CNAME record pointing to Vercel
4. Add in Vercel: "Domains" → Add your domain
5. Wait 24 hours for DNS propagation

### Using GoDaddy
1. Buy domain on GoDaddy
2. Go to DNS Management
3. Create CNAME record
4. Point to your Vercel domain
5. Add domain to Vercel

## SSL/HTTPS

Vercel automatically provides free SSL certificates!

- All projects get HTTPS by default
- Auto-renewal every 90 days
- No additional setup needed

## Sharing Your App

Once deployed, share the link:
- `https://gym-billing-app.vercel.app`
- Or your custom domain
- Share with gym staff for immediate access
- No installation required!

## Free Tier Limits

Vercel free tier includes:
- ✅ Unlimited deployments
- ✅ Unlimited domains
- ✅ Free SSL/HTTPS
- ✅ Analytics (limited)
- ✅ Serverless functions (limited)
- ✅ Edge Network CDN
- ⚠️ 100GB bandwidth/month

For most gym management apps, you won't exceed these limits.

## Advanced: Serverless Functions

For advanced features, Vercel allows serverless functions:

```typescript
// api/send-email.ts
export default async function handler(req, res) {
  // Your backend logic here
  return res.status(200).json({ success: true });
}
```

Access at: `https://yourapp.vercel.app/api/send-email`

## Support

For Vercel-related issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review build logs in dashboard
- Visit [Vercel Community](https://vercel.com/community)

---

Your gym management app is now live on the internet! 🎉

Share the link with your staff and start using it immediately.
