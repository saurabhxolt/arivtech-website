'use strict';

const { app } = require('@azure/functions');
const { getConfig, saveConfig, getAdmin, saveAdmin, readStore } = require('../utils/db');
const { requireAuth, hashPassword } = require('../utils/auth');

// ─── GET/PUT /api/admin/config ────────────────────────────────────────────────

app.http('admin-config', {
  methods: ['GET', 'PUT'],
  authLevel: 'anonymous',
  route: 'mgmt/config',
  handler: async (request, context) => {
    const auth = requireAuth(request);
    if (!auth) {
      return { status: 401, jsonBody: { error: 'Unauthorized. Please login.' } };
    }

    if (request.method === 'GET') {
      const config = await getConfig(); // null if never saved by admin
      return {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: config  // frontend falls back to siteConfig.js if null
      };
    }

    if (request.method === 'PUT') {
      let body;
      try {
        body = await request.json();
      } catch {
        return { status: 400, jsonBody: { error: 'Invalid JSON body.' } };
      }
      if (!body || typeof body !== 'object') {
        return { status: 400, jsonBody: { error: 'Config body must be a JSON object.' } };
      }
      await saveConfig(body);
      context.log(`Site config updated by: ${auth.username}`);
      return { status: 200, jsonBody: { message: 'Configuration saved successfully.' } };
    }
  }
});

// ─── GET /api/admin/submissions ───────────────────────────────────────────────

app.http('admin-submissions', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'mgmt/submissions',
  handler: async (request, context) => {
    const auth = requireAuth(request);
    if (!auth) {
      return { status: 401, jsonBody: { error: 'Unauthorized.' } };
    }
    const store = await readStore();
    return {
      status: 200,
      jsonBody: {
        contacts: store.contacts || [],
        careers: store.careers || [],
        internships: store.internships || []
      }
    };
  }
});

// ─── PUT /api/admin/password ──────────────────────────────────────────────────

app.http('admin-password', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'mgmt/password',
  handler: async (request, context) => {
    const auth = requireAuth(request);
    if (!auth) {
      return { status: 401, jsonBody: { error: 'Unauthorized.' } };
    }
    let body;
    try {
      body = await request.json();
    } catch {
      return { status: 400, jsonBody: { error: 'Invalid JSON body.' } };
    }
    const { currentPassword, newPassword } = body || {};
    if (!currentPassword || !newPassword) {
      return { status: 400, jsonBody: { error: 'currentPassword and newPassword are required.' } };
    }
    if (newPassword.length < 8) {
      return { status: 400, jsonBody: { error: 'New password must be at least 8 characters.' } };
    }
    const admin = await getAdmin();
    if (hashPassword(currentPassword) !== admin.passwordHash) {
      return { status: 400, jsonBody: { error: 'Current password is incorrect.' } };
    }
    admin.passwordHash = hashPassword(newPassword);
    await saveAdmin(admin);
    context.log(`Admin password changed by: ${auth.username}`);
    return { status: 200, jsonBody: { message: 'Password updated successfully.' } };
  }
});