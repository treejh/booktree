import Link from 'next/link';

interface CategoryBoxProps {
  title: string;
  views: string;
  imageUrl: string;
  href: string;
}

const CategoryBox = ({ title, views, imageUrl, href }: CategoryBoxProps) => {
  return (
    <Link href={href} className="block">
      <div className="rounded-lg overflow-hidden border border-gray-300 bg-white hover:shadow-lg transition-all duration-300">
        <div className="relative h-48">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 bg-white">
          <h3 className="font-medium text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">월간 조회수 {views}</p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryBox; 