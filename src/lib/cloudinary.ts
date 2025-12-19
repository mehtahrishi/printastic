
import { v2 as cloudinary } from 'cloudinary';

// It is crucial to use NEXT_PUBLIC_ for client-side access if needed,
// but for server actions, process.env is correct.
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isConfigured = !!cloudName && !!apiKey && !!apiSecret;

if (isConfigured) {
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    });
}

// Add a console log to verify configuration status on the server
if (typeof window === 'undefined') {
    if (isConfigured) {
        console.log('[Cloudinary] Configuration loaded successfully.');
    } else {
        console.error('[Cloudinary] Configuration Error: Missing environment variables.');
        if (!cloudName) console.error('  - CLOUDINARY_CLOUD_NAME is not set.');
        if (!apiKey) console.error('  - CLOUDINARY_API_KEY is not set.');
        if (!apiSecret) console.error('  - CLOUDINARY_API_SECRET is not set.');
        console.error('Please add the required variables to your .env.local file.');
    }
}


export default cloudinary;
