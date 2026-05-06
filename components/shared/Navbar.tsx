import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "./constants";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/LogoutButton";
import UserAvatar from "@/components/shared/UserAvatar";

async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ??
    (user?.user_metadata?.full_name as string | undefined) ??
    null;
  const pictureUrl =
    (user?.user_metadata?.avatar_url as string | undefined) ??
    (user?.user_metadata?.picture as string | undefined) ??
    null;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F8FAFC] border-b border-gray-300 px-4">
      <div className="flex h-14 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="font-bold text-lg tracking-tight text-[#0d1f35]"
          >
            IF-VEST
          </Link>

          <nav className="hidden md:flex items-center h-14">
            {NAV_ITEMS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={`
                  relative h-14 flex items-center px-4 text-sm font-medium transition-colors
                  text-[#0d1f35] hover:text-black
                  after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px]
                  after:bg-[#0d1f35] after:scale-x-0 hover:after:scale-x-100
                  after:transition-transform after:duration-200
                `}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                variant="ghost"
                className="text-sm text-[#0d1f35]"
                asChild
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Link
                href="/settings"
                className="flex items-center gap-2 hover:opacity-80"
                aria-label="Settings"
              >
                <UserAvatar
                  name={displayName}
                  email={user.email}
                  pictureUrl={pictureUrl}
                />
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="text-sm text-[#0d1f35]"
                asChild
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button
                className="text-sm bg-[#0d1f35] hover:bg-[#162d4a] text-white"
                asChild
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
