'use strict';

const { app } = require('@azure/functions');
const { getAdmin, saveAdmin } = require('../utils/db');
const { hashPassword, signJWT } = require('../utils/auth');

app.http('admin-login', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'mgmt/login',
  handler: async (request, context) => {
    try {
      const body = await request.json();
      const { username, password } = body || {};

      if (!username || !password) {
        return { status: 400, jsonBody: { error: 'Username and password are required.' } };
      }

      const admin = await getAdmin();
      if (!admin) {
        return { status: 500, jsonBody: { error: 'Admin configuration error.' } };
      }

      const hash = hashPassword(password);
      if (username !== admin.username || hash !== admin.passwordHash) {
        context.log(`Failed login attempt for username: "${username}"`);
        return { status: 401, jsonBody: { error: 'Invalid credentials. Please try again.' } };
      }

      const token = signJWT({ username, role: 'admin' });
      context.log(`Admin login successful: ${username}`);

      return {
        status: 200,
        jsonBody: { token, username }
      };
    } catch (err) {
      context.error('Login error:', err.message);
      return { status: 500, jsonBody: { error: 'Internal server error.' } };
    }
  }
});