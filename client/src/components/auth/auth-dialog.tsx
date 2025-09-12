import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LoginForm } from "./login-form";
import { SignupForm } from "./signup-form";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup";
}

export function AuthDialog({ isOpen, onClose, initialMode = "login" }: AuthDialogProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);

  const toggleMode = () => {
    setMode(current => current === "login" ? "signup" : "login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="auth-dialog">
        {mode === "login" ? (
          <LoginForm 
            onToggleToSignup={toggleMode}
            onClose={onClose}
          />
        ) : (
          <SignupForm 
            onToggleToLogin={toggleMode}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
