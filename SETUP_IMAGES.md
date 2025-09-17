# Image Upload Setup Instructions

This document explains how to set up image upload functionality for the AI Prompt Sharing Website.

## Prerequisites

- Supabase project set up
- Database schema already created (run the SQL scripts in the `scripts/` folder)

## Setup Steps

### 1. Create Supabase Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Set the bucket name to `images`
5. Make it **Public** (this allows public read access to uploaded images)
6. Click **Create bucket**

### 2. Set Storage Policies

Run the SQL script to set up the storage policies:

```sql
-- Run this in your Supabase SQL Editor
-- File: scripts/005_setup_storage.sql

-- Create policy to allow public read access to images
CREATE POLICY "Public read access for images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

-- Create policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Create policy to allow authenticated users to update images
CREATE POLICY "Authenticated users can update images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Create policy to allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);
```

### 3. Environment Variables

Make sure your `.env.local` file has the correct Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Features Added

#### Admin Interface
- **Image Upload Component**: A drag-and-drop interface for uploading images
- **Image Preview**: Shows uploaded images in the admin prompt cards
- **Image Management**: Ability to change or remove uploaded images

#### Public Interface
- **Image Display**: Images are displayed on the home page prompt cards
- **Optimized Loading**: Uses Next.js Image component for better performance
- **Fallback Images**: Shows placeholder images when no image is uploaded

### 5. How to Use

1. **Upload Images in Admin**:
   - Go to the admin panel (`/admin`)
   - Click "Add Prompt" or edit an existing prompt
   - Use the image upload component to select and upload an image
   - The image will be automatically uploaded to Supabase Storage
   - The public URL will be saved to the database

2. **View Images on Home Page**:
   - Images are automatically displayed on the home page
   - Each prompt card shows the uploaded image
   - Images are optimized and responsive

### 6. File Structure

```
components/
├── ui/
│   └── image-upload.tsx          # Image upload component
├── admin/
│   └── prompts-manager.tsx       # Updated with image upload
└── home-page.tsx                 # Updated to display images

scripts/
└── 005_setup_storage.sql         # Storage setup script
```

### 7. Technical Details

- **File Size Limit**: 5MB per image
- **Supported Formats**: PNG, JPG, GIF, WebP
- **Storage Location**: `images/prompt-images/` in Supabase Storage
- **Image Optimization**: Uses Next.js Image component with proper sizing
- **Security**: Public read access, authenticated upload/update/delete

### 8. Troubleshooting

**Images not displaying**:
- Check if the Supabase Storage bucket is public
- Verify the storage policies are correctly set
- Check the browser console for CORS errors

**Upload failing**:
- Verify the Supabase credentials are correct
- Check if the storage bucket exists
- Ensure the user has proper authentication

**Performance issues**:
- Images are automatically optimized by Next.js
- Consider implementing image compression if needed
- Monitor storage usage in Supabase dashboard

### 9. Security Considerations

- Images are stored in a public bucket for easy access
- Only authenticated users can upload/modify images
- File type and size validation is implemented
- Consider implementing additional security measures for production use

## Next Steps

1. Test the image upload functionality in the admin panel
2. Verify images display correctly on the home page
3. Consider adding image compression or resizing if needed
4. Monitor storage usage and costs in Supabase

