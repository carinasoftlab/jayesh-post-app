import jwt from 'jsonwebtoken';

const COOKIE_NAME = 'jid';

export function signToken(userId) {
  const secret = process.env.JWT_SECRET || 'Mya0rUgyXVgrld/eT2opaKGfDIW+WRctPdehEJvG4M0Kqg7eH8lDfWYPi26n89kk';
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
}

export function verifyToken(token) {
  const secret = process.env.JWT_SECRET || 'Mya0rUgyXVgrld/eT2opaKGfDIW+WRctPdehEJvG4M0Kqg7eH8lDfWYPi26n89kk';
  return jwt.verify(token, secret);
}

export function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookie(res) {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  });
}

export function getUserIdFromReq(req) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token) return null;
    const payload = verifyToken(token);
    return payload?.sub || null;
  } catch {
    return null;
  }
}

export const cookieName = COOKIE_NAME;


