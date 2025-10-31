"use client";
import { appConfig } from "@/config";

export function Footer() {
  return (
    <footer className="container py-8 text-center text-sm text-muted-foreground mt-16 border-t border-border">
      <span>
        © {new Date().getFullYear()} <a href="https://www.redirectchecker.org/" className="text-foreground hover:text-primary transition-colors">{appConfig.appName}</a>. All rights reserved.
      </span>
    </footer>
  );
}
