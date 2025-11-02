declare global {
    declare module "express-session" {
        interface SessionData {
            usuario?: Usuario;
        }
    }
}
