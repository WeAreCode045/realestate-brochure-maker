
interface WebViewPropertyTitleProps {
  title: string;
  price: string;
  backgroundColor?: string;
}

export function WebViewPropertyTitle({ title, price, backgroundColor }: WebViewPropertyTitleProps) {
  return (
    <div 
      className="absolute bottom-0 left-0 right-0 py-4"
      style={{ backgroundColor }}
    >
      <div className="container flex justify-between items-center px-6">
        <h1 className="text-3xl font-bold text-white uppercase">
          {title}
        </h1>
        <p className="text-2xl font-bold text-white">€ {price}</p>
      </div>
    </div>
  );
}
