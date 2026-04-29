# 📋 QUY TRÌNH KIỂM THỬ — ỨNG DỤNG CƠMCƠM (ĐẶT CƠM)

> **Ngày viết:** 24/04/2026  
> **Phiên bản:** 1.0  
> **Môi trường test:** Production (web đã deploy)

---

## 🔑 THÔNG TIN ĐĂNG NHẬP & TÀI KHOẢN TEST

### Tài khoản Admin
| Thông tin | Giá trị |
|---|---|
| **URL đăng nhập** | `[domain]/admin` |
| **Mật khẩu** | Lấy từ biến môi trường `ADMIN_PASSWORD` trên Vercel |
| **Thời hạn phiên** | 8 giờ (cookie tự động hết hạn sau 8h) |

> [!IMPORTANT]
> Mật khẩu Admin **KHÔNG** có username, chỉ nhập mật khẩu đơn. Không chia sẻ mật khẩu này ra ngoài.

### Tài khoản User (Test)
| Thông tin | Giá trị mẫu |
|---|---|
| **Số điện thoại** | `0901234567` |
| **Mật khẩu** | `Test123` (≥ 6 ký tự) |
| **Mã người dùng** | Sẽ được Admin tạo và gán (VD: `TEST-001`) |

---

## 🟦 PHẦN 1: LUỒNG NGƯỜI DÙNG (USER FLOW)

### TC-U01 · Đăng ký tài khoản mới
**URL:** `[domain]/dang-ky`

#### Happy Path ✅
1. Vào trang `/dang-ky`
2. Nhập **Số điện thoại**: `0901234567`
3. Nhập **Mật khẩu**: `Test123` → Thanh độ mạnh phải chuyển sang **"Trung bình"** (màu vàng)
4. Nhập lại **Mật khẩu xác nhận**: `Test123` → Icon ✅ màu xanh lá xuất hiện bên phải ô
5. Bấm **"Tạo tài khoản"**
6. ✅ Kết quả: Chuyển hướng về trang chủ `/`

#### Edge Cases ⚠️
| Kịch bản | Dữ liệu nhập | Kết quả mong đợi |
|---|---|---|
| SĐT không hợp lệ | `12345` | Báo lỗi: *"Số điện thoại không hợp lệ"* |
| Mật khẩu < 6 ký tự | `abc` | Báo lỗi: *"Mật khẩu ít nhất 6 ký tự"* |
| Mật khẩu xác nhận không khớp | `Test123` / `Test456` | Báo lỗi: *"Mật khẩu xác nhận không khớp"* + icon ❌ đỏ |
| SĐT đã được dùng | SĐT đã đăng ký | Báo lỗi từ server |
| Để trống tất cả | Bỏ trống | Validate ngay khi bấm Submit |

---

### TC-U02 · Đăng nhập
**URL:** `[domain]/dang-nhap`

#### Happy Path ✅
1. Vào trang `/dang-nhap`
2. Nhập **Số điện thoại**: `0901234567`
3. Nhập **Mật khẩu**: `Test123`
4. Bấm nút **"Đăng nhập"** (hoặc Enter)
5. ✅ Kết quả: Chuyển hướng về trang chủ `/`, Header hiển thị thông tin người dùng

#### Edge Cases ⚠️
| Kịch bản | Kết quả mong đợi |
|---|---|
| Sai mật khẩu | Báo lỗi: *"Sai số điện thoại hoặc mật khẩu"* |
| SĐT không tồn tại | Báo lỗi: *"Sai số điện thoại hoặc mật khẩu"* |
| Bỏ trống | Báo lỗi phù hợp |
| Bấm icon 👁 mật khẩu | Toggle hiện/ẩn mật khẩu |

---

### TC-U03 · Xem thực đơn hôm nay
**URL:** `[domain]/` (Trang chủ)

#### Điều kiện: Chưa có menu hôm nay
- ✅ Hiển thị biểu tượng tô cơm + text: *"Chưa có menu hôm nay"*
- ✅ Sub-text: *"Admin đang chuẩn bị thực đơn cho bạn..."*

#### Điều kiện: Có menu, còn giờ đặt
1. Admin đã tạo menu và thêm món
2. Vào trang chủ
3. ✅ Hiển thị banner Hero + ngày hôm nay (định dạng Tiếng Việt: *"Thứ Năm, 24 tháng 4 năm 2026"*)
4. ✅ Hiển thị thông báo: *"Đặt trước **HH:MM** hôm nay"* (màu xanh cyan)
5. ✅ Các card món ăn hiển thị: Tên món, Giá (định dạng VNĐ), Số suất còn lại
6. ✅ Nút **"Đặt ngay"** màu xanh, có thể bấm được

#### Điều kiện: Đã qua giờ chốt đơn
- ✅ Hiển thị cảnh báo vàng: *"Đã hết giờ đặt hôm nay — Hẹn gặp lại ngày mai bạn nhé! 👋"*
- ✅ Nút chuyển thành **"Hết giờ đặt"** màu xám, disabled, không bấm được

#### Điều kiện: Một món đã hết
- ✅ Card đó hiển thị overlay mờ + badge đỏ **"Đã hết"**
- ✅ Nút **"Đã hết"** màu xám, disabled

---

### TC-U04 · Đặt cơm
**URL:** `[domain]/order/[itemId]?date=[YYYY-MM-DD]`

#### Happy Path ✅
1. Từ trang chủ, bấm **"Đặt ngay"** trên card một món
2. Xem thông tin món (tên, giá, ngày)
3. Bấm xác nhận đặt
4. ✅ Chuyển sang trang `/success`

#### Edge Cases ⚠️
- Vào URL `/order` của món đã hết hoặc hết giờ → Không thể đặt, hiển thị thông báo phù hợp

---

### TC-U05 · Kiểm tra đơn hàng
**URL:** `[domain]/check`

1. Sau khi đặt thành công, vào trang `/check`
2. ✅ Hiển thị đơn hàng vừa đặt: Tên món, ngày đặt, trạng thái
3. ✅ Thông tin đúng với đơn vừa tạo

---

## 🟧 PHẦN 2: LUỒNG QUẢN TRỊ VIÊN (ADMIN FLOW)

### TC-A01 · Đăng nhập Admin
**URL:** `[domain]/admin`

#### Happy Path ✅
1. Vào trang `/admin`
2. Nhập đúng **Mật khẩu** (giá trị `ADMIN_PASSWORD` trong Vercel env)
3. Bấm **"Đăng nhập"**
4. ✅ Chuyển hướng sang `/admin/dashboard`
5. ✅ Cookie `admin_session` được tạo (HttpOnly, hết hạn 8 giờ)

#### Edge Cases ⚠️
| Kịch bản | Kết quả mong đợi |
|---|---|
| Nhập sai mật khẩu | Báo lỗi: *"Sai mật khẩu"* |
| Để trống | Không gửi request |
| Tải lại trang sau khi đăng nhập | Vẫn ở trang dashboard (cookie còn hạn) |
| Mở tab ẩn danh | Yêu cầu đăng nhập lại |

---

### TC-A02 · Dashboard Tổng Quan
**URL:** `[domain]/admin/dashboard`

#### Kiểm tra hiển thị số liệu
| Chỉ số | Mô tả | Cách xác minh |
|---|---|---|
| **Đơn hôm nay** | Tổng số đơn đã đặt trong ngày | Đếm đơn test đã đặt |
| **Suất đã dùng** | Tổng số suất trong các đơn | SL từng đơn cộng lại |
| **Người đặt** | Số user duy nhất đã đặt hôm nay | Đếm user test |
| **Tổng mã** | Tổng số mã trong hệ thống | Xem tab Mã người dùng |

#### Kiểm tra bảng Đơn hàng hôm nay
- ✅ Hiển thị: Mã (màu cam), Họ tên, Món, Số lượng, Địa chỉ
- ✅ Cảnh báo "Sắp hết số lượng" (màu vàng) khi món còn ≤ ngưỡng

---

### TC-A03 · Quản lý Thực Đơn (Menus)
**URL:** `[domain]/admin/menus`

#### Tạo menu mới
1. Bấm nút **"Tạo menu"** (cam)
2. Chọn **Ngày** (VD: hôm nay)
3. Chọn **Giờ chốt** (VD: `09:00`)
4. Bấm **"Tạo"**
5. ✅ Menu xuất hiện trong danh sách, trạng thái **"Đang mở"** (xanh lá)

#### Bật/Tắt menu
1. Bấm badge **"Đang mở"** hoặc **"Đã tắt"**
2. ✅ Trạng thái toggle ngay lập tức
3. ✅ Kiểm tra trang chủ user → Nếu tắt, menu không hiển thị

#### Quản lý món trong menu
1. Bấm link **"Quản lý món"** ở cột thao tác
2. Thêm món: Nhập Tên món, Giá, Số suất tối đa
3. ✅ Món xuất hiện ngoài trang chủ của User

#### Xóa menu
1. Bấm **"Xóa"** → Hộp thoại confirm hiện ra
2. Xác nhận → Menu bị xóa
3. ✅ Trang chủ User hiển thị trạng thái "Chưa có menu"

---

### TC-A04 · Quản lý Mã Người Dùng (Users)
**URL:** `[domain]/admin/users`

#### Tạo mã mới
1. Bấm **"Tạo mã"**
2. Điền form:
   - **Mã** *(bắt buộc)*: `TEST-001` (tự động viết hoa)
   - **Họ tên** *(bắt buộc)*: `Nguyễn Văn Test`
   - **Số điện thoại**: `0901234567`
   - **Số suất**: `20`
   - **Địa chỉ giao**: `123 Đường Test`
3. Bấm **"Tạo mã"**
4. ✅ Mã xuất hiện trong danh sách, hiển thị: Tổng=20, Đã dùng=0, Còn lại=20 (xanh lá)

#### Gán mã cho tài khoản chờ
> Khi User đăng ký SĐT nhưng chưa được gán mã → Xuất hiện bảng **"Chờ gán mã"** màu cam

1. Tìm SĐT user trong bảng "Chờ gán mã"
2. Nhập mã vào ô (VD: `TEST-001`)
3. Bấm **"Gán mã"**
4. ✅ User biến mất khỏi danh sách chờ
5. ✅ Kiểm tra user đăng nhập → Tài khoản đã được liên kết

#### Nạp thêm suất
1. Bấm **"Nạp suất"** ở cột cuối của một mã
2. Modal hiện ra: Hiển thị Tên, Mã, Số suất còn lại
3. Nhập số suất muốn thêm (VD: `10`)
4. Bấm **"Nạp suất"**
5. ✅ Số suất cộng thêm đúng (VD: còn 5 + nạp 10 = còn 15)

#### Tìm kiếm mã
1. Nhập từ khóa vào ô tìm kiếm (VD: `TEST` hoặc tên)
2. Bấm **"Tìm"** hoặc Enter
3. ✅ Kết quả lọc đúng

---

### TC-A05 · Báo Cáo & Xuất Dữ Liệu
**URL:** `[domain]/admin/reports`

#### Xem báo cáo theo khoảng ngày
1. Chọn **Từ ngày** → **Đến ngày**
2. Bấm **"Xem báo cáo"**
3. ✅ Bảng hiển thị: Ngày, Mã, Họ tên, Món, SL, Giá, Địa chỉ
4. ✅ Tổng số suất hiển thị đúng ở tiêu đề bảng

#### Lọc theo mã người dùng
1. Trong bảng kết quả, bấm vào **Mã** (VD: `TEST-001`) màu cam
2. ✅ Chỉ hiển thị đơn của mã đó
3. Bấm **"Bỏ lọc"** → Hiển thị tất cả lại

#### Xuất CSV
1. Sau khi đã có kết quả báo cáo, bấm **"Xuất CSV"**
2. ✅ File CSV tải về tự động
3. ✅ Mở file kiểm tra cột: `Ngày, Mã, Họ tên, Món, SL, Giá, Địa chỉ, SĐT`

---

## 🔄 LUỒNG TEST TÍCH HỢP ĐẦU-CUỐI (End-to-End)

> Test toàn bộ hệ thống theo thứ tự sau:

```
[Admin] Tạo mã TEST-001 (số suất: 5)
    ↓
[Admin] Tạo menu ngày hôm nay, giờ chốt 23:59
    ↓
[Admin] Thêm 2 món: "Cơm sườn" (30.000đ, 3 suất) + "Cơm gà" (25.000đ, không giới hạn)
    ↓
[User] Đăng ký SĐT 0901234567
    ↓
[Admin] Vào Users → Gán mã TEST-001 cho SĐT 0901234567
    ↓
[User] Đăng nhập → Vào trang chủ → Thấy 2 món
    ↓
[User] Bấm "Đặt ngay" → Chọn "Cơm sườn" → Xác nhận
    ↓
[User] Vào /check → Xác nhận đơn đã đặt
    ↓
[Admin] Vào Dashboard → Số liệu cập nhật đúng (1 đơn, 1 suất, 1 người đặt)
    ↓
[Admin] Vào Báo cáo → Xem/Xuất CSV → Đơn vừa đặt xuất hiện
    ↓
[Admin] Nạp thêm suất cho TEST-001 → Còn lại tăng
```

---

## ✅ CHECKLIST NGHIỆM THU

- [ ] Đăng ký tài khoản mới thành công
- [ ] Đăng nhập User thành công, lỗi hiện đúng thông báo
- [ ] Trang chủ hiển thị menu/không có menu đúng trạng thái
- [ ] Giờ chốt đơn hoạt động đúng (disable nút khi hết giờ)
- [ ] Sold-out hoạt động đúng (overlay mờ + badge "Đã hết")
- [ ] Đặt cơm thành công → Trang Success
- [ ] Trang Check hiển thị đúng đơn đã đặt
- [ ] Admin đăng nhập bằng mật khẩu đúng
- [ ] Admin sai mật khẩu → Hiện lỗi
- [ ] Dashboard hiển thị đúng số liệu thực tế
- [ ] Tạo menu mới + Toggle bật/tắt
- [ ] Thêm/xóa món trong menu
- [ ] Tạo mã người dùng
- [ ] Gán mã cho user đăng ký chờ
- [ ] Nạp thêm suất → Số suất tăng đúng
- [ ] Báo cáo lọc đúng theo ngày
- [ ] Xuất CSV thành công + dữ liệu đầy đủ
