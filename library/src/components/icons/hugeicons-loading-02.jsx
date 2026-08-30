import * as React from "react";

export function Loading02Icon({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  className,
  ...props
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}>
      <path
        d="M18.001 20A9.96 9.96 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 .863-.11 1.701-.315 2.5c-.223.867-1.17 1.27-2.015.973c-.718-.253-1.048-1.073-.868-1.813A7 7 0 1 0 15.608 18" />
    </svg>
  );
}
