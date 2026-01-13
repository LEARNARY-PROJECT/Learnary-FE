import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
export default function GuidePage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6">Hướng dẫn sử dụng Learnary</h1>
             <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
            >
      <AccordionItem value="item-1">
        <AccordionTrigger>Dành cho học viên</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">1. Đăng ký và đăng nhập</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Truy cập trang chủ và nhấn nút &quot;Đăng ký&quot; ở góc trên bên phải</li>
                        <li>Điền thông tin cá nhân và xác nhận email</li>
                        <li>Đăng nhập bằng email và mật khẩu đã đăng ký</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">2. Tìm kiếm và đăng ký khóa học</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Duyệt qua danh sách khóa học hoặc sử dụng thanh tìm kiếm</li>
                        <li>Xem chi tiết khóa học, nội dung chương trình và đánh giá</li>
                        <li>Nhấn nút &quot;Đăng ký học&quot; để tham gia khóa học</li>
                        <li>Thanh toán và bắt đầu học ngay lập tức</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">3. Học tập và theo dõi tiến độ</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Truy cập mục &quot;Khu vực học tập&quot; để xem các khóa học đã đăng ký</li>
                        <li>Xem video bài giảng theo thứ tự hoặc tự do lựa chọn</li>
                        <li>Làm bài tập và quiz để kiểm tra kiến thức</li>
                        <li>Theo dõi tiến độ học tập của bạn</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">4. Tương tác và hỗ trợ</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Đặt câu hỏi trong phần thảo luận của khóa học</li>
                        <li>Chat trực tiếp với giảng viên khi cần hỗ trợ</li>
                        <li>Đánh giá và nhận xét về khóa học sau khi hoàn thành</li>
                    </ul>
                </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Dành cho giảng viên</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
         <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">1. Đăng ký trở thành giảng viên</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Điền form đăng ký giảng viên với thông tin chi tiết về kinh nghiệm</li>
                        <li>Cung cấp chứng chỉ và bằng cấp liên quan</li>
                        <li>Chờ admin phê duyệt hồ sơ (thường trong vòng 2-3 ngày)</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">2. Tạo và quản lý khóa học</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Truy cập trang &quot;Giảng viên&quot; để tạo khóa học mới</li>
                        <li>Thêm tiêu đề, mô tả và ảnh bìa cho khóa học</li>
                        <li>Tải lên video bài giảng và tài liệu học tập</li>
                        <li>Tạo quiz và bài tập cho học viên</li>
                        <li>Đặt giá khóa học hoặc để miễn phí</li>
                    </ul>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">3. Tương tác với học viên</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li>Trả lời câu hỏi của học viên trong phần thảo luận</li>
                        <li>Chat trực tiếp với học viên khi cần hỗ trợ</li>
                        <li>Theo dõi tiến độ và kết quả học tập của học viên</li>
                        <li>Cập nhật nội dung khóa học dựa trên phản hồi</li>
                    </ul>
                </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>❓ Câu hỏi thường gặp</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <div className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Tôi có thể học mọi lúc mọi nơi không?</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Có, bạn có thể truy cập khóa học bất cứ lúc nào trên mọi thiết bị có kết nối internet.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Tôi có được hoàn tiền nếu không hài lòng?</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Có, bạn có thể yêu cầu hoàn tiền trong vòng 7 ngày nếu chưa hoàn thành quá 30% khóa học.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Làm thế nào để liên hệ với giảng viên?</h3>
                        <p className="text-gray-700 leading-relaxed">
                            Bạn có thể chat trực tiếp hoặc đặt câu hỏi trong phần thảo luận của khóa học.
                        </p>
                    </div>
                </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4">
        <AccordionTrigger>📞 Cần hỗ trợ?</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <h2 className="text-2xl font-semibold mb-4"> Cần thêm trợ giúp?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                    Nếu bạn gặp vấn đề hoặc có câu hỏi, vui lòng liên hệ với chúng tôi:
                </p>
                <ul className="space-y-2 text-gray-700">
                    <li>Email: <span className="text-blue-600">support@learnary.com</span></li>
                    <li>Hotline: <span className="text-blue-600">1900-xxxx-xxx</span></li>
                    <li>Giờ làm việc: 8:00 - 22:00 (hàng ngày)</li>
                </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
        </div>
    )
}
                