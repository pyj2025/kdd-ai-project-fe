import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "./constants";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/LogoutButton";
import UserAvatar from "@/components/shared/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, Settings, LogOut } from "lucide-react";

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
          <Link href="/" className="font-bold text-lg tracking-tight text-[#0d1f35]">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none hover:opacity-80 transition-opacity">
                  <UserAvatar name={displayName} email={user.email} pictureUrl={pictureUrl} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName || "사용자"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer w-full flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer w-full flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />

                <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-red-50 text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <LogoutButton
                    // variant="ghost"
                    className="h-auto p-0 hover:bg-transparent text-red-600"
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" className="text-sm text-[#0d1f35]" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="text-sm bg-[#0d1f35] hover:bg-[#162d4a] text-white" asChild>
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
