export default function Moon({ size = 22, className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.6 14.2A8.6 8.6 0 0 1 9.8 3.4a8.6 8.6 0 1 0 10.8 10.8z" fill="currentColor" />
      <circle cx="17.5" cy="5.5" r="1.1" fill="currentColor" opacity="0.55" />
      <circle cx="20.6" cy="9" r="0.7" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
