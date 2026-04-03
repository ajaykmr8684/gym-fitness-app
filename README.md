# Shri Ram Fitness - Gym Management System

A modern, beautiful gym management and billing application built with React, Tailwind CSS, and Firebase.

## Features

- **Member Management**: Add, edit, and manage gym members
- **Membership Plans**: Support for monthly, quarterly, and yearly memberships
- **Billing System**: Create and track bills for members
- **Email Integration**: Send bills via email to members
- **WhatsApp Integration**: Send reminders and bills via WhatsApp
- **Reminders**: Automated reminders for membership expiry and payment due dates
- **Dashboard**: Real-time overview of gym statistics
- **Beautiful UI**: Modern, responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Routing**: React Router v7
- **Build Tool**: Vite
- **Icons**: Lucide React
- **HTTP Client**: Axios

## Installation

### Prerequisites

- Node.js 18+ and npm
- Firebase account (free tier available)

### Setup Instructions

1. **Clone or create the project**
   ```bash
   cd gym-billing-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project (name it "Shri Ram Fitness Gym Management")
   - Enable Firestore Database
   - Get your Firebase configuration credentials

4. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Create Firestore Collections**
   In Firebase Console, create these collections:
   - `members`
   - `bills`
   - `reminders`

6. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

This will create a production-ready build in the `dist` folder.

## Deployment to Vercel

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-github-repo-url
git push -u origin main
```

### Step 2: Deploy on Vercel
1. Go to [Vercel](https://vercel.com/)
2. Sign up or log in
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables from `.env.local`
6. Click "Deploy"

Your app will be live at a Vercel domain!

## Project Structure

```
gym-billing-app/
├── src/
│   ├── components/        # Reusable components
│   ├── pages/            # Page components
│   ├── context/          # React Context for state management
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   │   ├── db.ts         # Database operations
│   │   ├── firebase.ts   # Firebase configuration
│   │   └── notifications.ts  # Email/WhatsApp functions
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
└── package.json          # Dependencies
```

## Key Pages

### Dashboard
- Overview of gym statistics
- Active members count
- Pending bills
- Revenue tracking
- Quick action buttons

### Members
- View all members with search functionality
- Add new members with membership plans
- Edit member details
- Delete members
- Track membership expiry dates

### Billing
- Create bills for members
- View all bills with status tracking
- Send bills via email
- Send reminders via WhatsApp
- Mark bills as paid

### Reminders
- Create reminders for membership expiry
- Payment due/overdue reminders
- Send reminders via email and WhatsApp
- Track reminder status

## Membership Plans

- **Monthly**: ₹500 for 30 days
- **Quarterly**: ₹1,400 for 90 days
- **Yearly**: ₹5,000 for 365 days

(You can modify these in `utils/db.ts`)

## Email and WhatsApp Integration

### Current Status
Currently, the app has placeholder implementations for:
- Email sending (using the `sendBillEmail` function)
- WhatsApp sending (using the `sendBillWhatsApp` function)

### To Enable Real Email Sending
1. Sign up for a service like:
   - SendGrid (free tier: 100 emails/day)
   - Mailgun
   - AWS SES

2. Update the `sendBillEmail` function in `src/utils/notifications.ts`

### To Enable Real WhatsApp Sending
1. Sign up for WhatsApp Cloud API or Twilio
2. Update the `sendBillWhatsApp` function in `src/utils/notifications.ts`

## Environment Variables

Create a `.env.local` file with:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

## Future Enhancements

- [ ] User authentication (admin login)
- [ ] Member app (members can view their bills)
- [ ] Automated reminder scheduling
- [ ] Report generation (PDF/Excel)
- [ ] Payment gateway integration
- [ ] SMS notifications
- [ ] Member attendance tracking
- [ ] Multiple branch support
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

## Troubleshooting

### Firebase connection issues
- Ensure Firebase credentials are correct in `.env.local`
- Check that Firestore is enabled in Firebase Console
- Verify Firestore security rules allow read/write

### Notifications not working
- Email/WhatsApp functions are currently placeholders
- Implement actual service integration (see above)

### Build errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

## Support

For issues or questions, check the following:
1. Firebase Console for database status
2. Browser console for error messages
3. Vite logs during development

## License

ISC

## Credits

Built with ❤️ for Shri Ram Fitness

---

**Version**: 1.0.0  
**Last Updated**: April 2026
