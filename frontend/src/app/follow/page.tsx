'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

interface User {
    id: number
    name: string
    username: string
    avatar: string
    isFollowing: boolean
}

const mockUsers: User[] = [
    {
        id: 1,
        name: '김개발',
        username: '@kimdev',
        avatar: '/avatars/user1.jpg',
        isFollowing: true,
    },
    {
        id: 2,
        name: '이코딩',
        username: '@coding_lee',
        avatar: '/avatars/user2.jpg',
        isFollowing: false,
    },
    // Add more mock users as needed
]

export default function FollowPage() {
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following')
    const [users, setUsers] = useState<User[]>(mockUsers)

    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab === 'following' || tab === 'followers') {
            setActiveTab(tab)
        }
    }, [searchParams])

    const handleFollow = (userId: number) => {
        setUsers(users.map((user) => (user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user)))
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <nav className="border-b border-gray-200 mb-8">
                    <ul className="flex gap-8">
                        <li
                            className={`pb-2 border-b-2 ${
                                activeTab === 'following' ? 'border-gray-900' : 'border-transparent'
                            } cursor-pointer`}
                            onClick={() => setActiveTab('following')}
                        >
                            <span className={activeTab === 'following' ? 'text-gray-900' : 'text-gray-600'}>
                                팔로잉
                            </span>
                        </li>
                        <li
                            className={`pb-2 border-b-2 ${
                                activeTab === 'followers' ? 'border-gray-900' : 'border-transparent'
                            } cursor-pointer`}
                            onClick={() => setActiveTab('followers')}
                        >
                            <span className={activeTab === 'followers' ? 'text-gray-900' : 'text-gray-600'}>
                                팔로워
                            </span>
                        </li>
                    </ul>
                </nav>

                <div className="space-y-4">
                    {users.map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                    {/* Avatar placeholder */}
                                </div>
                                <div>
                                    <h3 className="font-bold">{user.name}</h3>
                                    <p className="text-gray-600">{user.username}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleFollow(user.id)}
                                className={`px-4 py-2 rounded-md ${
                                    user.isFollowing ? 'bg-gray-200 text-gray-800' : 'bg-[#2E804E] text-white'
                                }`}
                            >
                                {user.isFollowing ? '팔로잉' : '팔로우'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
