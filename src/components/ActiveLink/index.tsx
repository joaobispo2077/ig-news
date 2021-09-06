import React, { cloneElement, ReactElement } from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';

export type ActiveLinkProps = {
  children: ReactElement;
  activeClassName: string;
} & LinkProps;

export const ActiveLink = ({
  children,
  activeClassName,
  ...rest
}: ActiveLinkProps) => {
  const { asPath } = useRouter();

  const className = rest.href === asPath ? activeClassName : '';

  return (
    <Link {...rest}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  );
};
