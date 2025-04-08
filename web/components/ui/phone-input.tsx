/**
 * @see https://github.com/omeralpi/shadcn-phone-input
 */

import { CheckIcon, ChevronsUpDown } from "lucide-react";
import RPNInput, {
  Value,
  Country,
  FlagProps,
  getCountryCallingCode,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ComponentPropsWithRef } from "react";

interface PhoneInputProps
  extends Omit<ComponentPropsWithRef<typeof RPNInput>, "onChange"> {
  /**
   * Handles the onChange event.
   *
   * react-phone-number-input might trigger the onChange event as undefined
   * when a valid phone number is not entered. To prevent this,
   * the value is coerced to an empty string.
   *
   * @param value - The entered value
   */
  onChange?: (value?: Value) => void;
}

const PhoneInput = ({ className, onChange, ...props }: PhoneInputProps) => (
  <RPNInput
    className={cn("flex", className)}
    countrySelectComponent={CountrySelect}
    flagComponent={FlagComponent}
    inputComponent={InputComponent}
    onChange={(value) => {
      if (onChange) onChange(value || ("" as Value));
    }}
    smartCaret={false}
    {...props}
  />
);

const InputComponent = ({
  className,
  ...props
}: ComponentPropsWithRef<"input">) => (
  <Input className={cn("rounded-e-lg rounded-s-none", className)} {...props} />
);

type CountryEntry = { label: string; value: Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: Country;
  options: CountryEntry[];
  onChange: (country: Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        className="flex gap-1 rounded-e-none rounded-s-lg border-r-0 px-3 focus:z-10"
        disabled={disabled}
        type="button"
        variant="outline"
      >
        <FlagComponent
          country={selectedCountry}
          countryName={selectedCountry}
        />
        <ChevronsUpDown
          className={cn(
            "size-4 -mr-2 opacity-50",
            disabled ? "hidden" : "opacity-100",
          )}
        />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[300px] p-0">
      <Command>
        <CommandInput placeholder="Search country..." />
        <CommandList>
          <ScrollArea className="h-72">
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countryList.map(({ value, label }) =>
                value ? (
                  <CountrySelectOption
                    country={value}
                    countryName={label}
                    key={value}
                    onChange={onChange}
                    selectedCountry={selectedCountry}
                  />
                ) : null,
              )}
            </CommandGroup>
          </ScrollArea>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
);

interface CountrySelectOptionProps extends FlagProps {
  selectedCountry: Country;
  onChange: (country: Country) => void;
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
}: CountrySelectOptionProps) => (
  <CommandItem className="gap-2" onSelect={() => onChange(country)}>
    <FlagComponent country={country} countryName={countryName} />
    <span className="flex-1 text-sm">{countryName}</span>
    <span className="text-foreground/50 text-sm">{`+${getCountryCallingCode(country)}`}</span>
    <CheckIcon
      className={`size-4 ml-auto ${country === selectedCountry ? "opacity-100" : "opacity-0"}`}
    />
  </CommandItem>
);

const FlagComponent = ({ country, countryName }: FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="bg-foreground/20 [&_svg]:size-full flex h-4 w-6 overflow-hidden rounded-sm">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export { PhoneInput };
