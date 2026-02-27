import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('v_session')?.value;
  const { pathname } = req.nextUrl;

  // 1. Agar user Login ya Signup kar raha hai, toh allow karo
  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // 2. AGAR TOKEN NAHI HAI -> Redirect to Login
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    // 3. ADMIN PROTECTION: Agar user admin nahi hai aur /admin pe ja raha hai
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    // Agar token invalid hai -> Redirect to Login
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Ye config batati hai ki kin pages par middleware chalna chahiye
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};