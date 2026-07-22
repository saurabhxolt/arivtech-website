'use strict';

const { app } = require('@azure/functions');
const { saveContact } = require('../utils/db');

app.http('contact', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('HTTP trigger function contact processed a request.');
        try {
            const body = await request.json();
            const { name, email, phone, company, message } = body;

            if (!name || !email || !message) {
                return {
                    status: 400,
                    jsonBody: { error: 'Missing required parameters: name, email, and message' }
                };
            }

            // Save to local JSON database
            await saveContact({ name, email, phone: phone || '', company: company || '', message });

            context.log(`Contact Lead Saved: ${name} <${email}>`);

            return {
                status: 200,
                jsonBody: {
                    message: 'Contact details processed successfully.',
                    referenceId: `CON-${Date.now()}`
                }
            };
        } catch (err) {
            context.error('Error processing contact request:', err.message);
            return {
                status: 500,
                jsonBody: { error: 'Failed to process request due to internal error.' }
            };
        }
    }
});