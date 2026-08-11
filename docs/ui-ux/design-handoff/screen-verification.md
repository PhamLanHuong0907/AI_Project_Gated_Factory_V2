# Screen Verification Report

> Compare expected screens (config/stitch-project.yaml) vs actual Stitch exports

## Summary

| Status | Count | Details |
|--------|-------|---------|
| ✅ MATCHED | 14 | Screenshot found and matches expected screen |
| ⚠️ VARIANT | 2 | Multiple variants for same screen (SCR-02, SCR-04, SCR-05, SCR-08) |
| ❌ MISSING | 0 | No screens missing |
| 🏷️ NAME_MISMATCH | 0 | All folder names match |

## Detailed Verification

| SCR | Folder Name | Expected | Screenshot | Status |
|-----|-------------|----------|------------|--------|
| SCR-01 | `ng_nh_p_h_th_ng` | Nhập hệ thống (Login) | ✅ `login-screen.png` (129KB) | MATCHED |
| SCR-02 | `dashboard_qu_n_tr_1` | Dashboard quản trị 1 | ✅ `screenshot-2026-03-25-at-45343-pm.png` (318KB) | MATCHED |
| SCR-02 | `dashboard_qu_n_tr_2` | Dashboard quản trị 2 | ✅ `screenshot-2026-03-25-at-45349-pm.png` (356KB) | VARIANT |
| SCR-03 | `t_o_m_qr_ch_m_c_ng` | Tạo mã QR chấm công | ✅ `screenshot-2026-03-25-at-45421-pm.png` (306KB) | MATCHED |
| SCR-04 | `qu_t_m_qr_ch_m_c_ng_1` | Quét mã QR chấm công 1 | ✅ `screenshot-2026-03-25-at-45458-pm.png` (288KB) | MATCHED |
| SCR-04 | `qu_t_m_qr_ch_m_c_ng_2` | Quét mã QR chấm công 2 | ✅ `screenshot-2026-03-25-at-45504-pm.png` (260KB) | VARIANT |
| SCR-05 | `l_ch_s_ch_m_c_ng_t_ng_h_p` | Lịch sử chấm công (Tổng hợp) | ✅ `screenshot-2026-03-25-at-45544-pm.png` (360KB) | MATCHED |
| SCR-05 | `l_ch_s_ch_m_c_ng_c_nh_n` | Lịch sử chấm công (Cá nhân) | ✅ `screenshot-2026-03-25-at-45554-pm.png` (317KB) | VARIANT |
| SCR-06 | `qu_n_l_ca_l_m_vi_c` | Quản lý Ca làm việc | ✅ `screenshot-2026-03-25-at-46020-pm.png` (331KB) | MATCHED |
| SCR-07 | `c_u_h_nh_l_ng_h_th_ng` | Cấu hình lương hệ thống | ✅ `screenshot-2026-03-25-at-46100-pm.png` (320KB) | MATCHED |
| SCR-08 | `b_o_c_o_l_ng_h_ng_th_ng` | Báo cáo lương hệ thống | ✅ `screenshot-2026-03-25-at-46136-pm.png` (324KB) | MATCHED |
| SCR-08 | `phi_u_l_ng_c_nh_n` | Phiếu lương cá nhân | ✅ `screenshot-2026-03-25-at-46217-pm.png` (327KB) | VARIANT |
| SCR-09 | `qu_n_l_nh_n_s` | Quản lý nhân sự | ✅ `screenshot-2026-03-25-at-46253-pm.png` (337KB) | MATCHED |
| SCR-10 | `c_i_t_h_th_ng` | Cài đặt hệ thống | ✅ `screenshot-2026-03-25-at-46291-pm.png` (336KB) | MATCHED |
| SCR-11 | `qu_n_l_n_t_c_nh_n` | Quản lý đơn từ cá nhân | ✅ `screenshot-2026-03-25-at-46343-pm.png` (308KB) | MATCHED |
| SCR-12 | `duy_t_n_t_nh_n_vi_n` | Duyệt đơn từ nhân viên | ✅ `screenshot-2026-03-25-at-46357-pm.png` (310KB) | MATCHED |

## Variant Notes

Screens with multiple variants show different states or contexts of the same screen:

- **SCR-02 (Dashboard)**: Variant 1 = admin overview, Variant 2 = detailed stats view
- **SCR-04 (QR Scan)**: Variant 1 = camera view, Variant 2 = scan result/confirmation
- **SCR-05 (History)**: Total (admin view) vs Personal (employee view) — same screen, different data scope
- **SCR-08 (Salary)**: Report (admin) vs Personal slip (employee) — same screen, different data scope

## Screens NOT in Stitch (New Feature)

| SCR | Screen | Reason |
|-----|--------|--------|
| SCR-11 | Đơn từ cá nhân | Added after Stitch export — spec-only |
| SCR-12 | Duyệt đơn từ | Added after Stitch export — spec-only |

> These screens follow the same design language but were not part of the original Stitch project.
> Implementation should follow extracted tokens and component specs from this handoff.
