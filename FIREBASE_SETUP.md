# Firebase Setup Guide

This guide will help you set up Firebase for the Shri Ram Fitness gym management app.

## Why Firebase?

Firebase is perfect for this app because:
- ✅ Free tier: up to 1 GB storage and 50,000 reads/writes per day
- ✅ No backend server needed
- ✅ Real-time database (Firestore)
- ✅ Automatic backups
- ✅ Built-in security
- ✅ Scales automatically
- ✅ Pay-as-you-go after free tier (usually very cheap)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Project name: `Shri Ram Fitness Gym` (or your choice)
4. Uncheck "Enable Google Analytics" (optional)
5. Click "Create project"
6. Wait for project to be created (about 30 seconds)

## Step 2: Create Firestore Database

1. In the Firebase Console, click "Build" in the left menu
2. Select "Firestore Database"
3. Click "Create database"
4. Choose your location (closer to your users = faster)
5. Start in **Test Mode** for development
6. Click "Enable"

⚠️ **Important**: Test Mode allows anyone to read/write. For production, update security rules!

## Step 3: Get Firebase Credentials

1. Click the ⚙️ (Settings) icon in top left
2. Select "Project Settings"
3. Scroll down to "Your apps" section
4. Click the `</> ` (Web) icon to add a web app
5. App name: `Gym Billing App`
6. Check "Also set up Firebase Hosting" (optional)
7. Click "Register app"
8. Copy the Firebase config object that appears
9. Click "Continue to console"

## Step 4: Create Collections

In Firestore, you need to create collections (like database tables):

### Create "members" Collection:
1. In Firestore, click "Start collection"
2. Collection ID: `members`
3. Click "Next"
4. Click "Auto ID" (generates random ID)
5. Add these fields:
   - `name` (string)
   - `email` (string)
   - `phone` (string)
   - `membershipType` (string) - set to "monthly"
   - `joinDate` (date)
   - `expiryDate` (date)
   - `amount` (number)
   - `amountPaid` (number)
   - `status` (string) - set to "active"
   - `whatsappOptIn` (boolean) - set to false
6. Click "Save"
7. Delete this test document (click the X)

### Create "bills" Collection:
Repeat the above for "bills" collection with fields:
- `memberId` (string)
- `memberName` (string)
- `amount` (number)
- `amountPaid` (number)
- `billingDate` (date)
- `dueDate` (date)
- `status` (string)
- `emailSent` (boolean)
- `whatsappSent` (boolean)

### Create "reminders" Collection:
Repeat for "reminders" with fields:
- `memberId` (string)
- `memberName` (string)
- `type` (string)
- `message` (string)
- `dueDate` (date)
- `sent` (boolean)
- `sentVia` (array)
- `sentDate` (date)

## Step 5: Configure Environment Variables

1. In your project, copy `.env.example` to `.env.local`
2. Fill in your Firebase credentials:

```
VITE_FIREBASE_API_KEY=AIzaSy...your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

Where to find these:
- Go to Firebase Project Settings
- Copy the config object shown there
- Use the values from that object

## Step 6: Update Firestore Security Rules

For **Development** (current setup):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

For **Production** (add user authentication first):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

To update rules:
1. Go to Firestore → Rules tab
2. Edit the rules
3. Click "Publish"

## Step 7: Test the Connection

1. In your project: `npm run dev`
2. Go to http://localhost:5173
3. Try to add a member
4. Check Firestore Console to see if data appears
5. If data shows up, you're connected! ✅

## Firestore Pricing

### Free Tier (Always Free):
- 1 GB storage
- 50,000 reads/day
- 20,000 writes/day
- 20,000 deletes/day

### After Free Tier:
Pay only for what you use. Example costs:
- $0.06 per 100,000 reads
- $0.18 per 100,000 writes
- Storage: $0.18/GB/month

For a gym with 100-200 members, usually stays free or costs < $1/month.

## Backups

Firebase automatically backs up your data:
1. Go to Firestore → Backups
2. Set backup schedule (recommended: daily)
3. Choose retention period
4. Restore anytime if needed

## Monitoring

Check your Firebase usage:
1. Go to Project Settings → Usage
2. See reads/writes count
3. Storage used
4. Projected costs
5. Set billing alerts if needed

## Common Issues

### "Firebase is not initialized"
- Check environment variables are loaded
- Restart dev server after adding `.env.local`
- Verify variable names match exactly

### "Permission denied" error
- Check Firestore security rules
- Make sure collections are created
- For development, use Test Mode rules above

### Data not saving
- Check browser console for errors
- Verify Firestore rules allow write
- Check collections were created
- Ensure fields match operation

### Slow app
- Check Firestore read/write count
- Optimize queries if needed (usually not required for small gyms)
- Consider caching if scaling up

## Best Practices

1. **Security Rules**: Update for production with authentication
2. **Indexes**: Firestore automatically creates needed indexes
3. **Backups**: Enable automatic backups
4. **Cleanup**: Remove test data periodically
5. **Monitoring**: Check usage dashboard weekly

## Scaling Tips

If your gym grows to 1000+ members:
- Firestore still works great (handles millions)
- Consider adding user authentication
- Implement caching for frequently accessed members
- Archive old billing data to reduce storage

## Support

For Firebase help:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Community](https://stackoverflow.com/questions/tagged/firebase)

---

You're all set! Your database is ready to use.
