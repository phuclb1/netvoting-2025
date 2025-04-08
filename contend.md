# 🗳️ Phần Mềm Quản Lý Đại Hội Cổ Đông

## 1. Mục tiêu hệ thống

Xây dựng hệ thống hỗ trợ tổ chức đại hội cổ đông chuyên nghiệp, bao gồm:
- Tạo và quản lý sự kiện
- Gửi thư mời, quản lý danh sách cổ đông/khách mời
- Quản lý biểu quyết theo cổ phần
- Hạn chế truy cập hệ thống theo WiFi sự kiện
- Check-in bằng mã QR

---

## 2. Vai trò hệ thống

### 🛠️ Admin
- Tạo công ty, tạo sự kiện, vote item
- Import cổ đông/khách mời từ file Excel
- Gửi thư mời, nhắc nhở QR code
- Xem thống kê kết quả biểu quyết

### 👤 Cổ đông
- Xác nhận tham gia / không tham gia
- Ủy quyền người khác nếu không tham gia
- Nhận QR code tham dự
- Bình chọn các nội dung trong đại hội

### 👥 Khách mời
- Xác nhận tham gia / không tham gia
- Nhận QR code nếu tham dự

---

## 3. Đăng nhập và xác thực

- **Tài khoản:** CCCD (citizen_id)
- **Mật khẩu:** tạo tự động hoặc được đặt khi import
- **Email:** tạo ngẫu nhiên nếu không có, ví dụ `uid_123@auto.mail`

---

## 4. Database Schema (PostgreSQL)

### 📌 Bảng `companies`
```sql
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tax_code VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'shareholder', 'guest')) NOT NULL,
    citizen_id VARCHAR(20) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    password_hash TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP NOT NULL,
    location VARCHAR(255),
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vote_items (
    id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(id),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(id),
    user_id INT REFERENCES users(id),
    share_amount BIGINT DEFAULT 0,
    is_attending BOOLEAN,
    delegation_file TEXT,
    qr_code TEXT,
    email_sent BOOLEAN DEFAULT FALSE,
    qr_sent BOOLEAN DEFAULT FALSE,
    checked_in BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE delegations (
    id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(id),
    from_user_id INT REFERENCES users(id),
    to_user_id INT REFERENCES users(id),
    share_amount BIGINT,
    file_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    vote_item_id INT REFERENCES vote_items(id),
    user_id INT REFERENCES users(id),
    event_id INT REFERENCES events(id),
    vote_choice VARCHAR(20) CHECK (vote_choice IN ('yes', 'no', 'abstain')),
    share_amount BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

5. API design

POST /auth/login
{
  "citizen_id": "012345678912",
  "password": "123456"
}

🏢 Company
POST /companies: Tạo công ty

GET /companies/:id: Xem công ty

POST /companies/:id/users/import: Import user từ Excel

POST /companies/:id/users: Tạo user thủ công


📅 Event
POST /companies/:id/events: Tạo sự kiện

GET /companies/:id/events: Danh sách sự kiện

POST /events/:id/vote-items: Tạo biểu quyết

POST /events/:id/import-participants: Gán user vào event

POST /events/:id/send-invites: Gửi thư mời

POST /events/:id/send-qr-reminders: Nhắc lại QR



👥 Participants
GET /events/:id/invite: Xem thư mời

POST /events/:id/invite/respond: Xác nhận tham gia / không tham gia

POST /events/:id/delegation: Upload file ủy quyền

GET /events/:id/qr: Lấy lại QR

🗳️ Voting
GET /events/:id/vote-items: Danh sách biểu quyết

POST /events/:id/vote: Gửi biểu quyết

GET /events/:id/result: Xem kết quả



🌐 Access Control
GET /ip-check: Kiểm tra IP truy cập (chỉ cho phép WiFi nội bộ)

6. Logic bình chọn theo cổ phần
Tỷ lệ (%) = (Số cổ phần sở hữu + được ủy quyền) / Tổng cổ phần phát hành * 100

7. Ghi chú bổ sung
Email và mật khẩu có thể tạo ngẫu nhiên khi import từ Excel.

QR code sinh từ mã hóa user_id + event_id, dùng để check-in.

Tích hợp IP check để đảm bảo chỉ truy cập được khi kết nối đúng WiFi.

