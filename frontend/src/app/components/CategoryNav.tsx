import Link from 'next/link'

interface CategoryNavProps {
    currentSlug: string
}

const CategoryNav = ({ currentSlug }: CategoryNavProps) => {
    return (
        <div className="flex flex-wrap bg-white shadow-sm w-screen">
            <Link
                href="/main/category/novel"
                className={`py-2.5 px-6 bg-white text-center hover:bg-gray-100 border-b-2 flex-1 min-w-24 text-sm ${
                    currentSlug === 'novel' ? 'border-black font-medium' : 'border-transparent'
                }`}
            >
                소설
            </Link>
            <Link
                href="/main/category/self-development"
                className={`py-2.5 px-6 bg-white text-center hover:bg-gray-100 border-b-2 flex-1 min-w-24 text-sm ${
                    currentSlug === 'self-development' ? 'border-black font-medium' : 'border-transparent'
                }`}
            >
                자기계발서
            </Link>
            <Link
                href="/main/category/study"
                className={`py-2.5 px-6 bg-white text-center hover:bg-gray-100 border-b-2 flex-1 min-w-24 text-sm ${
                    currentSlug === 'study' ? 'border-black font-medium' : 'border-transparent'
                }`}
            >
                공부/자격
            </Link>
            <Link
                href="/main/category/essay"
                className={`py-2.5 px-6 bg-white text-center hover:bg-gray-100 border-b-2 flex-1 min-w-24 text-sm ${
                    currentSlug === 'essay' ? 'border-black font-medium' : 'border-transparent'
                }`}
            >
                에세이/일상
            </Link>
            <Link
                href="/main/category/hobby"
                className={`py-2.5 px-6 bg-white text-center hover:bg-gray-100 border-b-2 flex-1 min-w-24 text-sm ${
                    currentSlug === 'hobby' ? 'border-black font-medium' : 'border-transparent'
                }`}
            >
                실용/취미
            </Link>
            <Link
                href="/main/category/it"
                className={`py-2.5 px-6 bg-white text-center hover:bg-gray-100 border-b-2 flex-1 min-w-24 text-sm ${
                    currentSlug === 'it' ? 'border-black font-medium' : 'border-transparent'
                }`}
            >
                IT/컴퓨터
            </Link>
        </div>
    )
}
export default CategoryNav
