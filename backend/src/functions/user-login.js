'use strict';

const { app } = require('@azure/functions');
const { getUserByUsername } = require('../utils/db');
const { hashPassword, signJWT } = require('../utils/auth');

app.http('user-login', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'mgmt/user-login',
  handler: async (request, context) => {
    try {
      const body = await request.json();
      const { username, password } = body || {};

      if (!username || !password) {
        return { status: 400, jsonBody: { error: 'Username and password are required.' } };
      }

      const user = await getUserByUsername(username);
      if (!user) {
        return { status: 401, jsonBody: { error: 'Invalid credentials. Please try again.' } };
      }

      const hash = hashPassword(password);
      if (hash !== user.passwordHash) {
        context.log(`Failed user login attempt for: "${username}"`);
        return { status: 401, jsonBody: { error: 'Invalid credentials. Please try again.' } };
      }

      // Sign JWT with username and role
      const token = signJWT({ username: user.username, role: user.role, name: user.name });
      context.log(`User login successful: "${username}" (${user.role})`);

      return {
        status: 200,
        jsonBody: { token, username: user.username, role: user.role, name: user.name }
      };
    } catch (err) {
      context.error('User login error:', err.message);
      return { status: 500, jsonBody: { error: 'Internal server error.' } };
    }
  }
});
