"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";

interface GalleryProps {
  images: string[];
  title: string;
}

export function Gallery({ images, title }: GalleryProps) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  const go = (next: number): void => setIndex((next + count) % count);
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === "ArrowRight") go(index + 1);
    if (event.key === "ArrowLeft") go(index - 1);
  };

  if (count === 0) return null;

  return (
    <section aria-roledescription="carousel" aria-label={`${title} photos`} onKeyDown={onKeyDown} className="flex flex-col gap-2">
      <div className="relative overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-900">
        <Image
          src={images[index]}
          alt={`${title}, photo ${index + 1} of ${count}`}
          width={1200}
          height={800}
          unoptimized
          priority
          className="aspect-[3/2] w-full object-cover"
        />
        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => go(index - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/55 px-3 py-2 text-white focus-visible:outline-2 focus-visible:outline-white"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => go(index + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/55 px-3 py-2 text-white focus-visible:outline-2 focus-visible:outline-white"
            >
              ›
            </button>
            <p aria-live="polite" className="absolute bottom-2 right-2 rounded bg-black/55 px-2 py-0.5 text-xs text-white">
              {index + 1} / {count}
            </p>
          </>
        )}
      </div>
      {count > 1 && (
        <ul className="grid grid-cols-4 gap-2">
          {images.map((src, i) => (
            <li key={src + i}>
              <button
                type="button"
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`block w-full overflow-hidden rounded-md border-2 focus-visible:outline-2 focus-visible:outline-teal-600 ${
                  i === index ? "border-teal-600" : "border-transparent opacity-75 hover:opacity-100"
                }`}
              >
                <Image src={src} alt="" width={200} height={133} unoptimized className="aspect-[3/2] w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
