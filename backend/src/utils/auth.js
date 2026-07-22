'use strict';

const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'arivtek-admin-jwt-secret-2026-x7k9p';
const SALT = 'arivtek-admin-salt-v1';

/**
 * Signs a JWT using HMAC-SHA256 (Node built-in crypto, no external deps).
 */
function signJWT(payload, expiresInHours = 48) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + expiresInHours * 3600;
  const body = Buffer.from(JSON.stringify({ ...payload, exp, iat: Math.floor(Date.now() / 1000) })).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

/**
 * Verifies a JWT and returns the payload, or null if invalid/expired.
 */
function verifyJWT(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
    if (sig !== expected) return null;
    const data = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (data.exp && data.exp < Math.floor(Date.now() / 1000)) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * SHA-256 password hash with a fixed salt.
 */
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + SALT).digest('hex');
}

/**
 * Extracts Bearer token from the Authorization header of an Azure Function request.
 */
function extractBearerToken(request) {
  const auth = (request.headers.get && request.headers.get('authorization')) ||
               (request.headers.get && request.headers.get('Authorization')) || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : null;
}

/**
 * Verifies auth on an incoming request. Returns payload or null.
 */
function requireAuth(request) {
  const token = extractBearerToken(request);
  return verifyJWT(token);
}

/**
 * Verifies auth and ensures the user has one of the allowed roles.
 * Returns payload or null.
 */
function requireRole(request, allowedRoles = []) {
  const payload = requireAuth(request);
  if (!payload) return null;

  const userRole = payload.role || 'intern';
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (roles.includes(userRole)) {
    return payload;
  }
  return null;
}

module.exports = { signJWT, verifyJWT, hashPassword, requireAuth, requireRole };