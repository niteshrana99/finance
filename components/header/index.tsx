"use client";

import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import HeaderLogo from "./headerLogo";
import Navigation from "./navigation";
import { Loader2 } from "lucide-react";
import WelcomeMessage from "../welcomeMessage";
import { Filter } from "../filter";

const Header = () => {
  return (
    <header className="h-full bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
      <div>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center lg:gap-x-16">
            <HeaderLogo />
            <Navigation />
          </div>
          <div>
            <ClerkLoading>
              <Loader2 />
            </ClerkLoading>
            <ClerkLoaded>
              <UserButton afterSignOutUrl="/" />
            </ClerkLoaded>
          </div>
        </div>
        <WelcomeMessage />
        <Filter />
      </div>
    </header>
  );
};

export default Header;
