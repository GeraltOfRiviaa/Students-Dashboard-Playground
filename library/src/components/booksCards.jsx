import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const BooksCard = ({book}) => {
    return (
    <Card className="@container relative mx-auto w-full max-w-sm h-full m-3">
        <CardHeader>

            <CardTitle>
                <div className="flex flex-row gap-3 w-full">
                    <div>
                        <img src={book.coverUrl} className="h-[clamp(2.5rem,15cqw,4rem)] w-[clamp(1.5rem,15cqw,2.5rem)] shrink-0 rounded" alt="Book Cover"/>
                    </div>
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <div className="h-4 w-full max-w-64 rounded ">
                            <p>{book.title}</p>
                        </div>
                        <div className="h-2 w-full max-w-64 rounded ">
                            <p>{book.author.name} {book.author.surname}</p>
                        </div>
                    </div>
                </div>
            </CardTitle>
        </CardHeader>
        <CardContent>
                <div>
                    <p>{book.description}</p>
                </div>
                
                
        </CardContent>
        <CardFooter>
                    <div className="flex flex-row flex-wrap gap-2">
                    {book.genres.map((genre) => (
                        <span
                            key={genre}
                            className="rounded bg-blue-500 dark:bg-gray-800 px-2 py-0.5 text-xs text-white"
                        >
                            {genre}
                        </span>
                    ))}
                    <span className="rounded  dark:bg-gray-800 px-2 py-0.5 text-xs ">pages: {book.pages}</span>
                    <span className="rounded  dark:bg-gray-800 px-2 py-0.5 text-xs">
                        {new Date(book.releaseDate).getFullYear()}
                    </span>
                    </div>
        </CardFooter>
    </Card>
    )
}

export default BooksCard