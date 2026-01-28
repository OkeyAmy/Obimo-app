import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "node:http";

interface ReplitUser {
  id: string;
  name: string;
  url: string;
  profileImage?: string;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Replit Auth login route
  app.get("/api/login", (req: Request, res: Response) => {
    const returnUrl = req.query.return || "/auth/success";
    
    // Send HTML that triggers Replit Auth popup
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Sign in with Replit</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: #E8E8E8;
          }
          .container {
            text-align: center;
            padding: 40px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            max-width: 320px;
          }
          h1 {
            color: #2D3142;
            font-size: 24px;
            margin-bottom: 16px;
          }
          p {
            color: #6B7280;
            margin-bottom: 24px;
          }
          .btn {
            display: block;
            background: #2D3142;
            color: white;
            border: none;
            padding: 16px 32px;
            border-radius: 100px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
          }
          .btn:hover {
            background: #1a1d2c;
          }
          .loading {
            display: none;
            margin-top: 16px;
            color: #6B7280;
          }
        </style>
        <script src="https://auth.util.repl.co/script.js"></script>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to Obimo</h1>
          <p>Continue with your Replit account</p>
          <button class="btn" onclick="login()">Sign in with Replit</button>
          <p class="loading" id="loading">Signing in...</p>
        </div>
        <script>
          function login() {
            document.getElementById('loading').style.display = 'block';
            LoginWithReplit().then(user => {
              if (user) {
                window.location.href = '/auth/success';
              }
            }).catch(err => {
              console.error('Auth error:', err);
              document.getElementById('loading').textContent = 'Error signing in. Please try again.';
            });
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
    const userName = req.get("X-Replit-User-Name");
    
    if (userId && userName) {
      // User is authenticated
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Success</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: #E8E8E8;
            }
            .container {
              text-align: center;
              padding: 40px;
              background: white;
              border-radius: 20px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            h1 { color: #2D3142; }
            p { color: #6B7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome, ${userName}!</h1>
            <p>You're now signed in to Obimo.</p>
            <p style="margin-top: 20px; font-size: 14px;">You can close this window and return to the app.</p>
          </div>
        </body>
        </html>
      `);
    } else {
      res.redirect("/api/login");
    }
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

  // Email signup (mock for now)
  app.post("/api/auth/email/signup", (req: Request, res: Response) => {
    const { email } = req.body;
    
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // In production, this would send an actual confirmation email
    console.log(`Sending confirmation email to: ${email}`);
    
    res.json({ 
      success: true, 
      message: "Confirmation email sent" 
    });
  });

  // Resend email confirmation
  app.post("/api/auth/email/resend", (req: Request, res: Response) => {
    const { email } = req.body;
    
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // In production, this would resend the confirmation email
    console.log(`Resending confirmation email to: ${email}`);
    
    res.json({ 
      success: true, 
      message: "Confirmation email resent" 
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
