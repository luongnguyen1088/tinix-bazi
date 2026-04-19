import React, { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

const TopupModal = ({ isOpen, onClose }) => {
    const [paymentInfo, setPaymentInfo] = useState(null);
    const [selectedPackageId, setSelectedPackageId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchPaymentInfo();
        }
    }, [isOpen]);

    const fetchPaymentInfo = async () => {
        setLoading(true);
        try {
            const data = await apiClient.get('/payment/info');
            setPaymentInfo(data);
            setSelectedPackageId(data.packages?.[0]?.id || null);
            setError(null);
        } catch (err) {
            setError('Không thể tải thông tin thanh toán. Vui lòng thử lại sau.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const selectedPackage = paymentInfo?.packages?.find((pkg) => pkg.id === selectedPackageId) || paymentInfo?.packages?.[0];

    return (
        <div className="modal-overlay fade-in">
            <div className="glass-card modal-content topup-modal animate-pop">
                <div className="modal-header">
                    <div>
                        <h3>💎 Nạp Linh Thạch</h3>
                        <p className="modal-subtitle">Chọn 1 trong 2 gói cố định để thanh toán nhanh hơn.</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="loading-spinner">Đang tải...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : paymentInfo && selectedPackage ? (
                        <>
                            <div className="package-grid">
                                {paymentInfo.packages.map((pkg) => {
                                    const isActive = pkg.id === selectedPackage.id;
                                    const totalCredits = pkg.credits + (pkg.bonus_credits || 0);

                                    return (
                                        <button
                                            key={pkg.id}
                                            type="button"
                                            className={`package-card ${isActive ? 'active' : ''}`}
                                            onClick={() => setSelectedPackageId(pkg.id)}
                                        >
                                            <div className="package-topline">
                                                <span className="package-name">{pkg.name}</span>
                                                <span className="package-badge">{pkg.badge}</span>
                                            </div>
                                            <div className="package-price">{formatCurrency(pkg.amount_vnd)}</div>
                                            <div className="package-credits">💎 {totalCredits} Linh Thạch</div>
                                            <div className="package-meta">
                                                <span>Cơ bản: {pkg.credits}</span>
                                                <span>Thưởng thêm: +{pkg.bonus_credits || 0}</span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="payment-container">
                                <div className="payment-qr-section">
                                    <img
                                        src={selectedPackage.qr_url}
                                        alt={`VietQR ${selectedPackage.name}`}
                                        className="qr-image"
                                    />
                                    <div className="qr-hint">
                                        Quét mã để nạp đúng gói {selectedPackage.name} - {formatCurrency(selectedPackage.amount_vnd)}
                                    </div>
                                </div>

                                <div className="payment-details-section">
                                    <div className="selected-package-summary">
                                        <span className="summary-kicker">GÓI ĐANG CHỌN</span>
                                        <strong>{selectedPackage.name}</strong>
                                        <span>{formatCurrency(selectedPackage.amount_vnd)} • 💎 {selectedPackage.credits + (selectedPackage.bonus_credits || 0)} Linh Thạch</span>
                                    </div>

                                    <div className="detail-item">
                                        <label>Ngân hàng:</label>
                                        <span>{paymentInfo.bank_name} (MB)</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Số tài khoản:</label>
                                        <span className="copyable">{paymentInfo.account_number}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Chủ tài khoản:</label>
                                        <span>{paymentInfo.account_name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Số tiền:</label>
                                        <span>{formatCurrency(selectedPackage.amount_vnd)}</span>
                                    </div>
                                    <div className="detail-item important">
                                        <label>Nội dung CK:</label>
                                        <span className="memo-text">{paymentInfo.memo}</span>
                                    </div>

                                    <div className="payment-notes">
                                        <h4>Hướng dẫn</h4>
                                        <ul>
                                            {paymentInfo.instructions.map((step, index) => (
                                                <li key={index}>{step}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Đóng</button>
                    <button className="btn-primary" onClick={() => window.open('https://zalo.me/0905691988', '_blank')}>
                        Gửi xác nhận qua Zalo
                    </button>
                </div>
            </div>

            <style jsx>{`
                .topup-modal {
                    max-width: 920px;
                    width: 95%;
                    padding: 0;
                    overflow: hidden;
                }
                .modal-header {
                    padding: 20px 22px 18px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 12px;
                }
                .modal-subtitle {
                    margin: 6px 0 0;
                    font-size: 0.92rem;
                    color: rgba(255, 255, 255, 0.72);
                }
                .modal-body {
                    padding: 20px 22px;
                    max-height: 72vh;
                    overflow-y: auto;
                }
                .package-grid {
                    display: grid;
                    grid-template-columns: repeat(2, minmax(0, 1fr));
                    gap: 14px;
                    margin-bottom: 18px;
                }
                .package-card {
                    text-align: left;
                    padding: 14px 16px;
                    border-radius: 16px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    background: rgba(255, 255, 255, 0.03);
                    color: #fff;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .package-card:hover {
                    transform: translateY(-2px);
                    border-color: rgba(255, 215, 0, 0.28);
                }
                .package-card.active {
                    background: linear-gradient(180deg, rgba(255, 215, 0, 0.14), rgba(255, 215, 0, 0.04));
                    border-color: rgba(255, 215, 0, 0.42);
                    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
                }
                .package-topline {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 10px;
                }
                .package-name {
                    font-size: 0.95rem;
                    font-weight: 700;
                }
                .package-badge {
                    padding: 4px 8px;
                    border-radius: 999px;
                    background: rgba(255, 215, 0, 0.14);
                    color: #ffd700;
                    font-size: 0.72rem;
                    font-weight: 700;
                }
                .package-price {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #ffd700;
                    margin-bottom: 6px;
                }
                .package-credits {
                    font-size: 0.98rem;
                    font-weight: 700;
                    margin-bottom: 8px;
                }
                .package-meta {
                    display: flex;
                    justify-content: space-between;
                    gap: 10px;
                    font-size: 0.78rem;
                    color: rgba(255, 255, 255, 0.68);
                }
                .payment-container {
                    display: grid;
                    grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
                    gap: 22px;
                    align-items: start;
                }
                .qr-image {
                    width: 100%;
                    border-radius: 14px;
                    border: 4px solid rgba(255, 255, 255, 0.9);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                }
                .qr-hint {
                    margin-top: 12px;
                    font-size: 0.86rem;
                    color: rgba(255, 255, 255, 0.8);
                    text-align: center;
                    line-height: 1.45;
                }
                .selected-package-summary {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    margin-bottom: 16px;
                    padding: 14px 16px;
                    border-radius: 14px;
                    background: rgba(255, 215, 0, 0.08);
                    border: 1px solid rgba(255, 215, 0, 0.16);
                }
                .summary-kicker {
                    font-size: 0.68rem;
                    font-weight: 800;
                    letter-spacing: 0.12em;
                    color: rgba(255, 255, 255, 0.55);
                }
                .detail-item {
                    display: flex;
                    justify-content: space-between;
                    gap: 12px;
                    margin-bottom: 12px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                .detail-item label {
                    color: #aaaaaa;
                }
                .detail-item span {
                    font-weight: 600;
                    color: #ffd700;
                    text-align: right;
                }
                .memo-text {
                    color: #ff6b6b !important;
                    font-size: 1.05rem;
                    background: rgba(255, 77, 77, 0.1);
                    padding: 2px 8px;
                    border-radius: 4px;
                }
                .payment-notes {
                    margin-top: 18px;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 15px;
                    border-radius: 12px;
                }
                .payment-notes h4 {
                    margin-bottom: 10px;
                    color: #ffd700;
                    font-size: 1rem;
                }
                .payment-notes ul {
                    padding-left: 18px;
                    margin: 0;
                    font-size: 0.84rem;
                    line-height: 1.58;
                }
                .modal-footer {
                    padding: 18px 22px 20px;
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    background: rgba(0, 0, 0, 0.2);
                }
                @media (max-width: 720px) {
                    .package-grid,
                    .payment-container {
                        grid-template-columns: 1fr;
                    }
                    .package-meta,
                    .detail-item {
                        flex-direction: column;
                    }
                    .detail-item span {
                        text-align: left;
                    }
                }
            `}</style>
        </div>
    );
};

export default TopupModal;
