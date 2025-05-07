import session from 'express-session';

export const sessionConfig = session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_here',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      //secure: false, // Set to true in production
      httpOnly: true,
      sameSite: 'strict',
      // sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  });