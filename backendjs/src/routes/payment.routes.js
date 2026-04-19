const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth.routes');

const BANK_CONFIG = {
    bank_name: 'MB Bank',
    bank_id: 'MB', // Swift/Napas code
    account_number: '877906101988',
    account_name: 'NGUYEN VAN LUONG',
}

// GET /api/payment/info - Lấy thông tin tài khoản và mã QR
router.get('/info', authMiddleware, (req, res) => {
    const userId = req.user.id;
    // Format nội dung chuyển khoản: BAZI [User ID]
    const memo = `MENHSO ${userId}`;
    
    // Tạo link VietQR động
    // Cấu trúc: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>
    const qrUrl = `https://img.vietqr.io/image/${BANK_CONFIG.bank_id}-${BANK_CONFIG.account_number}-compact2.png?addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(BANK_CONFIG.account_name)}`;

    res.json({
        ...BANK_CONFIG,
        memo,
        qr_url: qrUrl,
        instructions: [
            'Bước 1: Mở ứng dụng ngân hàng và chọn quét mã QR.',
            'Bước 2: Quét mã QR hiển thị trên màn hình.',
            'Bước 3: Kiểm tra thông tin số tài khoản và nội dung chuyển khoản (phải đúng là ' + memo + ').',
            'Bước 4: Thực hiện chuyển khoản số tiền bạn muốn nạp (Quy đổi: 1.000 VNĐ = 10 Linh Thạch).',
            'Bước 5: Sau khi chuyển khoản xong, vui lòng chờ 1-5 phút để Admin duyệt Linh thạch.'
        ]
    });
});

module.exports = router;
