type Props = {
  name?: string | null;
  email?: string | null;
  pictureUrl?: string | null;
  size?: number;
};

function initials(name?: string | null, email?: string | null): string {
  const source = (name ?? email ?? "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function UserAvatar({ name, email, pictureUrl, size = 32 }: Props) {
  if (pictureUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={pictureUrl}
        alt={name ?? email ?? "User"}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="rounded-full bg-[#0d1f35] text-white flex items-center justify-center text-xs font-medium"
      style={{ width: size, height: size }}
      aria-label={name ?? email ?? "User"}
    >
      {initials(name, email)}
    </div>
  );
}

export default UserAvatar;
