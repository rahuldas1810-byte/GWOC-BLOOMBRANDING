'use client'

export default function AdminLoading() {
    return (
        <div className="w-full h-full space-y-8 animate-in fade-in duration-500">

            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-8">
                <div className="h-10 w-1/3 bg-dark-choc/5 rounded-xl animate-pulse" />
                <div className="h-10 w-32 bg-dark-choc/5 rounded-xl animate-pulse" />
            </div>

            {/* Stats/Cards Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-dark-choc/5 shadow-sm space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="h-10 w-10 rounded-full bg-dark-choc/5 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 w-1/2 bg-dark-choc/5 rounded animate-pulse" />
                            <div className="h-8 w-3/4 bg-dark-choc/10 rounded animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content / Table Skeleton */}
            <div className="bg-white rounded-2xl border border-dark-choc/5 shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="border-b border-dark-choc/5 bg-earl-gray/30 p-4">
                    <div className="flex gap-4">
                        <div className="h-6 w-1/4 bg-dark-choc/5 rounded animate-pulse" />
                        <div className="h-6 w-1/4 bg-dark-choc/5 rounded animate-pulse" />
                        <div className="h-6 w-1/4 bg-dark-choc/5 rounded animate-pulse" />
                        <div className="h-6 w-1/4 bg-dark-choc/5 rounded animate-pulse" />
                    </div>
                </div>
                {/* Table Rows */}
                <div className="p-4 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-4 items-center">
                            <div className="h-12 w-12 rounded-lg bg-dark-choc/5 animate-pulse" />
                            <div className="h-4 flex-1 bg-dark-choc/5 rounded animate-pulse" />
                            <div className="h-4 flex-1 bg-dark-choc/5 rounded animate-pulse" />
                            <div className="h-4 w-24 bg-dark-choc/5 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
