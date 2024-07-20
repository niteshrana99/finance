"use client";

import { usePathname, useRouter } from "next/navigation";
import NavButton from "./navButton";
import { useMedia } from "react-use";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Ghost, Menu } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type RouteObj = {
  href: string;
  label: string;
};

const routes: Array<RouteObj> = [
  {
    href: "/",
    label: "Overview",
  },
  {
    href: "/transactions",
    label: "Transactions",
  },
  {
    href: "/accounts",
    label: "Accounts",
  },
  {
    href: "/categories",
    label: "Categories",
  },
  {
    href: "/settings",
    label: "Settings",
  },
];

const Navigation = () => {
  const pathname = usePathname();
  const isMobile = useMedia("(max-width:1040px)", false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onclickHandler = (route: RouteObj) => {
    router.push(route.href);
    setOpen(false)
  }

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen} >
        <SheetTrigger>
          <Button
            variant="outline"
            size="sm"
            className="font-normal border-none text-white bg-white/10 hover:bg-white/20"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 pt-2">
        <nav className="pt-10 flex flex-col font-bold">
          {routes.map((route: RouteObj) => {
            return (
                <Button 
                key={route.href} 
                className="w-full justify-start font-bold
                "
                variant={pathname === route.href ? 'secondary' : 'ghost'}
                onClick={() => onclickHandler(route)}
                >
                {route.label}
                </Button>
            );
          })}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
      {routes.map((route: RouteObj) => (
        <NavButton
          key={route.href}
          label={route.label}
          href={route.href}
          isActive={pathname === route.href}
        />
      ))}
    </nav>
  );
};

export default Navigation;
