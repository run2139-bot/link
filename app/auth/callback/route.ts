import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

// 이메일 링크(?code=...)를 세션으로 교환한 뒤 next 경로로 이동
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const target = next && next.startsWith("/") && !next.startsWith("//") ? next : "/";

  if (code) {
    const supabase = createClient(await cookies());
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${target}`);
  }

  return NextResponse.redirect(`${origin}/forgot-password?error=invalid_link`);
}
