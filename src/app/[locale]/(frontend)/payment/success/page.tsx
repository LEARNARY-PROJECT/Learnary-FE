"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/app/lib/axios';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const confirmPayment = async () => {
            const orderCode = searchParams.get('orderCode');
            if (!orderCode) {
                toast.error('Không tìm thấy mã đơn hàng');
                router.push('/');
                return;
            }
            try {
                // Gọi API backend để:
                // 1. Xác nhận thanh toán với PayOS
                // 2. Tạo enrollment (cấp quyền truy cập khóa học)
                // 3. Cập nhật trạng thái đơn hàng
                const response = await api.post('/payment/confirm', { orderCode });
                console.log('Payment confirmed:', orderCode);
                toast.success('Thanh toán thành công! Bạn đã được cấp quyền truy cập khóa học.');
                // Lưu thông tin course từ response nếu cần
                if (response.data?.courseSlug) {
                    sessionStorage.setItem('payment_course_slug', response.data.courseSlug);
                }
            } catch (err) {
                console.error('Error confirming payment:', err);
                if (isAxiosError(err)) {
                    const errorMsg = err.response?.data?.message || 'Không thể xác nhận thanh toán';
                    toast.error(errorMsg);
                    
                    // Nếu lỗi nghiêm trọng (VD: đơn hàng không tồn tại), chuyển về trang chủ
                    if (err.response?.status === 404) {
                        setTimeout(() => router.push('/'), 2000);
                        return;
                    }
                }
            } finally {
                setIsProcessing(false);
            }
            
            // Lấy slug từ sessionStorage
            const courseSlug = sessionStorage.getItem('payment_course_slug');
            
            // Tự động chuyển hướng sau 3 giây
            const timer = setTimeout(() => {
                if (courseSlug) {
                    setIsRedirecting(true);
                    sessionStorage.removeItem('payment_course_slug');
                    router.push(`/course-learn/${courseSlug}`);
                } else {
                    router.push('/my-courses');
                }
            }, 3000);

            return () => clearTimeout(timer);
        };

        confirmPayment();
    }, [searchParams, router]);

    const handleGoToCourse = () => {
        const courseSlug = sessionStorage.getItem('payment_course_slug');
        setIsRedirecting(true);
        
        if (courseSlug) {
            sessionStorage.removeItem('payment_course_slug');
            router.push(`/course-learn/${courseSlug}`);
        } else {
            router.push('/my-courses');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-green-600">
                        {isProcessing ? 'Đang xử lý thanh toán...' : 'Thanh toán thành công!'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center space-y-2">
                        <p className="text-gray-600">
                            Cảm ơn bạn đã mua khóa học. Bạn có thể bắt đầu học ngay bây giờ!
                        </p>
                        {searchParams.get('orderCode') && (
                            <p className="text-sm text-gray-500">
                                Mã đơn hàng: <span className="font-mono font-semibold">{searchParams.get('orderCode')}</span>
                            </p>
                        )}
                    </div>

                    <div className="space-y-3">
                        <Button 
                            onClick={handleGoToCourse} 
                            className="w-full"
                            disabled={isRedirecting}
                        >
                            {isRedirecting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang chuyển hướng...
                                </>
                            ) : (
                                'Bắt đầu học ngay'
                            )}
                        </Button>
                        
                        <Button 
                            variant="outline" 
                            onClick={() => router.push('/my-courses')}
                            className="w-full"
                        >
                            Xem khóa học của tôi
                        </Button>
                    </div>

                    <p className="text-center text-sm text-gray-500">
                        Tự động chuyển hướng sau 3 giây...
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
