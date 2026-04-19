const express = require('express');
const router = express.Router();
const { authMiddleware } = require('./auth.routes');

const BANK_CONFIG = {
    bank_name: 'MB Bank',
    bank_id: 'MB',
    account_number: '877906101988',
    account_name: 'NGUYEN VAN LUONG'
};

const TOPUP_PACKAGES = [
    {
        id: 'starter_49k',
        name: 'Gói Khởi Mệnh',
        amount_vnd: 49000,
        credits: 100,
        bonus_credits: 0,
        badge: 'Phổ biến'
    },
    {
        id: 'pro_99k',
        name: 'Gói Hộ Mệnh',
        amount_vnd: 99000,
        credits: 200,
        bonus_credits: 50,
        badge: 'Tiết kiệm nhất'
    }
];

router.get('/info', authMiddleware, (req, res) => {
    const userId = req.user.id;
    const memo = `MENHSO ${userId}`;
    const createQrUrl = (amountVnd) =>
        `https://img.vietqr.io/image/${BANK_CONFIG.bank_id}-${BANK_CONFIG.account_number}-compact2.png?amount=${amountVnd}&addInfo=${encodeURIComponent(memo)}&accountName=${encodeURIComponent(BANK_CONFIG.account_name)}`;

    const packages = TOPUP_PACKAGES.map((pkg) => ({
        ...pkg,
        qr_url: createQrUrl(pkg.amount_vnd)
    }));

    res.json({
        ...BANK_CONFIG,
        memo,
        qr_url: packages[0].qr_url,
        packages,
        instructions: [
            'Bước 1: Mở ứng dụng ngân hàng và chọn quét mã QR.',
            'Bước 2: Chọn gói 49K hoặc 99K và quét đúng mã QR của gói đó.',
            `Bước 3: Kiểm tra số tài khoản và nội dung chuyển khoản phải đúng là ${memo}.`,
            'Bước 4: Chuyển đúng số tiền hiển thị trên mã QR để Admin đối chiếu nhanh.',
            'Bước 5: Sau khi chuyển khoản xong, vui lòng gửi xác nhận qua Zalo để được duyệt nhanh.'
        ]
    });
});

module.exports = router;
