# Precision Attendance System (PAS) 🏭

Chào mừng bạn đến với **Precision Attendance System** - Hệ thống Quản lý Chấm công và Nhân sự toàn diện dành cho Nhà máy / Doanh nghiệp, được thiết kế với độ chính xác cao và luồng nghiệp vụ chặt chẽ, chống gian lận.

---

## 🎯 Giới thiệu phần mềm
**Precision Attendance System** là một giải pháp quản trị nhân sự số hóa, hỗ trợ doanh nghiệp tự động hóa quá trình chấm công, tính lương và quản lý ngày nghỉ của nhân viên. Hệ thống nổi bật với tính năng **Chấm công bằng mã QR kết hợp định vị GPS**, giúp đảm bảo nhân viên phải thực sự có mặt tại nhà máy/công ty mới có thể điểm danh.

Phần mềm được thiết kế tối ưu hóa trải nghiệm cho hai nhóm người dùng:
1. **Dành cho Quản lý (Admin / HR):** Giao diện Dashboard (Web Desktop) rộng rãi, nhiều biểu đồ báo cáo và các bảng quản trị chi tiết.
2. **Dành cho Nhân viên (Employee):** Giao diện chuẩn Mobile-first, thân thiện, dễ dàng thao tác quét QR và theo dõi lịch sử làm việc trên điện thoại cá nhân.

---

## 🛠 Công nghệ sử dụng
- **Frontend:** React.js, TypeScript, Vite, Tailwind CSS, Lucide Icons. (Triển khai trên **Vercel**)
- **Backend:** Java 21, Spring Boot 3, Spring Security (JWT), Spring Data JPA. (Triển khai trên **Render**)
- **Database:** PostgreSQL (Lưu trữ trên đám mây **Supabase**), tích hợp công cụ Migrate Flyway.

---

## 👥 Phân quyền & Luồng nghiệp vụ (Business Flow)

Hệ thống có 3 vai trò (Roles) với các chức năng chuyên biệt:

### 1. Quản trị viên (Admin)
- **Quản lý Nhân sự:** Thêm mới, chỉnh sửa thông tin, tạo tài khoản và phân quyền cho Nhân viên hoặc HR.
- **Quản lý Ca làm việc:** Tạo các ca làm việc (Ví dụ: Ca Sáng 07:00 - 12:00, Ca Chiều 13:00 - 18:00).
- **Tạo mã QR Chấm công (QR Generator):** 
  - Admin mở màn hình tạo mã QR trên một thiết bị lớn đặt tại cổng nhà máy.
  - Mã QR được hệ thống sinh ra kèm *chữ ký thời gian*, **tự động thay đổi theo số phút một lần dựa theo cài đặt** để chống việc nhân viên chụp ảnh lại mã QR gửi cho người khác chấm công hộ.
- **Cấu hình Lương:** Thiết lập mức phạt đi trễ, phạt nghỉ không phép, lương cơ bản chung, v.v.
- **Báo cáo tổng hợp:** Xem Báo cáo chấm công chi tiết và Bảng lương của toàn bộ nhà máy.
-  **Cài đặt:** Cài đặt tọa độ GPS công ty, thời gian tối đa cho phép trễ, cài đặt thời gian hiệu lực của QR.

### 2. Quản lý Nhân sự (HR Manager)
- **Duyệt đơn từ:** Tiếp nhận, xem xét và đưa ra quyết định (Phê duyệt / Từ chối) đối với các đơn xin nghỉ phép của nhân viên.
- Theo dõi các báo cáo vắng mặt, đi trễ để đôn đốc nhân sự.

### 3. Nhân viên (Employee)
- **Chấm công bằng QR (QR Scanner):** 
  - Dùng điện thoại đăng nhập vào hệ thống, mở chức năng **Quét QR**.
  - **Bắt buộc bật GPS** để hệ thống lấy tọa độ hiện tại.
  - Quét mã QR đang hiển thị trên màn hình của Admin.
  - Hệ thống *tự động nhận diện* trạng thái là **Check-in** (Nếu chưa có dữ liệu) hoặc **Check-out** (Nếu đã Check-in trước đó).
  - Backend sẽ tự động tính toán thời gian, so sánh với Ca làm việc và đưa ra kết quả: *Đúng giờ* hoặc *Đi trễ/Về sớm*. (Hỗ trợ tự động chuẩn hóa múi giờ Việt Nam).
- **Xin nghỉ phép:** Viết đơn từ xin nghỉ phép (kèm lý do) gửi lên HR.
- **Cá nhân:** Xem lịch sử chấm công và Bảng tính lương chi tiết của **riêng mình**.

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy (Local)

### 1. Khởi chạy Database (PostgreSQL)
- Cấu hình chuỗi kết nối Database của Supabase vào file `application.yml` ở Backend.
- Khi Spring Boot khởi động, **Flyway** sẽ tự động chạy các script SQL để tạo bảng và nạp dữ liệu mẫu (Admin, Các ca làm việc mặc định).

### 2. Khởi chạy Backend (Spring Boot)
```bash
cd backend
./gradlew bootRun
```
*Backend mặc định sẽ chạy ở cổng `http://localhost:8080`*

### 3. Khởi chạy Frontend (React Vite)
Tạo file `.env` ở thư mục `frontend` và điền link Backend:
```env
VITE_API_URL=http://localhost:8080
```
Cài đặt thư viện và chạy:
```bash
cd frontend
npm install
npm run dev
```
*Frontend mặc định sẽ chạy ở cổng `http://localhost:5173`*

---

## 🔑 Tài khoản mặc định (Test Data)
Sau khi database được khởi tạo, bạn có thể sử dụng các tài khoản sau để đăng nhập:

- **Admin:** `admin@pas.vn` / `admin123`
- **HR Manager:** `hr.manager@pas.vn` / `hr123456`
- **Nhân viên:** `employee@pas.vn` / `emp123456`

---

