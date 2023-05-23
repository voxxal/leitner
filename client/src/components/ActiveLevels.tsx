import React from "react";
import { Tag } from "react-bulma-components";
interface Props {
  one?: boolean;
  two?: boolean;
  three?: boolean;
  four?: boolean;
  five?: boolean;
  six?: boolean;
  seven?: boolean;
}
const colorIfTrue = (color: string, test: boolean | undefined) => {
  if (test) return color;
  else return "dusty-grey";
};

export default ({ one, two, three, four, five, six, seven }: Props) => {
  return (
    <Tag.Group className="is-centered">
      <Tag size="medium" color={colorIfTrue("dogwood-rose", one)}>
        1
      </Tag>
      <Tag size="medium" color={colorIfTrue("paradise-pink", two)}>
        2
      </Tag>
      <Tag size="medium" color={colorIfTrue("bittersweet", three)}>
        3
      </Tag>
      <Tag size="medium" color={colorIfTrue("lemon-yellow-crayola", four)}>
        4
      </Tag>
      <Tag size="medium" color={colorIfTrue("caribbean-green", five)}>
        5
      </Tag>
      <Tag size="medium" color={colorIfTrue("persian-green", six)}>
        6
      </Tag>
      <Tag size="medium" color={colorIfTrue("metallic-seaweed", seven)}>
        7
      </Tag>
      <Tag size="medium" color="blue-sapphire">
        👼
      </Tag>
    </Tag.Group>
  );
};
