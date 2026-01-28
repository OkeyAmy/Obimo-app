import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "node:http";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface ReplitUser {
  id: string;
  name: string;
  url: string;
  profileImage?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Replit Auth login route
  app.get("/api/login", (req: Request, res: Response) => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Sign in - Obimo</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #E8E8E8;
            padding: 20px;
          }
          .container {
            text-align: center;
            padding: 40px 30px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            max-width: 340px;
            width: 100%;
          }
          .logo {
            font-family: 'Georgia', serif;
            font-size: 32px;
            color: #2D3142;
            margin-bottom: 8px;
          }
          h1 {
            color: #2D3142;
            font-size: 20px;
            margin: 0 0 8px 0;
            font-weight: 600;
          }
          p {
            color: #6B7280;
            margin: 0 0 24px 0;
            font-size: 14px;
            line-height: 1.5;
          }
          .btn {
            display: block;
            width: 100%;
            background: #2D3142;
            color: white;
            border: none;
            padding: 16px 24px;
            border-radius: 100px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            transition: background 0.2s;
          }
          .btn:hover {
            background: #1a1d2c;
          }
          .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          .status {
            margin-top: 16px;
            color: #6B7280;
            font-size: 14px;
          }
          .error {
            color: #DC2626;
          }
        </style>
        <script src="https://auth.util.repl.co/script.js"></script>
      </head>
      <body>
        <div class="container">
          <div class="logo">Obimo</div>
          <h1>Welcome back</h1>
          <p>Sign in with your Replit account to continue your journey</p>
          <button class="btn" id="loginBtn" onclick="login()">Continue with Replit</button>
          <p class="status" id="status" style="display: none;"></p>
        </div>
        <script>
          const btn = document.getElementById('loginBtn');
          const status = document.getElementById('status');
          
          async function login() {
            btn.disabled = true;
            btn.textContent = 'Signing in...';
            status.style.display = 'block';
            status.textContent = 'Opening Replit authentication...';
            status.className = 'status';
            
            try {
              const user = await LoginWithReplit();
              if (user) {
                status.textContent = 'Success! Redirecting...';
                window.location.href = '/auth/success?user=' + encodeURIComponent(user.name);
              } else {
                throw new Error('Authentication cancelled');
              }
            } catch (err) {
              console.error('Auth error:', err);
              status.textContent = 'Authentication failed. Please try again.';
              status.className = 'status error';
              btn.disabled = false;
              btn.textContent = 'Continue with Replit';
            }
          }
        </script>
      </body>
      </html>
    `;
    
    res.send(html);
  });

  // Auth success route
  app.get("/auth/success", (req: Request, res: Response) => {
    const userId = req.get("X-Replit-User-Id");
    const userName = req.get("X-Replit-User-Name") || req.query.user as string;
    
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Welcome to Obimo</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #E8E8E8;
            padding: 20px;
          }
          .container {
            text-align: center;
            padding: 40px 30px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            max-width: 340px;
            width: 100%;
          }
          .check {
            width: 64px;
            height: 64px;
            background: #10B981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
          }
          .check svg {
            width: 32px;
            height: 32px;
            stroke: white;
            stroke-width: 3;
            fill: none;
          }
          h1 { 
            color: #2D3142; 
            font-size: 24px;
            margin: 0 0 8px 0;
          }
          p { 
            color: #6B7280;
            margin: 0;
            font-size: 14px;
            line-height: 1.5;
          }
          .note {
            margin-top: 24px;
            padding: 16px;
            background: #F3F4F6;
            border-radius: 12px;
            font-size: 13px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="check">
            <svg viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1>Welcome${userName ? ', ' + userName : ''}!</h1>
          <p>You're now signed in to Obimo.</p>
          <div class="note">
            <p>You can close this window and return to the app.</p>
          </div>
        </div>
      </body>
      </html>
    `);
  });

  // Get current user
  app.get("/api/user", (req: Request, res: Response) => {
    const userId = req.get("X-Replit-User-Id");
    const userName = req.get("X-Replit-User-Name");
    const userRoles = req.get("X-Replit-User-Roles");
    const profileImage = req.get("X-Replit-User-Profile-Image");
    const userUrl = req.get("X-Replit-User-Url");

    if (userId && userName) {
      res.json({
        id: userId,
        name: userName,
        url: userUrl || `https://replit.com/@${userName}`,
        profileImage: profileImage || null,
        roles: userRoles ? userRoles.split(",") : [],
      });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  // Logout route
  app.post("/api/logout", (req: Request, res: Response) => {
    res.json({ success: true });
  });

  // Email signup with SendGrid
  app.post("/api/auth/email/signup", async (req: Request, res: Response) => {
    const { email } = req.body;
    
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // Generate a simple confirmation token
    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");
    const confirmUrl = `${req.protocol}://${req.get("host")}/auth/confirm?token=${token}`;

    try {
      if (process.env.SENDGRID_API_KEY) {
        const msg = {
          to: email,
          from: "noreply@obimo.app", // You'll need to verify this sender in SendGrid
          subject: "Confirm your Obimo account",
          text: `Welcome to Obimo!\n\nClick this link to confirm your email: ${confirmUrl}\n\nIf you didn't sign up for Obimo, you can ignore this email.`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #E8E8E8; padding: 40px 20px; margin: 0;">
              <div style="max-width: 400px; margin: 0 auto; background: white; border-radius: 20px; padding: 40px 30px; text-align: center;">
                <h1 style="font-family: Georgia, serif; font-size: 32px; color: #2D3142; margin: 0 0 24px 0;">Obimo</h1>
                <h2 style="color: #2D3142; font-size: 20px; margin: 0 0 16px 0;">Confirm your email</h2>
                <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                  Welcome to Obimo! Click the button below to confirm your email address and start connecting with fellow travelers.
                </p>
                <a href="${confirmUrl}" style="display: inline-block; background: #2D3142; color: white; text-decoration: none; padding: 16px 32px; border-radius: 100px; font-size: 16px; font-weight: 600;">
                  Confirm Email
                </a>
                <p style="color: #9CA3AF; font-size: 12px; margin: 24px 0 0 0;">
                  If you didn't sign up for Obimo, you can safely ignore this email.
                </p>
              </div>
            </body>
            </html>
          `,
        };

        await sgMail.send(msg);
        console.log(`Confirmation email sent to: ${email}`);
      } else {
        console.log(`[DEV] Would send confirmation email to: ${email}`);
        console.log(`[DEV] Confirm URL: ${confirmUrl}`);
      }
      
      res.json({ 
        success: true, 
        message: "Confirmation email sent" 
      });
    } catch (error: any) {
      console.error("SendGrid error:", error.response?.body || error.message);
      res.status(500).json({ 
        error: "Failed to send confirmation email",
        details: error.message 
      });
    }
  });

  // Resend email confirmation with SendGrid
  app.post("/api/auth/email/resend", async (req: Request, res: Response) => {
    const { email } = req.body;
    
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");
    const confirmUrl = `${req.protocol}://${req.get("host")}/auth/confirm?token=${token}`;

    try {
      if (process.env.SENDGRID_API_KEY) {
        const msg = {
          to: email,
          from: "noreply@obimo.app",
          subject: "Confirm your Obimo account",
          text: `Welcome to Obimo!\n\nClick this link to confirm your email: ${confirmUrl}\n\nIf you didn't sign up for Obimo, you can ignore this email.`,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #E8E8E8; padding: 40px 20px; margin: 0;">
              <div style="max-width: 400px; margin: 0 auto; background: white; border-radius: 20px; padding: 40px 30px; text-align: center;">
                <h1 style="font-family: Georgia, serif; font-size: 32px; color: #2D3142; margin: 0 0 24px 0;">Obimo</h1>
                <h2 style="color: #2D3142; font-size: 20px; margin: 0 0 16px 0;">Confirm your email</h2>
                <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
                  Welcome to Obimo! Click the button below to confirm your email address and start connecting with fellow travelers.
                </p>
                <a href="${confirmUrl}" style="display: inline-block; background: #2D3142; color: white; text-decoration: none; padding: 16px 32px; border-radius: 100px; font-size: 16px; font-weight: 600;">
                  Confirm Email
                </a>
                <p style="color: #9CA3AF; font-size: 12px; margin: 24px 0 0 0;">
                  If you didn't sign up for Obimo, you can safely ignore this email.
                </p>
              </div>
            </body>
            </html>
          `,
        };

        await sgMail.send(msg);
        console.log(`Confirmation email resent to: ${email}`);
      } else {
        console.log(`[DEV] Would resend confirmation email to: ${email}`);
      }
      
      res.json({ 
        success: true, 
        message: "Confirmation email resent" 
      });
    } catch (error: any) {
      console.error("SendGrid error:", error.response?.body || error.message);
      res.status(500).json({ 
        error: "Failed to resend confirmation email",
        details: error.message 
      });
    }
  });

  // Email confirmation handler
  app.get("/auth/confirm", (req: Request, res: Response) => {
    const token = req.query.token as string;
    
    if (!token) {
      return res.status(400).send("Invalid confirmation link");
    }

    try {
      const decoded = Buffer.from(token, "base64").toString("utf8");
      const [email] = decoded.split(":");
      
      // In a real app, you'd verify and activate the account here
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Email Confirmed - Obimo</title>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #E8E8E8;
              padding: 20px;
            }
            .container {
              text-align: center;
              padding: 40px 30px;
              background: white;
              border-radius: 20px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              max-width: 340px;
              width: 100%;
            }
            .check {
              width: 64px;
              height: 64px;
              background: #10B981;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 20px;
            }
            .check svg {
              width: 32px;
              height: 32px;
              stroke: white;
              stroke-width: 3;
              fill: none;
            }
            h1 { 
              color: #2D3142; 
              font-size: 24px;
              margin: 0 0 8px 0;
            }
            p { 
              color: #6B7280;
              margin: 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="check">
              <svg viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h1>Email Confirmed!</h1>
            <p>Your email ${email} has been verified. You can now return to the app and sign in.</p>
          </div>
        </body>
        </html>
      `);
    } catch (error) {
      res.status(400).send("Invalid confirmation link");
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
