import { useEffect, useState } from 'react'
import CategoryBox from './CategoryBox'
import CategoryTabs from './CategoryTabs'

const categoryIdMap: Record<string, number> = {
    novel: 1,
    'self-development': 2,
    study: 3,
    essay: 4,
    hobby: 5,
    it: 6,
}

const CategoryGrid = () => {
    const [activeTab, setActiveTab] = useState('novel')
    const [popPosts, setPopPosts] = useState([])

    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
    }

    useEffect(() => {
        const currentCategoryId = categoryIdMap[activeTab as keyof typeof categoryIdMap]
        fetch(`http://localhost:8090/api/v1/posts/get/maincategory/${currentCategoryId}/view`)
            .then((result) => {
                if (!result.ok) {
                    throw new Error('Network response was not ok')
                }
                return result.json()
            })
            .then((result) => {
                const transformedPopPosts = result.content.map((post) => ({
                    id: post.postId,
                    title: post.title,
                    viewCount: post.viewCount,
                    ranking: post.ranking,
                    url: 'https://booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com/BookTree+%E1%84%80%E1%85%B5%E1%84%87%E1%85%A9%E1%86%AB+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5+%E1%84%8E%E1%85%AC%E1%84%8C%E1%85%A9%E1%86%BC%E1%84%87%E1%85%A9%E1%86%AB.png',
                }))

                setPopPosts(transformedPopPosts)
                console.log(transformedPopPosts)
            })
            .catch((error) => {
                console.error('Error fetching popular posts:', error)
            })
    }, [activeTab]) // activeTab이 변경될 때마다 useEffect 실행

    return (
        <div>
            <CategoryTabs activeTab={activeTab} onTabChange={handleTabChange} />
            <div className="bg-white rounded-b-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popPosts.map((post, index) => (
                        <CategoryBox
                            key={index}
                            title={post.title}
                            views={post.viewCount}
                            imageUrl={post.url} // 필요 시 추가
                            // href={item.href} // 필요 시 추가
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CategoryGrid
