# Bài thực hành 02 (TH02): Ứng dụng xem thời tiết

- Sinh viên: Đào Thị Nhung
- Mã sinh viên: B25DCCC160
- Môn: Lập trình Web (RIPT1306-20261-05)

## Giới thiệu

Ứng dụng React hiển thị thời tiết của 8 thành phố Việt Nam, dữ liệu lấy từ API [Open-Meteo](https://open-meteo.com/en/docs) (miễn phí, không cần API key).

## Chức năng

- Danh sách 8 thành phố, thành phố đang chọn được làm nổi bật
- Thời tiết hiện tại: biểu tượng, mô tả, nhiệt độ, độ ẩm, tốc độ gió, thời điểm cập nhật
- Dự báo 7 ngày: thứ, ngày, biểu tượng, nhiệt độ cao nhất và thấp nhất
- Các trạng thái: chưa chọn, đang tải, lỗi (có nút Thử lại)
- Đổi °C / °F mà không gọi lại API
- Giao diện responsive (từ 768px: 2 cột; nhỏ hơn: xếp dọc)

## Công nghệ

React, Vite, Open-Meteo API

## Cách chạy

```bash
npm install
npm run dev
```

Sau đó mở http://localhost:5173
