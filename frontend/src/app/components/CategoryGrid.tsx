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
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/popular/get/posts/${currentCategoryId}`)
            .then((result) => {
                if (!result.ok) {
                    setPopPosts([])
                    throw new Error('Network response was not ok')
                }
                return result.json()
            })
            .then((result) => {
                const transformedPopPosts = result.map((post) => ({
                    id: post.postId,
                    title: post.title,
                    viewCount: post.viewCount,
                    ranking: post.ranking,
                    url: post.imageUrl,
                    score: post.score,
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
                            href={`post/${post.id}/detail/get`}
                            title={post.title}
                            alt={'이미지 제목 : ${post.title}'}
                            views={post.score}
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
