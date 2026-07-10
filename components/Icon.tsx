const ICONS: Record<string, { viewBox: string; path: string; transform: string }> = {
  invest: {
    viewBox: "0 0 24 24",
    transform: "translate(2.291 2.291)",
    path: "M 9.708 19.709 C 4.765 19.644 0.773 15.652 0.708 10.709 C 0.773 5.766 4.765 1.774 9.708 1.709 C 14.651 1.774 18.643 5.766 18.708 10.709 C 18.643 15.652 14.651 19.644 9.708 19.709 Z M 9.708 3.709 C 5.863 3.76 2.759 6.864 2.708 10.709 C 2.759 14.554 5.863 17.658 9.708 17.709 C 13.553 17.658 16.657 14.554 16.708 10.709 C 16.657 6.864 13.553 3.76 9.708 3.709 Z M 14.708 11.709 L 8.708 11.709 L 8.708 5.709 L 10.708 5.709 L 10.708 9.709 L 14.708 9.709 L 14.708 11.709 Z M 18 4.417 L 14.991 1.417 L 16.4 0 L 19.41 3 L 18 4.416 L 18 4.417 Z M 1.415 4.417 L 0 3 L 2.991 0 L 4.406 1.417 L 1.417 4.417 L 1.415 4.417 Z",
  },
  estate: {
    viewBox: "0 0 24 24",
    transform: "translate(2 4)",
    path: "M 18 16 L 2 16 C 0.895 16 0 15.105 0 14 L 0 2 C 0 0.895 0.895 0 2 0 L 18 0 C 19.105 0 20 0.895 20 2 L 20 14 C 20 15.105 19.105 16 18 16 Z M 2 8 L 2 14 L 18 14 L 18 8 L 2 8 Z M 2 2 L 2 4 L 18 4 L 18 2 L 2 2 Z M 11 12 L 4 12 L 4 10 L 11 10 L 11 12 Z",
  },
  tax: {
    viewBox: "0 0 24 24",
    transform: "translate(2 2.999)",
    path: "M 0 5.401 C 0 3.951 0.582 2.562 1.617 1.547 C 2.651 0.531 4.051 -0.026 5.5 0.001 C 7.217 -0.008 8.856 0.72 10 2.001 C 11.144 0.72 12.783 -0.008 14.5 0.001 C 15.949 -0.026 17.349 0.531 18.383 1.547 C 19.418 2.562 20 3.951 20 5.401 C 20 10.757 13.621 14.801 10 18.001 C 6.387 14.774 0 10.761 0 5.401 Z",
  },
};

export default function Icon({
  name,
  size = 22,
}: {
  name: "invest" | "estate" | "tax";
  size?: number;
}) {
  const icon = ICONS[name];
  if (!icon) return null;
  return (
    <svg width={size} height={size} viewBox={icon.viewBox} fill="none">
      <path
        d={icon.path}
        fill="currentColor"
        fillRule="evenodd"
        transform={icon.transform}
      />
    </svg>
  );
}
