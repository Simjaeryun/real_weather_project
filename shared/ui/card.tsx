import { ReactNode } from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
 
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
