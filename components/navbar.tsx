"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Menu, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "./ui/input";
import { ThemeToggle } from "./button/ThemeToggle";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Movies", href: "/movies" },
  { name: "TV", href: "/tv" },
  { name: "Random", href: "/random" },
];

export function SearchBar() {
  return (
    <>
      <div>
        <div className="relative hidden md:flex w-64">
          <Input
            id="input-26"
            className="peer pe-9 ps-9"
            placeholder="Search..."
            type="search"
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
            <Search size={16} strokeWidth={2} />
          </div>
          <button
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Submit search"
            type="submit"
          >
            <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full py-2">
      <div className="flex h-16 items-center justify-between border rounded-2xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">ZENAnime</span>
        </Link>

        <div className="hidden md:flex md:items-center md:space-x-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="flex gap-4">
          <SearchBar />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
