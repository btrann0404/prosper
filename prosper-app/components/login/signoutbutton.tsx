import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

export function SignOutButton() {
  const { signOut } = useAuthActions();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
      onClick={() => {
        void signOut();
      }}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Sign out
    </Button>
  );
}
