# Email Setup Guide - Firebase Cloud Functions

## Problem Fixed ✅
The email sending was failing because it was trying to call SendGrid API directly from the browser, which doesn't work due to CORS restrictions.

## Solution
We've now set up **Firebase Cloud Functions** to handle email sending securely on the server-side.

---

## Setup Instructions

### Step 1: Set Environment Variable in Firebase Cloud Functions

You need to tell Firebase about your SendGrid API key.

**Option A: Using Firebase CLI (Recommended)**

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

```

**Option B: Using Firebase Console**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `shree-ram-fitness-gym`
3. Go to Functions → Runtime Configuration
4. Add these variables:
   - `sendgrid.api_key`: Your SendGrid API key
   - `sendgrid.from_email`: shreeramfitnesshamirpur@gmail.com

### Step 2: Install Function Dependencies

```bash
cd functions
npm install
cd ..
```

### Step 3: Deploy Cloud Functions

```bash
# Build and deploy functions
firebase deploy --only functions

# You should see:
# ✓ functions[sendBillEmail] deployed successfully
# ✓ functions[sendReminderEmail] deployed successfully
```

### Step 4: Test the Email Feature

1. Start the app: `npm run dev`
2. Go to **Billing** page
3. Create a new bill
4. Click **Email Bill** button
5. Check the member's email inbox

---

## How It Works

### Before (❌ Broken)
```
Frontend Browser → SendGrid API (BLOCKED by CORS)
```

### After (✅ Working)
```
Frontend Browser → Firebase Cloud Functions → SendGrid API
```

The cloud function:
1. Receives email data from your app
2. Verifies the request
3. Sends the email using SendGrid API securely
4. Returns success/error status to your app

---

## Troubleshooting

### Error: "Email sending failed"

**Check 1:** Are functions deployed?
```bash
firebase functions:list
```
You should see `sendBillEmail` and `sendReminderEmail`

**Check 2:** Check function logs
```bash
firebase functions:log
```

**Check 3:** Verify environment variables are set
```bash
firebase functions:config:get sendgrid
```
Should show your API key and from_email

**Check 4:** Test with Firebase emulator (development)
```bash
firebase emulators:start --only functions
```

### Error: "SendGrid API key is invalid"
- Verify your API key from SendGrid dashboard
- Make sure you set it correctly: `firebase functions:config:set sendgrid.api_key="YOUR_KEY"`

### Email not received
- Check the Gmail spam folder
- Verify recipient email is correct
- Check Firebase function logs: `firebase functions:log`

---

## Files Modified

- ✅ `functions/src/sendEmail.ts` - Firebase Cloud Functions for email
- ✅ `functions/package.json` - Function dependencies
- ✅ `functions/tsconfig.json` - TypeScript config
- ✅ `src/utils/notifications.ts` - Updated to use cloud functions
- ✅ `src/utils/firebase.ts` - Added functions initialization
- ✅ `src/vite-env.d.ts` - TypeScript environment types

---

## Quick Commands

```bash
# Deploy functions
firebase deploy --only functions

# View logs
firebase functions:log

# Set SendGrid API key
firebase functions:config:set sendgrid.api_key="YOUR_KEY"
firebase functions:config:set sendgrid.from_email="your@email.com"

# Start emulator (for testing locally)
firebase emulators:start --only functions
```

---

## Next Steps

After email is working, you can also enable:
- WhatsApp notifications (using Twilio)
- SMS notifications
- Automatic reminder schedules

Let me know if you need help with any of these!
