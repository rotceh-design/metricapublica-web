import { ContentImage } from "@/types/content-image";

type NewsImageStoryProps = {
  images?: ContentImage[];
  title: string;
};

export default function NewsImageStory({ images, title }: NewsImageStoryProps) {
  const validImages = (images || [])
    .filter((image) => image.url)
    .slice(0, 3)
    .sort((a, b) => a.order - b.order);

  if (validImages.length === 0) return null;

  const cover = validImages[0];
  const gallery = validImages.slice(1);

  return (
    <section className="my-10">
      <div className="overflow-hidden rounded-[2rem] border border-[#009B8D]/15 bg-[#08111f] shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
        <div className="relative aspect-[16/9] overflow-hidden bg-[#0a1628]">
          <img
            src={cover.url}
            alt={cover.alt || title}
            className="h-full w-full"
            style={{
              objectFit: cover.fit || "cover",
              objectPosition: cover.position || "center",
            }}
          />

          <div className="absolute inset-0 bg-linear-to-t from-[#08111f]/70 via-transparent to-transparent" />
        </div>

        {gallery.length > 0 && (
          <div
            className={`grid gap-3 p-3 ${
              gallery.length === 1 ? "grid-cols-1" : "md:grid-cols-2"
            }`}
          >
            {gallery.map((image, index) => (
              <figure
                key={`${image.url}-${index}`}
                className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0a1628]"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt || `${title} imagen ${index + 2}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full transition duration-500 group-hover:scale-[1.03]"
                    style={{
                      objectFit: image.fit || "cover",
                      objectPosition: image.position || "center",
                    }}
                  />
                </div>

                {image.alt && (
                  <figcaption className="border-t border-white/10 px-4 py-3 text-sm leading-6 text-slate-400">
                    {image.alt}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}