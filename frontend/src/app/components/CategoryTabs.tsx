interface CategoryTabsProps {
    activeTab: string
    onTabChange: (tab: string) => void
}

const CategoryTabs = ({ activeTab, onTabChange }: CategoryTabsProps) => {
    const categories = [
        { id: 'novel', name: '소설' },
        { id: 'self-development', name: '자기개발서' },
        { id: 'study', name: '공부/자격' },
        { id: 'essay', name: '에세이/일상' },
        { id: 'hobby', name: '실용/취미' },
        { id: 'it', name: 'IT/컴퓨터' },
    ]

    return (
        <div className="bg-white rounded-t-lg shadow-sm mb-0">
            <ul className="flex border-b border-gray-200">
                {categories.map((category) => (
                    <li
                        key={category.id}
                        className={`flex-1 text-center py-3 text-sm ${
                            activeTab === category.id ? 'border-b-2 border-black' : ''
                        }`}
                    >
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                onTabChange(category.id)
                            }}
                            className={`block ${
                                activeTab === category.id ? 'font-medium text-black' : 'text-gray-400'
                            }`}
                        >
                            {category.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default CategoryTabs
