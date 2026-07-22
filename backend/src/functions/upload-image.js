'use strict';

const { app } = require('@azure/functions');
const { requireAuth } = require('../utils/auth');
const { createBlobServiceClient } = require('../utils/blobClient');

const connectionString = process.env.AzureWebJobsStorage || 'UseDevelopmentStorage=true';
const blobServiceClient = createBlobServiceClient(connectionString);

app.http('upload-image', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'mgmt/upload-image',
  handler: async (request, context) => {
    try {
      // Require admin authentication
      const auth = requireAuth(request);
      if (!auth) {
        return { status: 401, jsonBody: { error: 'Unauthorized.' } };
      }

      const formData = await request.formData();
      const file = formData.get('image');
      if (!file) {
        return { status: 400, jsonBody: { error: 'No image file uploaded.' } };
      }

      const fileName = `${Date.now()}-${file.name || 'image.jpg'}`;
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      const containerClient = blobServiceClient.getContainerClient('images');
      // Create the container if it doesn't exist, and force public blob read access
      await containerClient.createIfNotExists({ access: 'blob' });
      await containerClient.setAccessPolicy('blob');

      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      await blockBlobClient.uploadData(fileBuffer, {
        blobHTTPHeaders: { blobContentType: file.type || 'image/jpeg' }
      });

      const imageUrl = blockBlobClient.url;
      context.log(`Image uploaded successfully to Azure Blob: ${imageUrl}`);

      return {
        status: 200,
        jsonBody: { imageUrl }
      };
    } catch (err) {
      context.error('Image upload error:', err.message);
      return { status: 500, jsonBody: { error: 'Internal server error during upload.' } };
    }
  }
});
