interface AnnouncementModalProps {
    isOpen: boolean
    onClose: () => void
    notice: string
    name: string // 블로그 이름을 받기 위한 prop 추가
}

export default function AnnouncementModal({ isOpen, onClose, notice, name }: AnnouncementModalProps) {
    // name 추가
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[400px] max-h-[70vh] overflow-y-auto relative shadow-xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold mb-4">공지사항</h2>
                <div className="border-b border-gray-200 mb-4"></div>

                <div className="space-y-4">
                    <div className="border-b border-gray-100 pb-4">
                        <h3 className="font-semibold text-lg mb-2">{name} 공지사항입니다.</h3>
                        <p className="text-gray-600 text-sm mb-2">
                            {notice} {/* 전달받은 notice 데이터 출력 */}
                        </p>
                        <span className="text-gray-400 text-xs">2024.04.21</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
