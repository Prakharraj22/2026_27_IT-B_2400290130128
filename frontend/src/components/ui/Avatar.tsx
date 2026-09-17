interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
}

export function Avatar({ name, color = '#96421F', size = 40 }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-display font-semibold text-white"
      style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.38 }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
