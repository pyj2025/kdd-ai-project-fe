import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth";

function LogoutButton() {
  return (
    <form action={logout}>
      <Button
        type="submit"
        variant="ghost"
        className="text-sm text-[#0d1f35]"
      >
        Logout
      </Button>
    </form>
  );
}

export default LogoutButton;
