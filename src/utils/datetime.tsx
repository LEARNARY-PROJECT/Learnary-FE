/**
 * Format date từ ISO string sang định dạng dễ đọc (dd/MM/yyyy)
 * @param isoDate - ISO date string hoặc null
 * @returns Ngày đã format hoặc "Chưa có" nếu null
 */
export const formatDate = (isoDate: string | null): string => {
   if (!isoDate) return "Chưa có";
   try {
      const date = new Date(isoDate);
      return date.toLocaleDateString('vi-VN', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric'
      });
   } catch {
      return isoDate;
   }
}

/**
 * Convert date sang format cho HTML input type="date" (yyyy-MM-dd)
 * @param isoDate - ISO date string hoặc null
 * @returns Date string theo format yyyy-MM-dd hoặc empty string nếu null
 */
export const formatDateForInput = (isoDate: string | null): string => {
   if (!isoDate) return "";
   try {
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
   } catch {
      return "";
   }
}
