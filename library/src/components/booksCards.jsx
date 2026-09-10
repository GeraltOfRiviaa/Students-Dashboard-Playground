import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";

import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"

import {Link} from "react-router-dom" 
import {Button} from "@/components/ui/button"
import {InformationCircleIcon} from "@/components/icons/hugeicons-information-circle"

const BooksCard = ({book}) => {
    return (
    <Card className="@container relative mx-auto w-full max-w-sm h-full m-3 flex flex-col">
        <CardHeader>

            <CardTitle>
                <div className="flex flex-row gap-3 w-full">
                    <div>
                        {book.coverUrl ? 
                            (<img src={book.coverUrl} className="h-[clamp(2.5rem,12vw,4rem)] w-[clamp(1.5rem,15vw,2.5rem)] shrink-0 rounded" alt="Book Cover"/>) : 
                            (<div className="h-[clamp(2.5rem,12vw,4rem)] w-[clamp(1.5rem,15vw,2.5rem)] shrink-0 rounded bg-gray-400 dark:bg-gray-800 animate-pulse"/>)}
                        
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <p className="truncate font-medium">{book.title}</p>
                        <p className="truncate text-sm text-muted-foreground">{book.author.name} {book.author.surname}</p>
                    </div>
                </div>
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
                <div>
                    <p className="line-clamp-4">{book.description}</p>
                </div>
        </CardContent> 
        <CardFooter className="h-[clamp(2.5rem,12cqw,4rem)] overflow-hidden  gap-2 items-center justify-between">
            <div className="flex flex-row flex-wrap gap-2 items-center justify-between">
                {book.genres.slice(0, 4).map((genre) => (
                    <Badge key={genre} variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">{genre}</Badge>
                ))}
                {book.genres.length > 4 && (
                    <span className="rounded bg-chart-1 dark:bg-gray-800 px-2 py-0.5 text-xs text-muted-foreground">
                        +{book.genres.length - 4}
                    </span>
                )}
                <TooltipTrigger >
                        <InformationCircleIcon/>
                        <Tooltip>
                            <p>Pages: {book.pages}</p>
                        </Tooltip>
                </TooltipTrigger>
            </div>
            <Link to={`/books/${book._id}`}>
                <Button size="sm" variant="default"className="shrink-0">Detail</Button>
            </Link>
        </CardFooter>
    </Card>
    )
}

export default BooksCard