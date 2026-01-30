import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "node:http";
import sgMail from "@sendgrid/mail";
import { storage } from "./storage";
import { updateProfileSchema } from "@shared/schema";

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Generate a 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Clean up expired codes periodically (now uses database)
setInterval(async () => {
  try {
    await storage.cleanExpiredCodes();
  } catch (error) {
    console.error("Failed to clean expired codes:", error);
  }
}, 60000); // Clean every minute

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limit constants
const MAX_CODE_REQUESTS_PER_HOUR = 5;
const MAX_VERIFY_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MINUTES = 60;

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

  // Email signup - send 6-digit verification code
  app.post("/api/auth/email/signup", async (req: Request, res: Response) => {
    const { email } = req.body;
    
    // Input validation
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Sanitize email
    const sanitizedEmail = email.toLowerCase().trim();

    // Rate limiting check
    const canProceed = await storage.checkRateLimit(sanitizedEmail, "send_code", MAX_CODE_REQUESTS_PER_HOUR, RATE_LIMIT_WINDOW_MINUTES);
    if (!canProceed) {
      return res.status(429).json({ error: "Too many verification requests. Please try again later." });
    }

    // Generate a 6-digit code
    const code = generateVerificationCode();
    
    // Store in database with 10-minute expiration
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await storage.saveVerificationCode(sanitizedEmail, code, expiresAt);
    
    // Increment rate limit counter
    await storage.incrementRateLimit(sanitizedEmail, "send_code");

    console.log(`Generated verification code for ${sanitizedEmail}: ${code}`);

    try {
      if (process.env.SENDGRID_API_KEY) {
        const msg = {
          to: email,
          from: "amaobiokeoma@gmail.com",
          subject: `${code} is your Obimo verification code`,
          text: `Your Obimo verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, you can safely ignore this email.`,
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
                <h2 style="color: #2D3142; font-size: 20px; margin: 0 0 16px 0;">Your verification code</h2>
                <div style="background: #F3F4F6; border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
                  <span style="font-size: 36px; font-weight: 700; color: #2D3142; letter-spacing: 8px;">${code}</span>
                </div>
                <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
                  Enter this code in the app to verify your email address.
                </p>
                <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                  This code expires in 10 minutes. If you didn't request this, you can ignore this email.
                </p>
              </div>
            </body>
            </html>
          `,
        };

        await sgMail.send(msg);
        console.log(`Verification code email sent to: ${email}`);
      } else {
        console.log(`[DEV] Would send verification code ${code} to: ${email}`);
      }
      
      res.json({ 
        success: true, 
        message: "Verification code sent" 
      });
    } catch (error: any) {
      console.error("SendGrid error:", error.response?.body || error.message);
      res.status(500).json({ 
        error: "Failed to send verification code",
        details: error.message 
      });
    }
  });

  // Resend verification code
  app.post("/api/auth/email/resend", async (req: Request, res: Response) => {
    const { email } = req.body;
    
    // Input validation
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Sanitize email
    const sanitizedEmail = email.toLowerCase().trim();

    // Rate limiting check
    const canProceed = await storage.checkRateLimit(sanitizedEmail, "send_code", MAX_CODE_REQUESTS_PER_HOUR, RATE_LIMIT_WINDOW_MINUTES);
    if (!canProceed) {
      return res.status(429).json({ error: "Too many verification requests. Please try again later." });
    }

    // Generate a new 6-digit code
    const code = generateVerificationCode();
    
    // Store in database with 10-minute expiration
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await storage.saveVerificationCode(sanitizedEmail, code, expiresAt);
    
    // Increment rate limit counter
    await storage.incrementRateLimit(sanitizedEmail, "send_code");

    console.log(`Regenerated verification code for ${sanitizedEmail}: ${code}`);

    try {
      if (process.env.SENDGRID_API_KEY) {
        const msg = {
          to: email,
          from: "amaobiokeoma@gmail.com",
          subject: `${code} is your Obimo verification code`,
          text: `Your Obimo verification code is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, you can safely ignore this email.`,
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
                <h2 style="color: #2D3142; font-size: 20px; margin: 0 0 16px 0;">Your verification code</h2>
                <div style="background: #F3F4F6; border-radius: 12px; padding: 20px; margin: 0 0 24px 0;">
                  <span style="font-size: 36px; font-weight: 700; color: #2D3142; letter-spacing: 8px;">${code}</span>
                </div>
                <p style="color: #6B7280; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
                  Enter this code in the app to verify your email address.
                </p>
                <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                  This code expires in 10 minutes. If you didn't request this, you can ignore this email.
                </p>
              </div>
            </body>
            </html>
          `,
        };

        await sgMail.send(msg);
        console.log(`Verification code resent to: ${email}`);
      } else {
        console.log(`[DEV] Would resend verification code ${code} to: ${email}`);
      }
      
      res.json({ 
        success: true, 
        message: "Verification code resent" 
      });
    } catch (error: any) {
      console.error("SendGrid error:", error.response?.body || error.message);
      res.status(500).json({ 
        error: "Failed to resend verification code",
        details: error.message 
      });
    }
  });

  // Verify the 6-digit code
  app.post("/api/auth/email/verify", async (req: Request, res: Response) => {
    const { email, code } = req.body;
    
    // Input validation
    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required" });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Sanitize inputs
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedCode = code.trim();

    // Get stored verification code from database
    const stored = await storage.getVerificationCode(sanitizedEmail);
    
    if (!stored) {
      return res.status(400).json({ error: "No verification code found. Please request a new one." });
    }
    
    // Check expiration
    if (stored.expiresAt < new Date()) {
      await storage.deleteVerificationCode(sanitizedEmail);
      return res.status(400).json({ error: "Verification code expired. Please request a new one." });
    }

    // Check max attempts (security measure)
    if (stored.attempts >= MAX_VERIFY_ATTEMPTS) {
      await storage.deleteVerificationCode(sanitizedEmail);
      return res.status(400).json({ error: "Too many failed attempts. Please request a new code." });
    }
    
    // Verify code
    if (stored.code !== sanitizedCode) {
      await storage.incrementVerificationAttempts(sanitizedEmail);
      return res.status(400).json({ error: "Invalid verification code" });
    }
    
    // Code is valid - remove it so it can't be reused
    await storage.deleteVerificationCode(sanitizedEmail);
    
    console.log(`Email verified successfully: ${sanitizedEmail}`);
    
    // Create user in database if doesn't exist
    let user;
    let isNewUser = false;
    try {
      user = await storage.getUserByEmail(sanitizedEmail);
      if (!user) {
        user = await storage.createUser(sanitizedEmail);
        isNewUser = true;
        console.log(`Created new user: ${user.id}`);
      } else {
        console.log(`Returning user: ${user.id}`);
      }
    } catch (err) {
      console.error("Failed to create/get user:", err);
      return res.status(500).json({ error: "Failed to process user account" });
    }
    
    res.json({ 
      success: true, 
      message: "Email verified successfully",
      user: {
        id: user.id,
        email: user.email,
        verified: true,
        isNewUser,
        onboardingCompleted: user.onboardingCompleted,
      }
    });
  });

  // Complete onboarding - save profile data to database
  app.post("/api/profile/complete-onboarding", async (req: Request, res: Response) => {
    try {
      const { email, firstName, dateOfBirth, gender, photos, onboardingCompleted, locationPermission, notificationPermission, latitude, longitude } = req.body;
      
      // Input validation
      if (!email || !EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: "Invalid email" });
      }

      const sanitizedEmail = email.toLowerCase().trim();

      // Check if user exists
      const existingUser = await storage.getUserByEmail(sanitizedEmail);
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const profileData = {
        firstName: firstName?.trim(),
        dateOfBirth,
        gender,
        photos,
        onboardingCompleted,
        locationPermission,
        notificationPermission,
        latitude,
        longitude,
      };
      
      // Validate the data
      const validatedData = updateProfileSchema.parse(profileData);
      
      // Save to database
      const updatedUser = await storage.updateUserProfile(sanitizedEmail, validatedData);
      
      console.log("Completed onboarding for user:", sanitizedEmail);
      
      res.json({ 
        success: true, 
        message: "Onboarding completed successfully",
        user: updatedUser
      });
    } catch (error: any) {
      console.error("Failed to complete onboarding:", error);
      res.status(400).json({ 
        error: "Failed to save profile data",
        details: error.message 
      });
    }
  });

  // Update user location
  app.post("/api/profile/update-location", async (req: Request, res: Response) => {
    try {
      const { email, latitude, longitude, locationPermission } = req.body;
      
      if (!email || !EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: "Invalid email" });
      }

      const sanitizedEmail = email.toLowerCase().trim();

      const updatedUser = await storage.updateUserProfile(sanitizedEmail, {
        latitude: latitude?.toString(),
        longitude: longitude?.toString(),
        locationPermission,
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      console.log(`Updated location for ${sanitizedEmail}: ${latitude}, ${longitude}`);
      
      res.json({ 
        success: true, 
        message: "Location updated successfully" 
      });
    } catch (error: any) {
      console.error("Failed to update location:", error);
      res.status(400).json({ error: "Failed to update location", details: error.message });
    }
  });

  // Update user permissions
  app.post("/api/profile/update-permissions", async (req: Request, res: Response) => {
    try {
      const { email, locationPermission, notificationPermission } = req.body;
      
      if (!email || !EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: "Invalid email" });
      }

      const sanitizedEmail = email.toLowerCase().trim();

      const updatedUser = await storage.updateUserProfile(sanitizedEmail, {
        locationPermission,
        notificationPermission,
      });

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      console.log(`Updated permissions for ${sanitizedEmail}`);
      
      res.json({ 
        success: true, 
        message: "Permissions updated successfully" 
      });
    } catch (error: any) {
      console.error("Failed to update permissions:", error);
      res.status(400).json({ error: "Failed to update permissions", details: error.message });
    }
  });

  // Get user profile
  app.get("/api/profile/:email", async (req: Request, res: Response) => {
    const email = req.params.email as string;
    
    // Sanitize email
    const sanitizedEmail = email.toLowerCase().trim();
    
    try {
      const user = await storage.getUserByEmail(sanitizedEmail);
      if (user) {
        // Don't expose sensitive internal fields
        res.json({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          photos: user.photos,
          locationPermission: user.locationPermission,
          notificationPermission: user.notificationPermission,
          onboardingCompleted: user.onboardingCompleted,
          createdAt: user.createdAt,
        });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch user", details: error.message });
    }
  });

  // ============= LOCATION ROUTES =============

  // Get all locations
  app.get("/api/locations", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const locationsList = await storage.getLocations(limit);
      res.json(locationsList);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch locations", details: error.message });
    }
  });

  // Get nearby locations
  app.get("/api/locations/nearby", async (req: Request, res: Response) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radius = parseFloat(req.query.radius as string) || 50;

      if (isNaN(lat) || isNaN(lng)) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      const nearbyLocations = await storage.getNearbyLocations(lat, lng, radius);
      res.json(nearbyLocations);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch nearby locations", details: error.message });
    }
  });

  // Get location by ID
  app.get("/api/locations/:id", async (req: Request, res: Response) => {
    try {
      const location = await storage.getLocationById(req.params.id as string);
      if (location) {
        res.json(location);
      } else {
        res.status(404).json({ error: "Location not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch location", details: error.message });
    }
  });

  // ============= MAP MARKER ROUTES =============

  // Get all visible map markers
  app.get("/api/markers", async (req: Request, res: Response) => {
    try {
      const markers = await storage.getMapMarkers();
      res.json(markers);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch markers", details: error.message });
    }
  });

  // Get markers by location
  app.get("/api/markers/location/:locationId", async (req: Request, res: Response) => {
    try {
      const markers = await storage.getMapMarkersByLocation(req.params.locationId as string);
      res.json(markers);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch markers", details: error.message });
    }
  });

  // ============= MAP PROVIDER ROUTES =============

  // Get active map provider
  app.get("/api/map/provider", async (req: Request, res: Response) => {
    try {
      const provider = await storage.getActiveMapProvider();
      res.json(provider || { provider: 'mapbox', isAvailable: true });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch map provider", details: error.message });
    }
  });

  // Report map provider usage
  app.post("/api/map/provider/usage", async (req: Request, res: Response) => {
    try {
      const { provider, usageCount = 1 } = req.body;
      
      const status = await storage.getMapProviderStatus(provider);
      if (status) {
        const newDailyCount = (status.dailyUsageCount || 0) + usageCount;
        const newMonthlyCount = (status.monthlyUsageCount || 0) + usageCount;
        
        let isAvailable = true;
        if (status.dailyUsageLimit && newDailyCount >= status.dailyUsageLimit) {
          isAvailable = false;
        }
        if (status.monthlyUsageLimit && newMonthlyCount >= status.monthlyUsageLimit) {
          isAvailable = false;
        }
        
        await storage.updateMapProviderStatus(provider, {
          dailyUsageCount: newDailyCount,
          monthlyUsageCount: newMonthlyCount,
          isAvailable,
          lastHealthCheck: new Date(),
        });
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to update usage", details: error.message });
    }
  });

  // Report map provider error (for fallback logic)
  app.post("/api/map/provider/error", async (req: Request, res: Response) => {
    try {
      const { provider, error: errorMessage } = req.body;
      
      const status = await storage.getMapProviderStatus(provider);
      if (status) {
        const newErrorCount = (status.errorCount || 0) + 1;
        const isAvailable = newErrorCount < 10; // Disable after 10 errors
        
        await storage.updateMapProviderStatus(provider, {
          errorCount: newErrorCount,
          lastError: errorMessage,
          lastErrorAt: new Date(),
          isAvailable,
        });
        
        // If provider became unavailable, switch to fallback
        if (!isAvailable) {
          const fallbackProvider = provider === 'google' ? 'mapbox' : 'google';
          await storage.updateMapProviderStatus(fallbackProvider, { isPrimary: true });
        }
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to report error", details: error.message });
    }
  });

  // ============= DISCOVER / USER ROUTES =============

  // Get users for discover feed
  app.get("/api/discover", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId as string;
      const limit = parseInt(req.query.limit as string) || 20;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const discoverUsers = await storage.getDiscoverUsers(userId, limit);
      res.json(discoverUsers);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch discover users", details: error.message });
    }
  });

  // Get nearby users
  app.get("/api/users/nearby", async (req: Request, res: Response) => {
    try {
      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const radius = parseFloat(req.query.radius as string) || 10;
      const excludeUserId = req.query.excludeUserId as string;

      if (isNaN(lat) || isNaN(lng) || !excludeUserId) {
        return res.status(400).json({ error: "Latitude, longitude, and excludeUserId are required" });
      }

      const nearbyUsers = await storage.getNearbyUsers(lat, lng, radius, excludeUserId);
      res.json(nearbyUsers);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch nearby users", details: error.message });
    }
  });

  // ============= CONNECTION ROUTES =============

  // Get user connections
  app.get("/api/connections/:userId", async (req: Request, res: Response) => {
    try {
      const connectionsList = await storage.getConnections(req.params.userId as string);
      res.json(connectionsList);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch connections", details: error.message });
    }
  });

  // Create connection (like/super-like)
  app.post("/api/connections", async (req: Request, res: Response) => {
    try {
      const { userId, connectedUserId, connectionType = "standard" } = req.body;
      
      if (!userId || !connectedUserId) {
        return res.status(400).json({ error: "Both user IDs are required" });
      }
      
      const connection = await storage.createConnection({
        userId,
        connectedUserId,
        connectionType,
        status: "pending",
      });
      
      // Log interaction for AI learning
      await storage.logInteraction({
        userId,
        targetUserId: connectedUserId,
        interactionType: connectionType === "super" ? "super_like" : "like",
        context: "discover",
      });
      
      res.json(connection);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to create connection", details: error.message });
    }
  });

  // Update connection status
  app.patch("/api/connections/:id", async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const connection = await storage.updateConnectionStatus(req.params.id as string, status);
      
      if (connection) {
        res.json(connection);
      } else {
        res.status(404).json({ error: "Connection not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: "Failed to update connection", details: error.message });
    }
  });

  // ============= RECOMMENDATION ROUTES =============

  // Get recommendations for user
  app.get("/api/recommendations/:userId", async (req: Request, res: Response) => {
    try {
      const recs = await storage.getRecommendationsForUser(req.params.userId as string);
      res.json(recs);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch recommendations", details: error.message });
    }
  });

  // Update recommendation (after user action)
  app.patch("/api/recommendations/:id", async (req: Request, res: Response) => {
    try {
      const updates = req.body;
      const rec = await storage.updateRecommendation(req.params.id as string, updates);
      
      if (rec) {
        res.json(rec);
      } else {
        res.status(404).json({ error: "Recommendation not found" });
      }
    } catch (error: any) {
      res.status(500).json({ error: "Failed to update recommendation", details: error.message });
    }
  });

  // ============= INTERACTION ROUTES =============

  // Log user interaction
  app.post("/api/interactions", async (req: Request, res: Response) => {
    try {
      const interactionData = req.body;
      
      if (!interactionData.userId || !interactionData.interactionType) {
        return res.status(400).json({ error: "userId and interactionType are required" });
      }
      
      const interaction = await storage.logInteraction(interactionData);
      res.json(interaction);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to log interaction", details: error.message });
    }
  });

  // Get user interactions
  app.get("/api/interactions/:userId", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const interactions = await storage.getUserInteractions(req.params.userId as string, limit);
      res.json(interactions);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch interactions", details: error.message });
    }
  });

  // ============= USER LOCATION HISTORY ROUTES =============

  // Get user's travel history
  app.get("/api/travel-history/:userId", async (req: Request, res: Response) => {
    try {
      const history = await storage.getUserLocationHistory(req.params.userId as string);
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch travel history", details: error.message });
    }
  });

  // Log a visit to a location
  app.post("/api/travel-history", async (req: Request, res: Response) => {
    try {
      const { userId, locationId, durationDays, photos, notes, isPublic = true } = req.body;
      
      if (!userId || !locationId) {
        return res.status(400).json({ error: "userId and locationId are required" });
      }
      
      const visit = await storage.logUserLocationVisit({
        userId,
        locationId,
        durationDays,
        photos,
        notes,
        isPublic,
      });
      
      res.json(visit);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to log visit", details: error.message });
    }
  });

  // ============= MESSAGE ROUTES =============

  // Get messages for a connection
  app.get("/api/messages/:connectionId", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const msgs = await storage.getMessages(req.params.connectionId as string, limit);
      res.json(msgs);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch messages", details: error.message });
    }
  });

  // Send a message
  app.post("/api/messages", async (req: Request, res: Response) => {
    try {
      const { connectionId, senderId, content, messageType = "text" } = req.body;
      
      if (!connectionId || !senderId || !content) {
        return res.status(400).json({ error: "connectionId, senderId, and content are required" });
      }
      
      const message = await storage.sendMessage({
        connectionId,
        senderId,
        content,
        messageType,
      });
      
      res.json(message);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to send message", details: error.message });
    }
  });

  // Mark messages as read
  app.post("/api/messages/:connectionId/read", async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "userId is required" });
      }
      
      await storage.markMessagesAsRead(req.params.connectionId as string, userId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to mark messages as read", details: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
