export function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-200 h-48 rounded-lg animate-pulse"></div>
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return <div className="bg-gray-200 h-64 rounded-lg animate-pulse"></div>
}
