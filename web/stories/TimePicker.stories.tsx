import type { Meta, StoryObj } from "@storybook/react";

import { TimePicker } from "@/components/ui/time-picker";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Primitive/TimePicker",
  component: TimePicker,
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
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
/**
 * parent wrapper components
 */
export const Hour: Story = {
  args: {
    picker: "hours",
  },
};
export const Minutes: Story = {
  args: {
    picker: "minutes",
  },
};
export const Seconds: Story = {
  args: {
    picker: "seconds",
  },
};
export const Period: Story = {
  args: {
    picker: "12hours",
  },
};
