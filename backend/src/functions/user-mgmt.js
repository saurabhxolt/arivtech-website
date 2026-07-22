'use strict';

const { app } = require('@azure/functions');
const { getUsers, saveUsers } = require('../utils/db');
const { requireRole, hashPassword } = require('../utils/auth');

app.http('user-mgmt', {
  methods: ['GET', 'POST', 'DELETE'],
  authLevel: 'anonymous',
  route: 'mgmt/users',
  handler: async (request, context) => {
    try {
      // Require Admin authentication
      const auth = requireRole(request, 'admin');
      if (!auth) {
        return { status: 401, jsonBody: { error: 'Unauthorized. Admin role required.' } };
      }

      if (request.method === 'GET') {
        const users = await getUsers();
        // Remove passwordHash before returning to frontend
        const safeUsers = users.map(({ passwordHash, ...user }) => user);
        return { status: 200, jsonBody: safeUsers };
      }

      if (request.method === 'POST') {
        const body = await request.json();
        const { username, password, role, name } = body || {};

        if (!username || !password || !role || !name) {
          return { status: 400, jsonBody: { error: 'Username, password, role, and name are required.' } };
        }

        if (role !== 'employee' && role !== 'intern') {
          return { status: 400, jsonBody: { error: 'Invalid role. Supported roles are: employee, intern.' } };
        }

        const users = await getUsers();
        const exists = users.some(u => u.username.toLowerCase() === username.toLowerCase());
        if (exists) {
          return { status: 400, jsonBody: { error: 'Username already exists.' } };
        }

        const newUser = {
          username: username.trim(),
          passwordHash: hashPassword(password),
          role,
          name: name.trim(),
          createdAt: new Date().toISOString()
        };

        users.push(newUser);
        await saveUsers(users);

        context.log(`Created new portal user account: "${username}" (${role}) by admin`);
        
        // Return without password hash
        const { passwordHash, ...safeUser } = newUser;
        return { status: 201, jsonBody: safeUser };
      }

      if (request.method === 'DELETE') {
        const urlParams = new URL(request.url).searchParams;
        const usernameToDelete = urlParams.get('username');

        if (!usernameToDelete) {
          return { status: 400, jsonBody: { error: 'Query parameter "username" is required for deletion.' } };
        }

        const users = await getUsers();
        const filteredUsers = users.filter(u => u.username.toLowerCase() !== usernameToDelete.toLowerCase());

        if (users.length === filteredUsers.length) {
          return { status: 404, jsonBody: { error: 'User not found.' } };
        }

        await saveUsers(filteredUsers);
        context.log(`Deleted portal user account: "${usernameToDelete}" by admin`);
        return { status: 200, jsonBody: { message: `User "${usernameToDelete}" deleted successfully.` } };
      }

      return { status: 405, jsonBody: { error: 'Method not allowed.' } };
    } catch (err) {
      context.error('User management error:', err.message);
      return { status: 500, jsonBody: { error: 'Internal server error.' } };
    }
  }
});
