# Error Catalog - Phần mềm Chấm công

## 1. Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": [
      {
        "field": "field_name",
        "message": "Field-specific error"
      }
    ]
  },
  "timestamp": "2026-08-10T10:30:00Z"
}
```

## 2. Authentication Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| UNAUTHORIZED | 401 | "Vui lòng đăng nhập" | Missing or invalid token |
| TOKEN_EXPIRED | 401 | "Phiên đã hết hạn, vui lòng đăng nhập lại" | JWT token expired |
| INVALID_CREDENTIALS | 401 | "Tên đăng nhập hoặc mật khẩu không đúng" | Wrong username/password |
| ACCOUNT_LOCKED | 401 | "Tài khoản đã bị khóa do nhập sai quá nhiều lần" | Too many failed attempts |
| ACCOUNT_DISABLED | 401 | "Tài khoản đã bị vô hiệu hóa" | Account is disabled |

## 3. Authorization Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| FORBIDDEN | 403 | "Bạn không có quyền thực hiện thao tác này" | Insufficient permissions |
| ROLE_REQUIRED | 403 | "Yêu cầu quyền {role}" | Specific role required |

## 4. Validation Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| VALIDATION_ERROR | 400 | "Dữ liệu đầu vào không hợp lệ" | General validation error |
| REQUIRED_FIELD | 400 | "Trường {field} là bắt buộc" | Missing required field |
| INVALID_FORMAT | 400 | "Trường {field} không đúng định dạng" | Invalid format |
| MIN_LENGTH | 400 | "Trường {field} phải có ít nhất {min} ký tự" | Too short |
| MAX_LENGTH | 400 | "Trường {field} không được vượt quá {max} ký tự" | Too long |
| INVALID_ENUM | 400 | "Trường {field} phải là một trong: {values}" | Invalid enum value |

## 5. Resource Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| NOT_FOUND | 404 | "Không tìm thấy tài nguyên" | Resource not found |
| USER_NOT_FOUND | 404 | "Không tìm thấy người dùng" | User not found |
| ATTENDANCE_NOT_FOUND | 404 | "Không tìm thấy bản ghi chấm công" | Attendance not found |
| ALREADY_EXISTS | 409 | "Tài nguyên đã tồn tại" | Resource already exists |
| USERNAME_EXISTS | 409 | "Tên đăng nhập đã tồn tại" | Username already taken |
| EMAIL_EXISTS | 409 | "Email đã được sử dụng" | Email already in use |

## 6. Attendance Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| QR_INVALID | 422 | "Mã QR không hợp lệ" | Invalid QR code |
| QR_EXPIRED | 422 | "Mã QR đã hết hạn, vui lòng quét lại" | QR code expired |
| QR_WRONG_TENANT | 422 | "Mã QR không thuộc hệ thống" | QR from wrong system |
| GPS_UNAVAILABLE | 422 | "Không thể xác định vị trí GPS. Vui lòng bật GPS" | GPS not available |
| GPS_OUT_OF_RANGE | 422 | "Bạn đang ở cách công ty {distance}m. Vui lòng di chuyển vào khu vực chấm công" | Too far from company |
| GPS_PERMISSION_DENIED | 422 | "Vui lòng cấp quyền truy cập vị trí trong cài đặt" | GPS permission denied |
| DUPLICATE_SCAN | 422 | "Bạn đã chấm công {type} lúc {time}" | Duplicate scan |
| MIN_INTERVAL | 422 | "Vui lòng chờ {minutes} phút trước khi quét lại" | Too soon to scan |
| ALREADY_CLOCKED_IN | 422 | "Bạn đã chấm công IN hôm nay lúc {time}" | Already clocked in |
| NOT_CLOCKED_IN | 422 | "Bạn chưa chấm công IN hôm nay" | Must clock in first |
| NETWORK_ERROR | 503 | "Kết nối không ổn định, vui lòng thử lại" | Network unavailable |
| SERVER_TIME_ERROR | 503 | "Không thể đồng bộ thời gian với máy chủ" | Server time sync failed |

## 7. QR Code Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| QR_GENERATION_FAILED | 500 | "Lỗi tạo mã QR, vui lòng thử lại" | QR generation failed |
| QR_REFRESH_FAILED | 500 | "Lỗi làm mới mã QR" | QR refresh failed |

## 8. User Management Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| USER_CREATE_FAILED | 500 | "Lỗi tạo người dùng" | User creation failed |
| USER_UPDATE_FAILED | 500 | "Lỗi cập nhật người dùng" | User update failed |
| USER_DELETE_FAILED | 500 | "Lỗi xóa người dùng" | User deletion failed |
| CANNOT_DELETE_SELF | 400 | "Không thể xóa tài khoản của chính mình" | Self-deletion not allowed |
| CANNOT_CHANGE_OWN_ROLE | 400 | "Không thể thay đổi vai trò của chính mình" | Self role change not allowed |

## 9. Report Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| REPORT_GENERATION_FAILED | 500 | "Lỗi tạo báo cáo" | Report generation failed |
| INVALID_DATE_RANGE | 400 | "Khoảng ngày không hợp lệ" | Invalid date range |
| NO_DATA | 404 | "Không có dữ liệu cho kỳ này" | No data for period |

## 10. Configuration Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| CONFIG_NOT_FOUND | 404 | "Không tìm thấy cấu hình" | Configuration not found |
| CONFIG_UPDATE_FAILED | 500 | "Lỗi cập nhật cấu hình" | Config update failed |
| INVALID_CONFIG_VALUE | 400 | "Giá trị cấu hình không hợp lệ" | Invalid config value |

## 11. System Errors

| Code | HTTP Status | Message | Description |
|------|-------------|---------|-------------|
| SERVER_ERROR | 500 | "Lỗi hệ thống, vui lòng thử lại sau" | Internal server error |
| SERVICE_UNAVAILABLE | 503 | "Dịch vụ tạm thời không khả dụng" | Service unavailable |
| RATE_LIMITED | 429 | "Quá nhiều yêu cầu, vui lòng thử lại sau" | Rate limit exceeded |

## 12. Error Handling Guidelines

### 12.1 Client-Side Handling

```javascript
// Example error handling
try {
  const response = await api.post('/attendance/scan', data);
} catch (error) {
  if (error.response) {
    const { code, message } = error.response.data.error;
    
    switch (code) {
      case 'GPS_OUT_OF_RANGE':
        showDistanceError(message);
        break;
      case 'QR_EXPIRED':
        showQRRefreshPrompt();
        break;
      case 'DUPLICATE_SCAN':
        showLastAttendance(message);
        break;
      default:
        showErrorToast(message);
    }
  }
}
```

### 12.2 Error Logging

All errors should be logged with:
- Timestamp
- User ID (if authenticated)
- Request ID
- Error code
- Stack trace (for server errors)
