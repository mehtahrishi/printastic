
# Cloudinary File Upload Setup Guide

This guide will help you configure the necessary environment variables to enable file uploads to Cloudinary in your application.

## Setup Instructions

### 1. Get Your Cloudinary Credentials

1.  Go to the [Cloudinary Console](https://console.cloudinary.com/).
2.  Sign up for a free account or log in if you already have one.
3.  From your main dashboard, you will find your account details. You need to copy the following three values:
    *   **Cloud Name**
    *   **API Key**
    *   **API Secret**

### 2. Configure Environment Variables

You need to create a special file to store these secret credentials so your application can use them without exposing them in your code.

1.  In the root directory of your project, create a new file named `.env.local`.
2.  Open this new file and add the following lines, replacing the placeholder values with the actual credentials you copied from your Cloudinary dashboard:

    ```env
    # .env.local

    # Cloudinary Credentials
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # Optional: Specify a folder in Cloudinary to upload files to
    CLOUDINARY_FOLDER=printastic_uploads
    ```

    **Important:** Make sure to replace `your_cloud_name`, `your_api_key`, and `your_api_secret` with your actual values.

### 3. Restart Your Development Server

After you have created or modified the `.env.local` file, you **must restart** your development server for the changes to take effect.

1.  Stop the current server by pressing `Ctrl+C` in your terminal.
2.  Start it again by running `npm run dev`.

### 4. Verify Configuration

When the server starts, check the terminal output for a confirmation message:

*   **Success:** `[Cloudinary] Configuration loaded successfully.`
*   **Error:** If you see `[Cloudinary] Configuration Error`, it means one or more variables are missing. The terminal will tell you which specific variable is not set. Double-check your `.env.local` file and ensure all three credentials are correct.

## How to Test the Upload

1.  Navigate to the `/admin/products` page in your application.
2.  Click "Add Product" or click the "Edit" icon on an existing product.
3.  Fill in the product details.
4.  In the "Product Images" section, either drag and drop image files or click the area to open the file selector. Select 1 to 5 images.
5.  You should see previews of your selected images appear.
6.  Click "Create Product" or "Update Product" to save.

Your images will now be uploaded to your Cloudinary account and the URLs will be saved with the product.
