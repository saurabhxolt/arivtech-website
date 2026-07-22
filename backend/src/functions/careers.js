'use strict';

const { app } = require('@azure/functions');
const { saveCareerApplication } = require('../utils/db');
const { createBlobServiceClient } = require('../utils/blobClient');

const connectionString = process.env.AzureWebJobsStorage || 'UseDevelopmentStorage=true';
const blobServiceClient = createBlobServiceClient(connectionString);

app.http('careers', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('HTTP trigger function careers processed a request.');
        try {
            const formData = await request.formData();

            const role = formData.get('role');
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const file = formData.get('resume');

            if (!role || !name || !email || !phone || !file) {
                return {
                    status: 400,
                    jsonBody: { error: 'Missing required parameters. Form must contain role, name, email, phone, and resume file.' }
                };
            }

            // Upload resume to Azure Blob / Azurite
            const fileName = `${Date.now()}-${file.name || 'resume.pdf'}`;
            const fileBuffer = Buffer.from(await file.arrayBuffer());

            const containerClient = blobServiceClient.getContainerClient('careers');
            await containerClient.createIfNotExists();

            const blockBlobClient = containerClient.getBlockBlobClient(fileName);
            await blockBlobClient.uploadData(fileBuffer);
            const resumeUrl = blockBlobClient.url;

            // Save application record to local JSON database
            await saveCareerApplication({ role, name, email, phone, resumeUrl });

            context.log(`Job Application Saved: ${name} for ${role}`);

            return {
                status: 200,
                jsonBody: {
                    message: 'Job application processed successfully',
                    resumeUrl
                }
            };
        } catch (error) {
            context.error('Error processing job application:', error.message);
            return {
                status: 500,
                jsonBody: { error: 'Internal Server Error' }
            };
        }
    }
});