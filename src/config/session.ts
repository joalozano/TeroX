import session from "express-session";

const session_config: session.SessionOptions = {
    secret: process.env['SESSION_SECRET'] || 'super_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 día
    }
};

export default session_config;
