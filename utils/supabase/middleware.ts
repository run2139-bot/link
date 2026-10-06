import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // 세션 토큰 갱신
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = !!data?.claims;

  const { pathname } = request.nextUrl;
  // 비로그인 접근 허용 페이지 (로그인한 사용자는 인덱스로 보냄)
  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(pathname);
  // 재설정 링크 처리 경로: 로그인 여부와 무관하게 통과
  if (pathname === "/auth/callback") return supabaseResponse;

  // 비로그인 사용자는 로그인 페이지로, 로그인 사용자는 인증 페이지 대신 인덱스로
  if (isLoggedIn === isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = isLoggedIn ? "/" : "/login";
    const redirect = NextResponse.redirect(url);
    // 갱신된 세션 쿠키 유지
    supabaseResponse.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  return supabaseResponse;
};
