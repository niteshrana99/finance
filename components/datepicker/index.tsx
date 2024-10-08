import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const DatePicker = ({ value, onChange, disabled } : any) => {

  console.log(value)

    const onDateSelect = (value: any) => {
      onChange(format(value, 'yyyy-MM-dd'));
    }


    return <Popover>
    <PopoverTrigger asChild>
      <Button
        className={cn(
          "w-[280px] justify-start text-left font-normal",
          !value && "text-muted-foreground"
        )}
        variant='ghost'
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {value ? format(value, 'yyyy-MM-dd') : <div>Pick a date</div>}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0">
      <Calendar
        mode="single"
        selected={value}
        onSelect={onDateSelect}
        initialFocus
        disabled={disabled}
      />
    </PopoverContent>
  </Popover>
}

export default DatePicker;