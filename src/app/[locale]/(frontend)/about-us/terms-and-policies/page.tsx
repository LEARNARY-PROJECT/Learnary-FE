import React from 'react'

export default function TermsAndPoliciesPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Điều khoản và Chính sách</h1>
            
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Điều khoản sử dụng</h2>
                
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">1.1. Chấp nhận điều khoản</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Khi truy cập và sử dụng nền tảng Learnary, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định dưới đây. 
                        Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
                    </p>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">1.2. Tài khoản người dùng</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Bạn phải cung cấp thông tin chính xác và đầy đủ khi đăng ký tài khoản</li>
                        <li>Bạn có trách nhiệm bảo mật thông tin đăng nhập của mình</li>
                        <li>Không được chia sẻ tài khoản cho người khác sử dụng</li>
                        <li>Thông báo ngay cho chúng tôi nếu phát hiện tài khoản bị truy cập trái phép</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">1.3. Quyền sở hữu trí tuệ</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Tất cả nội dung khóa học, video, tài liệu và tài nguyên trên Learnary đều thuộc quyền sở hữu của giảng viên 
                        hoặc Learnary. Người dùng không được sao chép, phân phối hoặc sử dụng cho mục đích thương mại mà không có sự cho phép.
                    </p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Chính sách bảo mật</h2>
                
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">2.1. Thu thập thông tin</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Chúng tôi thu thập các thông tin sau từ người dùng:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Thông tin cá nhân: tên, email, số điện thoại</li>
                        <li>Thông tin thanh toán khi đăng ký khóa học</li>
                        <li>Dữ liệu sử dụng: tiến độ học tập, thời gian truy cập</li>
                        <li>Cookies và dữ liệu phiên làm việc</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">2.2. Sử dụng thông tin</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Thông tin của bạn được sử dụng để:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Cung cấp và cải thiện dịch vụ học trực tuyến</li>
                        <li>Xử lý thanh toán và giao dịch</li>
                        <li>Gửi thông báo về khóa học và cập nhật hệ thống</li>
                        <li>Hỗ trợ khách hàng và giải đáp thắc mắc</li>
                        <li>Phân tích và cải thiện trải nghiệm người dùng</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">2.3. Bảo vệ thông tin</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Learnary cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp bảo mật tiên tiến. 
                        Chúng tôi sử dụng mã hóa SSL, tường lửa và các công nghệ bảo mật khác để ngăn chặn truy cập trái phép.
                    </p>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. Chính sách hoàn tiền</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Người học có thể yêu cầu hoàn tiền trong vòng 7 ngày kể từ ngày mua khóa học nếu:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Chưa hoàn thành quá 30% nội dung khóa học</li>
                    <li>Khóa học không đúng với mô tả</li>
                    <li>Có lỗi kỹ thuật nghiêm trọng ảnh hưởng đến việc học</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Quy định về hành vi</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Người dùng không được:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Đăng tải nội dung vi phạm pháp luật, phản cảm hoặc xúc phạm</li>
                    <li>Spam, quấy rối hoặc làm phiền người dùng khác</li>
                    <li>Sử dụng bot hoặc công cụ tự động không được phép</li>
                    <li>Cố gắng xâm nhập hệ thống hoặc phá hoại dịch vụ</li>
                    <li>Tải lên virus, malware hoặc mã độc hại</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Thay đổi điều khoản</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Learnary có quyền cập nhật và thay đổi các điều khoản này bất kỳ lúc nào. 
                    Chúng tôi sẽ thông báo cho người dùng về những thay đổi quan trọng qua email hoặc thông báo trên nền tảng.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Liên hệ</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Nếu bạn có bất kỳ câu hỏi nào về các điều khoản và chính sách này, vui lòng liên hệ với chúng tôi:
                </p>
                <ul className="space-y-2 text-gray-700">
                    <li>Email: <span className="text-blue-600">support@learnary.com</span></li>
                    <li>Điện thoại: <span className="text-blue-600">1900-xxxx-xxx</span></li>
                    <li>Địa chỉ: Thành phố Hồ Chí Minh, Việt Nam</li>
                </ul>
            </section>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 italic">
                    Cập nhật lần cuối: Tháng 1, 2026
                </p>
            </div>
        </div>
    )
}