import type { Meta, StoryObj } from "@storybook/react";

import { MultiSelect } from "@/components/ui/multi-select";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Primitive/MultiSelect",
  component: MultiSelect,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: undefined,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const selectOptions = [
  { label: "Hello", value: "hello" },
  { label: "World", value: "world" },
  { label: "Foo", value: "foo" },
  { label: "Bar", value: "bar" },
  { label: "Baz", value: "baz" },
  { label: "Foobar", value: "foobar" },
];

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    options: selectOptions,
    onValueChange: () => {},
  },
};

/**
 * pass `w-[var(--radix-popover-trigger-width)]` to `contentProps` classname to
 * have unified width between the trigger and content
 * */
export const UnifiedWidth: Story = {
  args: {
    contentProps: {
      className: "w-[var(--radix-popover-trigger-width)]",
    },
    options: selectOptions,
    onValueChange: () => {},
  },
};
