/**
 * @see https://github.com/sersavan/shadcn-multi-select-component
 */

import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, ChevronDown, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  useState,
} from "react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

/**
 * Variants for the multi-select component to handle different styles.
 * Uses class-variance-authority (cva) to define different styles based on "variant" prop.
 */
const multiSelectVariants = cva(
  "m-1 cursor-default transition delay-150 duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void;

  /** The selected values */
  value?: string[];

  /** The default selected values when the component mounts. */
  defaultValue?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * @default "Select options"
   */
  placeholder?: string;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * @default 3
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * @default false
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * @default false
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;

  contentProps?: ComponentPropsWithoutRef<typeof PopoverContent>;
}

export const MultiSelect = ({
  options,
  onValueChange,
  variant,
  value,
  defaultValue = [],
  placeholder = "Select options",
  maxCount = 3,
  modalPopover = false,
  asChild = false,
  className,
  contentProps,
  ...props
}: MultiSelectProps) => {
  const [selectedValues, setSelectedValues] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setIsPopoverOpen(true);
    } else if (event.key === "Backspace" && !event.currentTarget.value) {
      const newSelectedValues = [...(selectedValues ?? [])];
      newSelectedValues.pop();
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    }
  };

  const toggleOption = (option: string) => {
    const newSelectedValues = selectedValues?.includes(option)
      ? selectedValues.filter((value) => value !== option)
      : [...(selectedValues ?? []), option];
    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);
  };

  const handleClear = () => {
    setSelectedValues([]);
    onValueChange([]);
  };

  const handleTogglePopover = () => {
    setIsPopoverOpen((prev) => !prev);
  };

  const clearExtraOptions = () => {
    const newSelectedValues = (selectedValues ?? []).slice(0, maxCount);
    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);
  };

  const toggleAll = () => {
    if (selectedValues?.length === options.length) {
      handleClear();
    } else {
      const allValues = options.map((option) => option.value);
      setSelectedValues(allValues);
      onValueChange(allValues);
    }
  };

  return (
    <Popover
      modal={modalPopover}
      onOpenChange={setIsPopoverOpen}
      open={isPopoverOpen}
    >
      <PopoverTrigger asChild>
        <Button
          asChild={asChild}
          className={cn(
            "min-h-10 flex h-auto w-full cursor-default items-center justify-between p-1 [&_svg]:pointer-events-auto",
            className,
          )}
          variant="outline"
          {...props}
          onClick={handleTogglePopover}
        >
          {Boolean(selectedValues?.length) ? (
            <div className="flex w-full items-stretch justify-between">
              <div className="flex flex-wrap items-center">
                {selectedValues?.slice(0, maxCount).map((value) => {
                  const option = options.find((o) => o.value === value);
                  const IconComponent = option?.icon;
                  return (
                    <Badge
                      className={multiSelectVariants({ variant })}
                      key={value}
                    >
                      {IconComponent && (
                        <IconComponent className="mr-2 h-4 w-4" />
                      )}
                      {option?.label}
                      <XIcon
                        className="hover:bg-accent ml-2 h-4 w-4 cursor-pointer rounded-sm"
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleOption(value);
                        }}
                      />
                    </Badge>
                  );
                })}
                {selectedValues?.length && selectedValues?.length > maxCount ? (
                  <Badge
                    className={multiSelectVariants({
                      variant,
                      className:
                        "text-foreground border-foreground/1 bg-transparent hover:bg-transparent",
                    })}
                  >
                    {`+ ${selectedValues?.length - maxCount} more`}
                    <XIcon
                      className="hover:bg-primary-foreground ml-2 h-4 w-4 cursor-pointer rounded-sm"
                      onClick={(event) => {
                        event.stopPropagation();
                        clearExtraOptions();
                      }}
                    />
                  </Badge>
                ) : null}
              </div>
              <div className="flex items-center justify-between">
                <XIcon
                  className="text-muted-foreground hover:bg-primary-foreground mx-2 h-4 cursor-pointer rounded-sm"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleClear();
                  }}
                />
                <Separator
                  className="min-h-6 flex h-full"
                  orientation="vertical"
                />
                <ChevronDown className="text-muted-foreground hover:bg-primary-foreground mx-2 h-4 cursor-pointer rounded-sm" />
              </div>
            </div>
          ) : (
            <div className="mx-auto flex w-full items-center justify-between">
              <span className="text-muted-foreground mx-3 text-sm">
                {placeholder}
              </span>
              <ChevronDown className="text-muted-foreground mx-2 h-4 cursor-pointer" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        {...contentProps}
        className={cn("w-auto p-0", contentProps?.className)}
        onEscapeKeyDown={() => setIsPopoverOpen(false)}
      >
        <Command>
          <CommandInput
            onKeyDown={handleInputKeyDown}
            placeholder="Search..."
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                className="cursor-pointer"
                key="all"
                onSelect={toggleAll}
              >
                <div
                  className={cn(
                    "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                    selectedValues?.length === options.length
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible",
                  )}
                >
                  <CheckIcon className="h-4 w-4" />
                </div>
                <span>(Select All)</span>
              </CommandItem>
              {options.map((option) => {
                const isSelected = selectedValues?.includes(option.value);
                return (
                  <CommandItem
                    className="cursor-pointer"
                    key={option.value}
                    onSelect={() => toggleOption(option.value)}
                  >
                    <div
                      className={cn(
                        "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    {option.icon && (
                      <option.icon className="text-muted-foreground mr-2 h-4 w-4" />
                    )}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <div className="flex items-center justify-between">
                {Boolean(selectedValues?.length) ? (
                  <>
                    <CommandItem
                      className="flex-1 cursor-pointer justify-center"
                      onSelect={handleClear}
                    >
                      Clear
                    </CommandItem>
                    <Separator
                      className="min-h-6 flex h-full"
                      orientation="vertical"
                    />
                  </>
                ) : null}
                <CommandItem
                  className="max-w-full flex-1 cursor-pointer justify-center"
                  onSelect={() => setIsPopoverOpen(false)}
                >
                  Close
                </CommandItem>
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
