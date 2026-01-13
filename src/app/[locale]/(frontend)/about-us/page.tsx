import React from 'react'

export default function AboutUsPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Về chúng tôi</h1>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Chào mừng đến với Learnary</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Learnary là nền tảng học trực tuyến giúp kết nối người học với các khóa học chất lượng cao 
                    từ những gi강sư giàu kinh nghiệm.
                </p>
                <p className="text-gray-700 leading-relaxed">
                    Chúng tôi cam kết mang đến trải nghiệm học tập tốt nhất, 
                    với công nghệ hiện đại và giao diện thân thiện với người dùng.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Sứ mệnh của chúng tôi</h2>
                <p className="text-gray-700 leading-relaxed">
                    Tạo ra một môi trường học tập trực tuyến chất lượng, dễ tiếp cận và hiệu quả, 
                    giúp mọi người phát triển kỹ năng và kiến thức của mình.
                </p>
            </section>

            <section>
                <h2 className="text-2xl font-semibold mb-4">Liên hệ</h2>
                <p className="text-gray-700 leading-relaxed">
                    Nếu bạn có bất kỳ câu hỏi nào, vui lòng xem thêm các mục trong menu bên trái 
                    hoặc liên hệ với chúng tôi qua email: <span className="text-blue-600">support@learnary.com</span>
                </p>
            </section>
        </div>
    )
}