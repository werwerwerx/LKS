import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

export async function verifyAdminToken(request: NextRequest) {
  const authorization = request.headers.get("authorization")
  
  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Unauthorized")
  }

  const token = authorization.split(" ")[1]
  const JWT_SECRET = process.env.JWT_SECRET_KEY
  
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not configured")
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; login: string }
    return decoded
  } catch (error) {
    throw new Error("Invalid token")
  }
}

export function createAuthenticatedHandler<T extends any[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      await verifyAdminToken(req)
      return await handler(req, ...args)
    } catch (authError) {
      console.error("Auth error:", authError)
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      )
    }
  }
} 