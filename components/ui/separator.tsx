import React from "react";

type Props = {
  className?: string;
};

export function Separator({ className = "" }: Props) {
  return <hr className={`border-slate-200 ${className}`} />;
}
