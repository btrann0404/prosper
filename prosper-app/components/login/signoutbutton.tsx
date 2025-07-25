import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
      onClick={() => {
        // Add your sign out logic here
        console.log("Sign out clicked");
      }}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Sign out
    </Button>
  );
}
