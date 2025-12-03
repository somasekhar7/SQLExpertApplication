# Cloudinary Setup Instructions

## Steps to Configure Cloudinary for Profile Picture Uploads

1. **Create a Cloudinary Account**
   - Go to [https://cloudinary.com](https://cloudinary.com)
   - Sign up for a free account

2. **Get Your Cloud Name**
   - After logging in, you'll see your **Cloud Name** on the dashboard
   - Copy this value

3. **Create an Upload Preset**
   - Go to Settings → Upload
   - Scroll down to "Upload presets"
   - Click "Add upload preset"
   - Set **Signing Mode** to "Unsigned"
   - Set **Folder** to "profile_pictures" (optional)
   - Click "Save"
   - Copy the **Preset name**

4. **Update the Code**
   - Open `src/pages/Profile.tsx`
   - Find the `handleImageUpload` function (around line 57)
   - Replace `YOUR_CLOUD_NAME` with your actual Cloud Name
   - Replace `YOUR_UPLOAD_PRESET` with your Upload Preset name

   ```typescript
   const widget = window.cloudinary.createUploadWidget(
     {
       cloudName: 'your-actual-cloud-name', // Replace this
       uploadPreset: 'your-actual-preset-name', // Replace this
       // ... rest of config
     }
   ```

5. **Test the Upload**
   - Go to your Profile page
   - Hover over your avatar
   - Click the camera icon
   - Upload an image from your computer

## Features Included
- ✅ Image cropping with 1:1 aspect ratio
- ✅ Camera access for taking photos
- ✅ Automatic avatar update in header and profile
- ✅ Images stored in Cloudinary CDN

## Troubleshooting
- If you see "Please add Cloudinary configuration first", make sure you've replaced the placeholder values
- Make sure your upload preset is set to "Unsigned" mode
- Check browser console for any errors
