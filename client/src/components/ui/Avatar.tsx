interface AvatarProps {
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg";
}

export default function Avatar({
  name = "User",
  src,
  size = "md",
}: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-12 w-12 text-base",
  };

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-neutral-900 font-medium text-white ${sizes[size]}`}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
