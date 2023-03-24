import clsx from 'clsx';
import { ReactNode } from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Container({ children, className }: ContainerProps) {
  return <div className={clsx('max-w-3xl mx-auto', className)}>{children}</div>;
}
