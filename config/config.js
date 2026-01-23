require('dotenv').config();
const { validateEnvironment } = require('./env-check');

// Validate environment variables on startup
validateEnvironment();

module.exports = {
    port: process.env.PORT || 3000,
    trackingApiKey: process.env.TRACKINGMORE_API_KEY,
    trackingBaseUrl: 'https://api.trackingmore.com/v4',
    database: {
        url: process.env.DATABASE_URL
    },
    session: {
        secret: process.env.SESSION_SECRET
    },
    maman: {
        username: process.env.MAMAN_USERNAME,
        password: process.env.MAMAN_PASSWORD
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1',
        s3Bucket: process.env.S3_BUCKET
    }
};
