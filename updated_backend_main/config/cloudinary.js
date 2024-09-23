import cloudinary from 'cloudinary';

// Configure cloudinary
cloudinary.v2.config({
  cloud_name: 'dvhro3oye',
  api_key: '749132541522625',
  api_secret: 'ggnw0Lm62MxdcSQDFKA3EWZw5aQ'
});

// Export cloudinary as the default export
export default cloudinary.v2;

