import type { Meta, StoryObj } from "@storybook/react";
import { DatePicker } from "@/components/ui/date-picker";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Primitive/DatePicker",
  component: DatePicker,
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
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {},
};

export const WithTodayButton: Story = {
  args: { todayButton: true },
};

export const WithTimeSelector: Story = {
  args: {
    timeSelector: true,
  },
};

export const KitchenSink: Story = {
  args: { todayButton: true, timeSelector: true },
};
