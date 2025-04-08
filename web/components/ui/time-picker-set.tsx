"use client";

import { Label } from "@/components/ui/label";
import { TimePeriodSelect, TimePicker } from "./time-picker";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { ComponentPropsWithRef, useRef } from "react";
import { Period } from "./time-picker-utils";
import { z } from "zod";
import { cn } from "@/lib/utils";

interface TimePickerDemoProps extends ComponentPropsWithRef<"div"> {
  date?: Date | undefined;
  setDate?: (date: Date | undefined) => void;
  period?: Period;
  setPeriod?: (m: Period) => void;
  display?: Partial<z.TypeOf<typeof displaySchema>>;
}

const displaySchema = z
  .object({
    label: z.boolean().optional().default(true),
    period: z.boolean().optional().default(true),
    seconds: z.boolean().optional().default(true),
  })
  .default({
    label: true,
    period: true,
    seconds: true,
  });

export function TimePickerSet({
  date: _date,
  setDate: _setDate,
  period: _period,
  setPeriod: _setPeriod,
  display: _display,
  className,
  ...props
}: TimePickerDemoProps) {
  const display = displaySchema.parse(_display);
  const [date, setDate] = useControllableState({
    prop: _date,
    onChange: _setDate,
  });
  const [period, setPeriod] = useControllableState({
    prop: _period,
    onChange: _setPeriod,
  });

  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);
  const periodRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={cn("flex items-end gap-2", className)} {...props}>
      <div className="grid gap-1 text-center">
        {display.label ? (
          <Label className="text-xs" htmlFor="hours">
            Hours
          </Label>
        ) : null}
        <TimePicker
          date={date}
          onRightFocus={() => minuteRef.current?.focus()}
          picker="hours"
          ref={hourRef}
          setDate={setDate}
        />
      </div>
      <div className="grid gap-1 text-center">
        {display.label ? (
          <Label className="text-xs" htmlFor="minutes">
            Minutes
          </Label>
        ) : null}
        <TimePicker
          date={date}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => {
            if (display.seconds) secondRef.current?.focus();
            else if (display.period) periodRef.current?.focus();
          }}
          picker="minutes"
          ref={minuteRef}
          setDate={setDate}
        />
      </div>
      {display.seconds ? (
        <div className="grid gap-1 text-center">
          {display.label ? (
            <Label className="text-xs" htmlFor="seconds">
              Seconds
            </Label>
          ) : null}
          <TimePicker
            date={date}
            onLeftFocus={() => minuteRef.current?.focus()}
            onRightFocus={() => {
              if (display.period) periodRef.current?.focus();
            }}
            picker="seconds"
            ref={secondRef}
            setDate={setDate}
          />
        </div>
      ) : null}
      {display.period ? (
        <div className="grid gap-1 text-center">
          {display.label ? (
            <Label className="text-xs" htmlFor="period">
              Period
            </Label>
          ) : null}
          <TimePeriodSelect
            date={date}
            id="period"
            onLeftFocus={() => {
              if (display.seconds) secondRef.current?.focus();
              else minuteRef.current?.focus();
            }}
            period={period}
            ref={periodRef}
            setDate={setDate}
            setPeriod={setPeriod}
          />
        </div>
      ) : null}
    </div>
  );
}
