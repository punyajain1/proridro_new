"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CarFront, KeyRound, User } from "lucide-react";
import { loginAction } from "./actions";
import { toast } from "sonner";
import { useEffect } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" type="submit" disabled={pending}>
      {pending ? "Signing in..." : "Sign in to Dashboard"}
    </Button>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50 p-4">
      <div className="absolute inset-0 z-[-1] bg-[url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      
      <Card className="w-full max-w-md border-border/50 shadow-2xl bg-card/80 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <CardHeader className="space-y-3 pb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-2 shadow-inner">
            <CarFront className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">ProRido Admin</CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Enter your credentials to access operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form 
            action={async (formData) => {
              const res = await loginAction(formData);
              if (res?.error) {
                toast.error(res.error);
              }
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  name="email"
                  placeholder="Email" 
                  type="email" 
                  required 
                  className="pl-10 h-12 bg-background/50 border-muted focus-visible:ring-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="password" 
                  name="password"
                  placeholder="Password" 
                  type="password" 
                  required 
                  className="pl-10 h-12 bg-background/50 border-muted focus-visible:ring-primary"
                />
              </div>
            </div>
            <SubmitButton />
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 pt-6">
          <p className="text-sm text-muted-foreground">
            Secure internal access only
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
