import { Skeleton } from "@heroui/react";

export const LoadingSkeleton = () => (
  <div className="h-screen flex items-center justify-center bg-gray-900">
    <div className="text-center space-y-6">
      <div className="space-y-3">
        <Skeleton className="w-16 h-16 rounded-full mx-auto bg-gray-800" />
        <Skeleton className="w-48 h-6 rounded-lg mx-auto bg-gray-800" />
        <Skeleton className="w-32 h-4 rounded-lg mx-auto bg-gray-800" />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-8">
        <Skeleton className="w-64 h-32 rounded-xl bg-gray-800" />
        <Skeleton className="w-64 h-32 rounded-xl bg-gray-800" />
        <Skeleton className="w-64 h-32 rounded-xl bg-gray-800" />
      </div>
    </div>
  </div>
);
