'use strict';

const { app } = require('@azure/functions');
const { saveInternshipApplication } = require('../utils/db');
const { createBlobServiceClient } = require('../utils/blobClient');

const connectionString = process.env.AzureWebJobsStorage || 'UseDevelopmentStorage=true';
const blobServiceClient = createBlobServiceClient(connectionString);

app.http('internship', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('HTTP trigger function internship processed a request.');
        try {
            const formData = await request.formData();

            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const college = formData.get('college');
            const domain = formData.get('domain');
            const file = formData.get('resume');

            if (!name || !email || !phone || !college || !domain || !file) {
                return {
                    status: 400,
                    jsonBody: { error: 'Missing required parameters. Form must contain name, email, phone, college, domain, and resume file.' }
                };
            }

            // Upload resume to Azure Blob / Azurite
            const fileName = `${Date.now()}-${file.name || 'resume.pdf'}`;
            const fileBuffer = Buffer.from(await file.arrayBuffer());

            const containerClient = blobServiceClient.getContainerClient('internships');
            await containerClient.createIfNotExists();

            const blockBlobClient = containerClient.getBlockBlobClient(fileName);
            await blockBlobClient.uploadData(fileBuffer);
            const resumeUrl = blockBlobClient.url;

            // Save application record to local JSON database
            await saveInternshipApplication({ name, email, phone, college, domain, resumeUrl });

            context.log(`Internship Application Saved: ${name} from ${college}`);

            return {
                status: 200,
                jsonBody: {
                    message: 'Internship application processed successfully',
                    resumeUrl
                }
            };
        } catch (error) {
            context.error('Error processing internship application:', error.message);
            return {
                status: 500,
                jsonBody: { error: 'Internal Server Error' }
            };
        }
    }
});