// src/middleware.js
import { NextResponse } from "next/server";

// Read username and password from environment variables
const USERNAME = process.env.BASIC_AUTH_USERNAME;
const PASSWORD = process.env.BASIC_AUTH_PASSWORD;

export function middleware(req) {
  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic") {
      const decoded = Buffer.from(encoded, "base64").toString(); // "username:password"
      const [user, pass] = decoded.split(":");

      if (user === USERNAME && pass === PASSWORD) {
        return NextResponse.next(); // Auth success
      }
    }
  }

  // If auth fails or missing
  return new NextResponse("YOU SHALL NOT PASS!.. without the password", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
  });
}
