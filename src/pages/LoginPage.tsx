import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { loginDemoUser } from "@/lib/auth";
import { toast } from "sonner";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email to continue.");
      return;
    }

    loginDemoUser();
    toast.success("Logged in as demo user");
    navigate("/datarooms");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <Card className="w-full max-w-md border-slate-800">
        <CardContent className="pt-6">
          <h1 className="text-xl font-semibold mb-2">Sign in</h1>
          <p className="text-xs text-slate-400 mb-6">
            This is a mock login for the demo. Any email will work.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300">Work email</label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            <Button type="submit" className="w-full mt-2 cursor-pointer">
              Continue as demo user
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
