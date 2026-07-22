'use strict';

const { app } = require('@azure/functions');
const { getConfig } = require('../utils/db');
const { defaultSiteConfig } = require('../utils/defaultConfig');

app.http('site-config', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.log('Site config requested.');
    // db.json config takes priority; falls back to centralized defaults
    const savedConfig = await getConfig();
    const config = savedConfig || defaultSiteConfig;
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
      jsonBody: config
    };
  }
});