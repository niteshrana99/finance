"use client";

import { useUser } from "@clerk/nextjs";

const WelcomeMessage = () => {
  const { isLoaded, user } = useUser();
  return (
    <div className="text-white mt-8 space-y-4">
      <h2 className="font-bold text-2xl lg:text-4xl">
        Welcome back {isLoaded && !!user?.fullName ? `, ${user?.fullName}` : ""}{" "}
        👋
      </h2>
      <p className="text-sm lg:text-base text-[#89b6fd]">
        This is your financial overview report
      </p>
    </div>
  );
};

export default WelcomeMessage;