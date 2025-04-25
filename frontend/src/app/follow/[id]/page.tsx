'use client'

import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface User {
    id: number
    name: string
    username: string
    // avatar: string
    isFollowing: boolean
    isMe: boolean
}

const mockUsers: User[] = [
    {
        id: 1,
        name: '김개발',
        username: '@kimdev',
        // avatar: '/avatars/user1.jpg',
        isFollowing: true,
        isMe: false,
    },
    {
        id: 2,
        name: '이코딩',
        username: '@coding_lee',
        // avatar: '/avatars/user2.jpg',
        isFollowing: false,
        isMe: false,
    },
    // Add more mock users as needed
]

interface follower {
    id: number
    userId: number
    count: number
    username: string
    isFollowing: boolean
    isMe: boolean
}

interface followed {
    id: number
    userId: number
    count: number
    username: string
    isFollowing: boolean
    isMe: boolean
}

export default function FollowPage() {
    const searchParams = useSearchParams()
    const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following')
    const [users, setUsers] = useState<User[]>(mockUsers)
    const [error, setError] = useState<string | null>(null)
    const { id: userId } = useParams<{ id: string }>()
    const [follower, setFollower] = useState<follower[]>([])
    const [followed, setFollowed] = useState<followed[]>([])

    const followUser = async (followeeId: number) => {
        try {
            const res = await fetch('http://localhost:8090/api/v1/follow/create/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ followeeId }),
            })

            if (!res.ok) throw new Error('팔로우 요청 실패')
            console.log(`팔로우 완료: ${followeeId}`)
        } catch (err) {
            console.error(err)
        }
    }

    const unfollowUser = async (followeeId: number) => {
        try {
            const res = await fetch('http://localhost:8090/api/v1/follow/delete/unfollow', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ followeeId }),
            })

            if (!res.ok) throw new Error('언팔로우 요청 실패')
            console.log(`언팔로우 완료: ${followeeId}`)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab === 'following' || tab === 'followers') {
            setActiveTab(tab)
        }
    }, [searchParams])

    useEffect(() => {
        if (activeTab === 'following') {
            const transformed = followed.map((user) => ({
                id: user.userId,
                name: user.username, // name이 따로 없으면 username을 name으로 사용
                username: `@${user.username}`,
                avatar: '/avatars/default.jpg', // 나중에 API에서 내려주면 교체
                isFollowing: user.following,
                isMe: user.me,
            }))
            setUsers(transformed)
            console.log('user : ', transformed)
        } else if (activeTab === 'followers') {
            const transformed = follower.map((user) => ({
                id: user.userId,
                name: user.username,
                username: `@${user.username}`,
                avatar: '/avatars/default.jpg',
                isFollowing: user.following,
                isMe: user.me,
            }))
            setUsers(transformed)
            console.log('user : ', transformed)
        }
    }, [activeTab, follower, followed])

    useEffect(() => {
        const fetchFollower = async () => {
            try {
                const response = await fetch(`http://localhost:8090/api/v1/follow/get/followed/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // 추가적인 헤더가 필요하면 여기에 추가
                    },
                    credentials: 'include', // 쿠키를 포함시키기 위한 설정
                })
                if (!response.ok) {
                    throw new Error('팔로워 데이터를 가져오는 데 실패했습니다.')
                }
                const data = await response.json()
                setFollower(data) // 가져온 데이터를 상태에 저장
                console.log('팔로워 목록 : ', data)
            } catch (err: unknown) {
                if (err instanceof Error) {
                    // err가 Error 인스턴스인지 확인
                    setError(err.message) // 에러 메시지 접근
                } else {
                    setError('알 수 없는 오류가 발생했습니다.')
                }
            }
        }
        fetchFollower()
    }, [])

    useEffect(() => {
        const fetchFollowed = async () => {
            try {
                const response = await fetch(`http://localhost:8090/api/v1/follow/get/follower/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // 추가적인 헤더가 필요하면 여기에 추가
                    },
                    credentials: 'include', // 쿠키를 포함시키기 위한 설정
                })
                if (!response.ok) {
                    throw new Error('팔로워 데이터를 가져오는 데 실패했습니다.')
                }
                const data = await response.json()
                setFollowed(data) // 가져온 데이터를 상태에 저장
                console.log('팔로잉 목록 : ', data)
            } catch (err: unknown) {
                if (err instanceof Error) {
                    // err가 Error 인스턴스인지 확인
                    setError(err.message) // 에러 메시지 접근
                } else {
                    setError('알 수 없는 오류가 발생했습니다.')
                }
            }
        }
        fetchFollowed()
    }, [])

    const handleFollow = async (userId: number, isFollowing: boolean) => {
        if (isFollowing) {
            await unfollowUser(userId)
        } else {
            await followUser(userId)
        }

        // 상태 업데이트
        setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === userId ? { ...user, isFollowing: !isFollowing } : user)),
        )
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
                        <div
                            key={user.id}
                            className="flex items-center justify-between p-4 border rounded-lg border-gray-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                                    {/* Avatar placeholder */}
                                </div>
                                <div>
                                    <h3 className="font-bold">{user.name}</h3>
                                    <p className="text-gray-600">{user.username}</p>
                                </div>
                            </div>
                            {!user.isMe && (
                                <button
                                    onClick={() => handleFollow(user.id, user.isFollowing)}
                                    className={`px-4 py-2 rounded-md ${
                                        user.isFollowing ? 'bg-gray-200 text-gray-800' : 'bg-[#2E804E] text-white'
                                    }`}
                                >
                                    {user.isFollowing ? '팔로잉' : '팔로우'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
