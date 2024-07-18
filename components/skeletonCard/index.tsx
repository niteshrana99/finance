import { Skeleton } from "@/components/ui/skeleton"
import { Loader } from "lucide-react"

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[800px]" />
        <Skeleton className="h-4 w-[500px]" />
      </div>
    </div>
  )
}
