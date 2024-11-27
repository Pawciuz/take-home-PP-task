import { FC, ReactNode } from "react";
import { XMarkIcon } from "./icons";

type ButtonProps = React.ComponentProps<"button">;
type ToggleButtonProps = {
  isToggled: boolean;
  onToggle: () => void;
  className?: string;
  children?: ReactNode;
};

export const ExpandButton: FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      className="hover:text-gray-700 transition-colors flex items-center justify-center"
      {...props}
    >
      {children}
    </button>
  );
};

export const DeleteButton: FC<Omit<ButtonProps, "children">> = (props) => {
  return (
    <button
      className="hover:text-gray-700 transition-colors flex items-center justify-center"
      {...props}
    >
      <XMarkIcon />
    </button>
  );
};

export const ToggleButton: FC<ToggleButtonProps> = ({
  isToggled,
  onToggle,
  className = "",
  children,
}) => {
  return (
    <button
      onClick={onToggle}
      className={`
        text-white text-sm
        transition-colors
        hover:bg-gray-800
        bg-black
        rounded
        px-3
        py-1
        ${className}
        ${isToggled ? "bg-red-500" : "bg-green-500"}
      `}
    >
      {children || (isToggled ? "ON" : "OFF")}
    </button>
  );
};
