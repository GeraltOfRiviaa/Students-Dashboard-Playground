

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from 'react-router-dom';
import { getEndpoint, getApiOptions } from '@/api';
import { useState, useEffect } from 'react';

const endpoint = getEndpoint();
const options = getApiOptions();

export default function Detail() {
  const { id } = useParams();
  const [bookError, setBookError] = useState('');
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    
    fetch(`${endpoint}/${id}`, options)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => { 
        if (!cancelled) {
          setBook(data);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          console.error(`Error fetching the book: ${e}`);
          setBookError('Error fetching the book. Please try again later.');
          setIsLoading(false);
        }
      });
      
    return () => { cancelled = true; };
  }, [id]);

  if (bookError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-5">
        <p className="text-red-500 font-medium">{bookError}</p>
      </div>
    );
  }

  return (
    <main className="mt-3 mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 bg-white p-5 md:grid md:grid-cols-[300px_1fr] md:p-10">
      
      {/* Left Column: Cover Preview */}

      { isLoading ?
      
      <section
        aria-label="Book cover preview"
        className="flex h-10 flex-col items-center justify-center gap-4 rounded-xl bg-slate-900 p-8 shadow-lg "
      >
        
        
        <article className="flex h-64 w-44 flex-col justify-between rounded border-2 border-amber-500 bg-slate-800 p-5 shadow-inner">
          <header className="flex w-full flex-col gap-3">
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-3/4 bg-slate-600" />
                <Skeleton className="h-6 w-1/2 bg-slate-600" />
              </>
            ) : (
              <h2 className="font-sans text-lg font-bold text-white leading-tight">
                {book?.title}
              </h2>
            )}
            <span aria-hidden="true" className="h-1 w-10 bg-amber-500" />
          </header>
          
          {isLoading ? (
            <Skeleton className="h-4 w-full bg-slate-600" />
          ) : (
            <p className="font-mono text-xs text-gray-300 uppercase tracking-wider">
              {book?.author?.name} {book?.author?.surname}
            </p>
          )}
        </article>
        
        
      </section>
      :
      <div className="flex h-fit flex-col items-center justify-center gap-4 rounded-xl bg-slate-900 p-8 shadow-lg">
        <img src={book.coverUrl}/>
      </div> 
      } 
     
      
      

      

      {/* Right Column: Book Details */}
      <div className="flex flex-col gap-6">
        <Card className="w-full rounded-xl border-border bg-white shadow-sm">
          <CardContent className="flex flex-col gap-6 p-6">
            
            {/* Header / Title */}
            <header className="flex flex-col gap-2">
              {isLoading ? (
                <Skeleton className="h-8 w-2/3" />
              ) : (
                <h1 className="font-sans text-3xl font-extrabold text-gray-900">
                  {book?.title}
                </h1>
              )}

              {isLoading ? (
                <Skeleton className="h-5 w-1/3" />
              ) : (
                <p className="flex items-center gap-2 text-gray-600">
                  <span className="font-semibold">
                    {book?.author?.name} {book?.author?.surname}
                  </span>
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                  <span className="text-sm">
                    {book?.author?.nationality || 'Unknown'}
                  </span>
                </p>
              )}
            </header>

            {/* Genres */}
            <div className="flex flex-wrap items-start gap-2" aria-label="Genres">
              {isLoading ? (
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ) : (
                (book?.genres || ["N/A"]).map((genre) => (
                  <Badge key={genre} variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">
                    {genre}
                  </Badge>
                ))
              )}
            </div>

            <Separator className="bg-gray-100" />

            {/* Synopsis */}
            <section className="flex flex-col gap-2" aria-labelledby="synopsis">
              <h2 id="synopsis" className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                Synopsis
              </h2>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-gray-600">
                  {book?.description || "No synopsis available for this title."}
                </p>
              )}
            </section>

            <Separator className="bg-gray-100" />

            {/* Metadata Dictionary */}
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                { label: "Page Count", value: book?.pages || "N/A" },
                { 
                  label: "Release Date", 
                  value: book?.releaseDate 
                    ? new Date(book.releaseDate).toLocaleDateString('en-GB', { year: 'numeric' })
                    : "N/A" 
                },
              ].map((detail) => (
                <div key={detail.label} className="flex flex-col gap-1">
                  <dt className="text-xs font-medium text-gray-500">{detail.label}</dt>
                  {isLoading ? (
                    <Skeleton className="h-4 w-24" />
                  ) : (
                    <dd className="font-mono text-sm font-semibold text-gray-900">{detail.value}</dd>
                  )}
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Button
          type="button"
          disabled={isLoading || bookError}
          className="h-12 w-full rounded-lg bg-blue-600 text-base font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
        >
          Borrow Book
        </Button>
      </div>
    </main>
  );
}