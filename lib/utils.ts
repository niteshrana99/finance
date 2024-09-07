import { type ClassValue, clsx } from "clsx"
import { format, subDays } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCurrency = (value: number) => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
  }).format(value);
};

export const calculatePercentageChange = (current: number, previous: number) => {
  console.log(current, previous)
  if (previous === 0) {
    return previous === current ? 0 : 100;
  };
  return ((current - previous) / current) * 100;
};

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
}


export const formatDateRange = (period?: Period) => {
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  if (!period?.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`;
  }
  if (period?.to) {
    return `${format(period.from, "LLL dd")} - ${format(period.to, "LLL dd, y")}`;
  }

  return `${format(period.from, "LLL dd, y")}`;
};

export const formatPercentage = (value: number, addPrefix?: boolean) => {
  const percentage = Intl.NumberFormat("en-US", {
    style: "percent"
  }).format(value / 100);

  if (addPrefix && value > 0) {
    return `+${percentage}`;
  }
  return percentage;
}
