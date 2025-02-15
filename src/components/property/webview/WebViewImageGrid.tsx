
interface WebViewImageGridProps {
  images: string[];
}

export function WebViewImageGrid({ images }: WebViewImageGridProps) {
  if (!images || images.length === 0) return null;

  return (
    <div className="grid grid-cols-4 gap-4 px-6">
      {images.slice(0, 4).map((image, index) => (
        <div key={index} className="relative">
          <img
            src={image}
            alt={`Grid ${index + 1}`}
            className="w-full aspect-video object-cover rounded-lg"
          />
          <div 
            className="absolute inset-0 rounded-lg"
            style={{ backgroundColor: `rgba(126, 105, 171, 0.6)` }}
          />
        </div>
      ))}
    </div>
  );
}
