# Cloudinary File Upload Setup Guide

## Issue Fixed
The file upload functionality wasn't working due to:
1. **Improper file validation** - Files weren't being properly validated before upload
2. **Missing error logging** - No console output to debug issues
3. **File object handling** - FileList wasn't being converted to proper File array
4. **Missing configuration validation** - No check if Cloudinary credentials were set

## Setup Instructions

### 1. Get Your Cloudinary Credentials

1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Sign up or log in
3. From your dashboard, copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2. Configure Environment Variables

Create a `.env.local` file in the root of your project (or add to existing):

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=INHOUSE
```

**Important:** Replace the placeholder values with your actual Cloudinary credentials.

### 3. Restart Your Development Server

After adding environment variables, restart your Next.js server:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## Testing the Upload

1. Navigate to `/admin/products`
2. Click "Create Product" or edit an existing product
3. Fill in the required fields
4. Select 1-5 images using the file input
5. Click "Create Product" or "Update Product"

## Debugging

Check your browser console and server terminal for detailed logs:

### Browser Console
- `[FileInput]` - File selection events
- `[ProductForm]` - Form submission details

### Server Terminal
- `[Cloudinary] Configuration loaded successfully` - Config is OK
- `[Upload]` - File processing logs
- `[Cloudinary]` - Upload progress and results
- `[CreateProduct]` / `[UpdateProduct]` - Action execution logs

### Common Issues

#### "Configuration Error - Missing environment variables"
- **Solution:** Make sure `.env.local` file exists and contains all three Cloudinary variables
- Restart your dev server after creating/updating `.env.local`

#### "No images were uploaded successfully"
- **Solution:** Check browser console for `[FileInput]` logs to ensure files are being selected
- Verify the files are valid images (JPEG, PNG, etc.)
- Check file sizes (very large files may timeout)

#### Upload takes long time or times out
- **Solution:** Ensure your internet connection is stable
- Try with smaller image files first
- Check Cloudinary dashboard for quota limits

#### "At least one image is required"
- **Solution:** This appears when no valid image files were uploaded
- Make sure you're selecting actual image files
- Check that files are not corrupted

## File Upload Improvements Made

1. **Better File Validation**
   - Checks file is valid File object
   - Validates file size > 0
   - Ensures file type starts with 'image/'
   - Filters out invalid/empty files

2. **Comprehensive Logging**
   - Every step of the upload process is logged
   - File details (name, size, type) are shown
   - Success/failure messages for each upload

3. **Proper File Handling**
   - FileList converted to Array for proper iteration
   - Files attached to FormData with original filename
   - File metadata preserved during upload

4. **Configuration Validation**
   - Checks if Cloudinary is configured on startup
   - Shows clear error messages for missing credentials
   - Validates which specific env vars are missing

## File Structure

- `src/lib/cloudinary.ts` - Cloudinary configuration with validation
- `src/app/actions/products.ts` - Server actions with upload logic
- `src/components/admin/products/product-form.tsx` - Form with file input

## Support

If you continue to have issues:
1. Check server terminal for `[Cloudinary]` error messages
2. Verify your Cloudinary credentials are correct
3. Ensure your Cloudinary account is active and within quota
4. Check browser Network tab for failed requests
