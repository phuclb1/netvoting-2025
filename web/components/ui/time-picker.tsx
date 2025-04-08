/**
 * @see https://time.openstatus.dev/
 */

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ComponentPropsWithRef, useEffect, useMemo, useState } from "react";
import {
  Period,
  TimePickerType,
  display12HourValue,
  getArrowByType,
  getDateByType,
  setDateByType,
} from "./time-picker-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

export interface TimePickerProps
  extends Omit<ComponentPropsWithRef<"input">, "defaultValue"> {
  picker: TimePickerType;
  date?: Date | undefined;
  setDate?: (date: Date | undefined) => void;
  defaultValue?: Date;
  period?: Period;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
}

export function TimePicker({
  className,
  type = "tel",
  value,
  id,
  name,
  date: _date,
  setDate: _setDate,
  defaultValue = new Date(new Date().setHours(0, 0, 0, 0)),
  onChange,
  onKeyDown,
  picker,
  period,
  onLeftFocus,
  onRightFocus,
  ...props
}: TimePickerProps) {
  const [date, setDate] = useControllableState({
    prop: _date,
    onChange: _setDate,
    defaultProp: defaultValue,
  });
  const [flag, setFlag] = useState<boolean>(false);
  const [prevIntKey, setPrevIntKey] = useState<string>("0");

  /**
   * allow the user to enter the second digit within 2 seconds
   * otherwise start again with entering first digit
   */
  useEffect(() => {
    if (flag) {
      const timer = setTimeout(() => {
        setFlag(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [flag]);

  const calculatedValue = useMemo(
    () => (!date ? "00" : getDateByType(date, picker)),
    [date, picker],
  );

  const calculateNewValue = (key: string) => {
    /*
     * If picker is '12hours' and the first digit is 0, then the second digit is automatically set to 1.
     * The second entered digit will break the condition and the value will be set to 10-12.
     */
    if (picker === "12hours") {
      if (flag && calculatedValue.slice(1, 2) === "1" && prevIntKey === "0")
        return "0" + key;
    }

    return !flag ? "0" + key : calculatedValue.slice(1, 2) + key;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") return;
    e.preventDefault();
    if (e.key === "ArrowRight") onRightFocus?.();
    if (e.key === "ArrowLeft") onLeftFocus?.();
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      const step = e.key === "ArrowUp" ? 1 : -1;
      const newValue = getArrowByType(calculatedValue, step, picker);
      if (flag) setFlag(false);
      const tempDate = !date ? new Date() : new Date(date);
      setDate(setDateByType(tempDate, newValue, picker, period));
    }
    if (e.key >= "0" && e.key <= "9") {
      if (picker === "12hours") setPrevIntKey(e.key);

      const newValue = calculateNewValue(e.key);
      if (flag) onRightFocus?.();
      setFlag((prev) => !prev);
      const tempDate = !date ? new Date() : new Date(date);
      setDate(setDateByType(tempDate, newValue, picker, period));
    }
  };

  return (
    <Input
      className={cn(
        "focus:bg-accent focus:text-accent-foreground w-[48px] text-center font-mono text-base tabular-nums caret-transparent [&::-webkit-inner-spin-button]:appearance-none",
        className,
      )}
      id={id || picker}
      inputMode="decimal"
      name={name || picker}
      onChange={(e) => {
        e.preventDefault();
        onChange?.(e);
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        handleKeyDown(e);
      }}
      type={type}
      value={value || calculatedValue}
      {...props}
    />
  );
}
export interface PeriodSelectorProps
  extends Omit<ComponentPropsWithRef<typeof SelectTrigger>, "onKeyDown"> {
  period?: Period;
  setPeriod?: (m: Period) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
}

export const TimePeriodSelect = ({
  period: _period,
  setPeriod: _setPeriod,
  date,
  setDate,
  onLeftFocus,
  onRightFocus,
  className,
  ...props
}: PeriodSelectorProps) => {
  const [period, setPeriod] = useControllableState({
    prop: _period,
    onChange: _setPeriod,
    defaultProp: "AM",
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowRight") onRightFocus?.();
    if (e.key === "ArrowLeft") onLeftFocus?.();
  };

  const handleValueChange = (value: Period) => {
    setPeriod?.(value);

    /**
     * trigger an update whenever the user switches between AM and PM;
     * otherwise user must manually change the hour each time
     */
    if (date) {
      const tempDate = new Date(date);
      const hours = display12HourValue(date.getHours());
      setDate(
        setDateByType(
          tempDate,
          hours.toString(),
          "12hours",
          period === "AM" ? "PM" : "AM",
        ),
      );
    }
  };

  return (
    <div className="flex h-10 items-center">
      <Select
        onValueChange={(value: Period) => handleValueChange(value)}
        value={period}
      >
        <SelectTrigger
          className={cn(
            "focus:bg-accent focus:text-accent-foreground w-[65px]",
            className,
          )}
          onKeyDown={handleKeyDown}
          {...props}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
