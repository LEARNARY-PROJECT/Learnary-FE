"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isProcessing] = useState(true);

    useEffect(() => {
        const handlePaymentSuccess = () => {
            const orderCode = searchParams.get('orderCode');
            
            if (orderCode) {
                // Webhook đã xử lý việc cập nhật DB rồi
                // Chỉ cần hiển thị thông báo thành công
                console.log('Payment successful for order:', orderCode);
                toast.success('Thanh toán thành công! Bạn đã được ghi danh vào khóa học.');
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

        handlePaymentSuccess();
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
