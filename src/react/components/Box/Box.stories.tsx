import { FC, ComponentProps } from "react";

import { Story } from "@storybook/react/";

import { Box } from "./Box";

export default {
  title: "Box",
};

const Template: Story<ComponentProps<typeof Box>> = (args) => <Box {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  contents: ["hoge", "fuga", "piyo"],
  borderColor: "rebeccapurple",
  borderWidth: "4px",
  borderRadius: "8px",
};

export const Secondary = Template.bind({});
Secondary.args = {
  contents: ["hoge"],
};
