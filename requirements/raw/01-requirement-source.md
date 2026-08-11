Phần mềm chấm công:

Technical stack:

BE: Java 21, sprintboot

FE: ReactJs

Database: Tùy chọn (ví dụ:Postgre)

Yêu cầu dự án:

Chấm công bằng mã QR (IN/OUT).

Responsive trên mobile chấm công.

Đầu ra là báo cáo danh sanh nhân dự đi làm trong tháng và tính lương.

Dashboard.

Tính năng mới (Bổ sung):

Tính năng tạo mã QR: Hệ thống tự động tạo mã QR cho từng nhân viên hoặc theo ca làm việc.

Tính năng nhận vị trí GPS: Kiểm tra khoảng cách giữa vị trí GPS của nhân viên và GPS công ty.

Điều kiện chấm công thành công: Khi quét mã QR thành công VÀ khoảng cách GPS <= 10 mét.

Thông tin bổ sung từ stakeholder:

Authentication: Đăng nhập tài khoản cá nhân rồi dùng thiết bị cá nhân quét mã để nhận diện.

Cấu hình lương:
- Danh mục lương
- Lương
- Công thức tính lương
- Mặc định có sẵn mục lương bị phạt khi đi làm trễ/nghỉ phép
- In danh sách lương dựa trên cấu hình

Giờ làm việc: Có cấu hình ca làm việc.

Tính năng tạo mã QR (chi tiết):
- Cho ấn tạo mã QR để gen mã
- Thời gian hiệu lực của mã dựa theo cấu hình
- Nhắc nhở nếu gần đến giờ làm việc mà vẫn chưa ấn tạo mã QR
