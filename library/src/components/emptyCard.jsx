import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const EmptyCard = () => {
    return (
    <Card className="@container relative mx-auto w-full max-w-sm h-max">
        <CardHeader>

            <CardTitle>
                {<div className="flex flex-row gap-3 w-full">
                    <div className="h-[clamp(2.5rem,15cqw,4rem)] w-[clamp(1.5rem,15cqw,2.5rem)] shrink-0 rounded bg-gray-400 dark:bg-gray-800 animate-pulse"/>
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <div className="h-8 w-full max-w-64 rounded bg-gray-400 dark:bg-gray-800 animate-pulse"/>
                        <div className="h-4 w-3/5 max-w-64 rounded bg-gray-400 dark:bg-gray-800 animate-pulse"/>
                    </div>
                </div>}
            </CardTitle>
        </CardHeader>
        <CardContent>
                <div className="h-10 w-full rounded bg-gray-400 dark:bg-gray-800 animate-pulse"/>
        </CardContent>
        <CardFooter>
            {
                <div className="flex flex-row flex-wrap gap-3">
                    <div className="h-[clamp(1rem,5cqw,2rem)] w-[clamp(2rem,25cqw,4rem)] rounded bg-gray-400 dark:bg-gray-800 animate-pulse"/>
                    <div className="h-[clamp(1rem,5cqw,2rem)] w-[clamp(2rem,25cqw,4rem)] rounded bg-gray-400 dark:bg-gray-800 animate-pulse"/>
                    <div className="h-[clamp(1rem,5cqw,2rem)] w-[clamp(2rem,25cqw,4rem)] rounded bg-gray-400 dark:bg-gray-800 animate-pulse"/>
                </div>
            }
        </CardFooter>
    </Card>
    )
}

export default EmptyCard