/**
 * @see https://data-table.openstatus.dev/
 */

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cva } from "class-variance-authority";
import { addDays, addHours, endOfDay, startOfDay } from "date-fns";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { useEffect } from "react";
import { TimePickerSet } from "./time-picker-set";

type DatePreset = {
  label: string;
  from: Date;
  to: Date;
  shortcut: string;
};

const defaultPresets = [
  {
    label: "Today",
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
    shortcut: "d", // day
  },
  {
    label: "Yesterday",
    from: startOfDay(addDays(new Date(), -1)),
    to: endOfDay(addDays(new Date(), -1)),
    shortcut: "y",
  },
  {
    label: "Last hour",
    from: addHours(new Date(), -1),
    to: new Date(),
    shortcut: "h",
  },
  {
    label: "Last 7 days",
    from: startOfDay(addDays(new Date(), -7)),
    to: endOfDay(new Date()),
    shortcut: "w",
  },
  {
    label: "Last 14 days",
    from: startOfDay(addDays(new Date(), -14)),
    to: endOfDay(new Date()),
    shortcut: "b", // bi-weekly
  },
  {
    label: "Last 30 days",
    from: startOfDay(addDays(new Date(), -30)),
    to: endOfDay(new Date()),
    shortcut: "m",
  },
] satisfies DatePreset[];

const kbdVariants = cva(
  "select-none rounded border px-1.5 py-px font-mono text-[0.7rem] font-normal shadow-sm disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground",
        outline: "bg-background text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange | undefined;
  setDate?: (date: DateRange | undefined) => void;
  presets?: DatePreset[];
  /**
   * HH:MM:SS selector
   * @default false
   */
  timeSelector?: boolean;

  /**
   * preset selector
   * @default false
   */
  rangePresets?: boolean;
}

export function DateRangePicker({
  className,
  date: _date,
  setDate: _setDate,
  presets: _presets,
  timeSelector = false,
  rangePresets = false,
}: DateRangePickerProps) {
  const [date, setDate] = useControllableState({
    prop: _date,
    onChange: _setDate,
  });
  // to clean up storybook
  const presets = _presets ?? defaultPresets;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (rangePresets)
        presets.map((preset) => {
          if (preset.shortcut === e.key) {
            setDate({ from: preset.from, to: preset.to });
          }
        });
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setDate, presets, rangePresets]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "hover:bg-muted/50 max-w-full justify-start truncate text-left font-normal",
              !date && "text-muted-foreground",
            )}
            id="date"
            size="sm"
            variant="outline"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <span className="truncate">
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </span>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <div
            className={cn(
              "flex",
              rangePresets ? "justify-between" : "justify-center",
            )}
          >
            {rangePresets ? (
              <>
                <DatePresets
                  onSelect={setDate}
                  presets={presets}
                  selected={date}
                />
                <Separator className="h-auto w-[1px]" orientation="vertical" />
              </>
            ) : null}
            <Calendar
              defaultMonth={date?.from}
              initialFocus
              mode="range"
              numberOfMonths={1}
              onSelect={setDate}
              selected={date}
            />
          </div>
          {timeSelector ? (
            <>
              <Separator />

              <div className="flex flex-col gap-4 p-3 pb-4">
                <p className="text-muted-foreground mx-3 text-xs uppercase">
                  Time
                </p>
                <div className="flex justify-between gap-2 px-3">
                  <TimePickerSet
                    date={date?.from}
                    display={{ label: true, seconds: false }}
                    setDate={(nextDate) =>
                      setDate((prev) => ({ from: nextDate, to: prev?.to }))
                    }
                  />
                  <TimePickerSet
                    date={date?.to}
                    display={{ label: true, seconds: false }}
                    setDate={(nextDate) =>
                      setDate((prev) => ({ from: prev?.from, to: nextDate }))
                    }
                  />
                </div>
              </div>
            </>
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
}

function DatePresets({
  selected,
  onSelect,
  presets,
}: {
  selected: DateRange | undefined;
  onSelect: (date: DateRange | undefined) => void;
  presets: DatePreset[];
}) {
  return (
    <div className="mt-1 flex flex-col gap-5 p-3">
      <p className="text-muted-foreground mx-3 text-xs uppercase">Date Range</p>
      <div className="grid gap-1">
        {presets.map(({ label, shortcut, from, to }) => {
          const isActive = selected?.from === from && selected?.to === to;
          return (
            <Button
              className={cn(
                "flex items-center justify-between gap-6",
                !isActive && "border border-transparent",
              )}
              key={label}
              onClick={() => onSelect({ from, to })}
              size="sm"
              variant={isActive ? "outline" : "ghost"}
            >
              <span className="mr-auto">{label}</span>
              <span className={cn(kbdVariants(), "uppercase")}>{shortcut}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
