import { UserRound } from 'lucide-react';
import { cn } from './cn';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-11 w-11 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-2xl'
};

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <div className={cn('flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-white ring-4 ring-white/20', sizes[size], className)}>
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials || <UserRound size={18} />}
    </div>
  );
}
