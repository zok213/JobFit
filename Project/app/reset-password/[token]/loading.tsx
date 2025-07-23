export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-300"></div>
      <span className="ml-3 text-lime-900">Loading reset password page...</span>
    </div>
  );
} 