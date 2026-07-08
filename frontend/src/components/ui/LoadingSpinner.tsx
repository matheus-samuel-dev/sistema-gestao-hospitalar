export function LoadingSpinner() {
  return (
    <div className="grid min-h-[320px] place-items-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-primary" />
    </div>
  );
}
