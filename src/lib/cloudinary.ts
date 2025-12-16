import { v2 as cloudinary } from 'cloudinary';

const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)?.trim();
const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});

// Validate configuration on server side only
if (typeof window === 'undefined') {
    const isConfigured = cloudName && apiKey && apiSecret;
    
    if (!isConfigured) {
        console.error('[Cloudinary] Configuration Error - Missing environment variables:');
        if (!cloudName) console.error('  ❌ CLOUDINARY_CLOUD_NAME is not set');
        if (!apiKey) console.error('  ❌ CLOUDINARY_API_KEY is not set');
        if (!apiSecret) console.error('  ❌ CLOUDINARY_API_SECRET is not set');
        console.error('\n  Please add these to your .env.local file:');
        console.error('  CLOUDINARY_CLOUD_NAME=your_cloud_name');
        console.error('  CLOUDINARY_API_KEY=your_api_key');
        console.error('  CLOUDINARY_API_SECRET=your_api_secret\n');
    } else {
        console.log('[Cloudinary] ✓ Configuration loaded successfully');
        console.log(`[Cloudinary] Cloud Name: ${cloudName}`);
    }
}

export default cloudinary;
