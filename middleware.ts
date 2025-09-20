import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("next-auth.session-token") ?? req.cookies.get("__Secure-next-auth.session-token");

  // إذا لم يوجد توكن الجلسة، يتم إعادة التوجيه لصفحة تسجيل الدخول
  if (!token) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // التوكن موجود، استمر في الطلب
  return NextResponse.next();
}

// حماية المسارات المحددة
export const config = {
  matcher: ["/", "/employees/:path*", "/protected/:path*"],
};
