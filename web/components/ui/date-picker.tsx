/**
 * @see https://time.openstatus.dev/
 */

import { add, format, isValid } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ComponentPropsWithoutRef,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { TimePickerSet } from "./time-picker-set";

export function DatePicker({
  date: _date,
  setDate: _setDate,
  formatting = "PPP",
  timeSelector,
  todayButton,
}: {
  /**
   * a button that sets the calendar to today's date
   */
  todayButton?: boolean;
  date?: Date;
  setDate?: Dispatch<SetStateAction<Date>>;
  /**
   * @see https://date-fns.org/v4.1.0/docs/format
   */
  formatting?: string;
  timeSelector?:
  | boolean
  | Omit<ComponentPropsWithoutRef<typeof TimePickerSet>, "date" | "setDate">;
}) {
  const [date, setDate] = useControllableState({
    prop: _date,
    onChange: _setDate,
  });

  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!date) {
      setDate(newDay);
      return;
    }
    const diff = newDay.getTime() - date.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(date, { days: Math.ceil(diffInDays) });
    setDate(newDateFull);
  };

  const dateLabel = useMemo(() => {
    if (date) {
      if (!isValid(date)) return "Invalid date";
      return format(date, formatting);
    }
    return "Pick a date";
  }, [date, formatting]);

  const timeSelectorProps =
    timeSelector === true
      ? {}
      : typeof timeSelector === "object"
        ? timeSelector
        : false;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
          variant={"outline"}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{dateLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          initialFocus
          mode="single"
          onSelect={(d) => handleSelect(d)}
          selected={date}
        />

        {todayButton || timeSelectorProps ? (
          <div className="border-border flex flex-col gap-2 border-t p-3">
            {timeSelectorProps ? (
              <TimePickerSet
                {...(typeof timeSelector === "boolean" ? {} : timeSelector)}
                className={cn("justify-around", timeSelectorProps.className)}
                date={date}
                setDate={setDate}
              />
            ) : null}
            {todayButton ? (
              <Button
                className="w-full"
                onClick={() =>
                  handleSelect(new Date(new Date().setHours(0, 0, 0, 0)))
                }
                variant="outline"
              >
                Today
              </Button>
            ) : null}
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
