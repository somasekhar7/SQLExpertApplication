# GCP & Firebase Setup Guide

This guide will help you set up Google Cloud Platform (GCP) and Firebase for the Contact & Support system with LLM chatbot integration.

## Prerequisites
- Google Cloud Platform account
- Firebase project
- Node.js installed

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `sql-mastery-hub`
4. Enable Google Analytics (optional)
5. Create project

## Step 2: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose production mode
4. Select region (choose closest to your users)
5. Click "Enable"

### Create Collections:

**Collection: `support_tickets`**
```javascript
{
  userId: string,
  userEmail: string,
  userName: string,
  subject: string,
  description: string,
  category: 'bug' | 'feature_request' | 'technical_issue' | 'account' | 'other',
  status: 'open' | 'in_progress' | 'resolved' | 'closed',
  priority: 'low' | 'medium' | 'high',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Collection: `ticket_responses`**
```javascript
{
  ticketId: string,
  responderId: string,
  responderName: string,
  isAdminResponse: boolean,
  message: string,
  createdAt: timestamp
}
```

## Step 3: Set Up Firebase Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Enable Email/Password provider
4. (Optional) Enable Google, GitHub providers

## Step 4: Firebase Security Rules

### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Support tickets - users can only read/write their own
    match /support_tickets/{ticketId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || hasRole('admin'));
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        (resource.data.userId == request.auth.uid || hasRole('admin'));
    }
    
    // Ticket responses - users can read their ticket responses
    match /ticket_responses/{responseId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && hasRole('admin');
    }
    
    // Helper function for admin role check
    function hasRole(role) {
      return request.auth.token.get('role', '') == role;
    }
  }
}
```

## Step 5: Install Firebase SDK

```bash
npm install firebase
```

## Step 6: Firebase Configuration

Create `src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

Get these values from Firebase Console → Project Settings → Your apps

## Step 7: Enable Gmail API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Go to "APIs & Services" → "Library"
4. Search for "Gmail API"
5. Click "Enable"

## Step 8: Create Service Account for Gmail

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Name: `gmail-sender`
4. Grant role: "Project → Editor"
5. Click "Done"
6. Click on created service account
7. Go to "Keys" tab
8. Click "Add Key" → "Create new key" → JSON
9. Download and save the JSON file securely

## Step 9: Set Up Cloud Functions

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Functions:
```bash
firebase init functions
```

4. Choose JavaScript/TypeScript
5. Install dependencies

## Step 10: Create Cloud Functions

### Function: Submit Ticket & Send Email

Create `functions/src/submitTicket.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password // Use App Password
  }
});

exports.submitTicket = functions.https.onCall(async (data, context) => {
  // Verify authentication
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Must be authenticated to submit ticket'
    );
  }

  const { subject, description, category, email, name } = data;

  try {
    // Create ticket in Firestore
    const ticketRef = await admin.firestore().collection('support_tickets').add({
      userId: context.auth.uid,
      userEmail: email,
      userName: name,
      subject,
      description,
      category,
      status: 'open',
      priority: 'medium',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Send confirmation email
    await transporter.sendMail({
      from: functions.config().gmail.email,
      to: email,
      subject: `Ticket Received: ${subject}`,
      html: `
        <h2>Thank you for contacting us!</h2>
        <p>We've received your support ticket:</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Ticket ID:</strong> ${ticketRef.id}</p>
        <p>Our team will review your issue and respond within 24-48 hours.</p>
      `
    });

    return { success: true, ticketId: ticketRef.id };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

### Set Gmail Configuration:
```bash
firebase functions:config:set gmail.email="your-email@gmail.com"
firebase functions:config:set gmail.password="your-app-password"
```

**Note:** Use Gmail App Password, not your regular password:
- Go to Google Account → Security → 2-Step Verification
- At the bottom, click "App passwords"
- Generate new app password for "Mail"

## Step 11: Integrate LLM for Chatbot

### Option A: OpenAI GPT

1. Get API key from [OpenAI](https://platform.openai.com/)
2. Set config:
```bash
firebase functions:config:set openai.key="your-openai-key"
```

3. Create chatbot function (`functions/src/chatbot.js`):
```javascript
const functions = require('firebase-functions');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: functions.config().openai.key,
});
const openai = new OpenAIApi(configuration);

exports.chatbot = functions.https.onCall(async (data, context) => {
  const { message, conversationHistory } = data;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful SQL learning assistant. Help users with SQL queries, syntax, and best practices."
        },
        ...conversationHistory,
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return { 
      response: completion.data.choices[0].message.content 
    };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

### Option B: Google Vertex AI (Recommended for GCP)

1. Enable Vertex AI API in GCP Console
2. No API key needed (uses service account)

3. Create function:
```javascript
const functions = require('firebase-functions');
const { VertexAI } = require('@google-cloud/vertexai');

const vertex_ai = new VertexAI({
  project: 'YOUR_PROJECT_ID',
  location: 'us-central1'
});

exports.chatbot = functions.https.onCall(async (data, context) => {
  const { message } = data;

  const model = 'gemini-pro';
  const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: model,
  });

  const prompt = `You are a helpful SQL learning assistant. 
  User question: ${message}
  
  Provide a clear, concise answer focused on SQL concepts.`;

  const result = await generativeModel.generateContent(prompt);
  const response = result.response.candidates[0].content.parts[0].text;

  return { response };
});
```

## Step 12: Deploy Functions

```bash
firebase deploy --only functions
```

## Step 13: Update Frontend to Use Firebase

### Update ContactForm.tsx:

```typescript
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

// In onSubmit:
const submitTicket = httpsCallable(functions, 'submitTicket');
const result = await submitTicket(data);
```

### Update ChatbotAssistant.tsx:

```typescript
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';

// In handleSend:
const chatbot = httpsCallable(functions, 'chatbot');
const result = await chatbot({
  message: input,
  conversationHistory: messages
});
```

## Step 14: Environment Variables

Create `.env.local`:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Cost Estimation

### Firestore:
- Free tier: 1GB storage, 50K reads/day, 20K writes/day
- Estimated cost: $0-5/month for small to medium usage

### Cloud Functions:
- Free tier: 2M invocations/month
- Estimated cost: $0-10/month

### Gmail API:
- Free up to daily limits (10,000 emails/day)

### LLM Costs:
- **OpenAI GPT-4**: ~$0.03-0.06 per 1K tokens (~$3-10/month for moderate use)
- **Vertex AI (Gemini)**: ~$0.0005-0.001 per 1K characters (~$1-5/month)

**Total Estimated Cost: $5-25/month for moderate usage**

## Security Best Practices

1. Never commit Firebase config with real keys to Git
2. Use environment variables for sensitive data
3. Enable Firebase App Check for additional security
4. Implement rate limiting on Cloud Functions
5. Regularly review Firestore security rules
6. Use HTTPS only
7. Implement proper input validation
8. Set up monitoring and alerts

## Monitoring & Logging

1. Firebase Console → Functions → Logs
2. GCP Console → Logging → Logs Explorer
3. Set up error alerting via Cloud Monitoring
4. Track usage in Firebase Analytics

## Testing

1. Test ticket submission locally
2. Test email delivery
3. Test chatbot responses
4. Test authentication flow
5. Load test Cloud Functions
6. Security audit with Firebase Emulator Suite

## Next Steps

1. Implement admin dashboard for managing tickets
2. Add file upload support (Firebase Storage)
3. Implement real-time notifications
4. Add analytics tracking
5. Set up automated responses for common issues
6. Implement ticket escalation workflow

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [GCP Documentation](https://cloud.google.com/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Vertex AI Docs](https://cloud.google.com/vertex-ai/docs)
