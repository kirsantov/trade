"use client";

import Link from 'next/link';
import { trackRegistryAccess } from '@/lib/firebase';

interface RegistryLinkProps {
  href: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}

export function RegistryLink({ href, title, className, children }: RegistryLinkProps) {
  const handleClick = () => {
    trackRegistryAccess(title, href);
  };

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </Link>
  );
}