import React, { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';

const TopupModal = ({ isOpen, onClose }) => {
    const [paymentInfo, setPaymentInfo] = useState(null);
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
            const data = await apiClient.get('/api/payment/info');
            setPaymentInfo(data);
            setError(null);
        } catch (err) {
            setError('Không thể tải thông tin thanh toán. Vui lòng thử lại sau.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay fade-in">
            <div className="glass-card modal-content topup-modal animate-pop">
                <div className="modal-header">
                    <h3>💎 Nạp Linh Thạch (Credits)</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {loading ? (
                        <div className="loading-spinner">Đang tải...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : paymentInfo ? (
                        <div className="payment-container">
                            <div className="payment-qr-section">
                                <img 
                                    src={paymentInfo.qr_url} 
                                    alt="VietQR Payment" 
                                    className="qr-image"
                                />
                                <div className="qr-hint">Quét mã bằng App Ngân hàng để tự động điền thông tin</div>
                            </div>

                            <div className="payment-details-section">
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
                                <div className="detail-item important">
                                    <label>Nội dung CK (Bắt buộc):</label>
                                    <span className="memo-text">{paymentInfo.memo}</span>
                                </div>
                                
                                <div className="payment-notes">
                                    <h4>Hướng dẫn:</h4>
                                    <ul>
                                        {paymentInfo.instructions.map((step, index) => (
                                            <li key={index}>{step}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>Đóng</button>
                    <button className="btn-primary" onClick={() => window.open('https://m.me/huyencobattu', '_blank')}>
                        Gửi xác nhận qua Messenger
                    </button>
                </div>
            </div>

            <style jsx>{`
                .topup-modal {
                    max-width: 800px;
                    width: 95%;
                    padding: 0;
                    overflow: hidden;
                }
                .modal-header {
                    padding: 20px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-body {
                    padding: 20px;
                    max-height: 70vh;
                    overflow-y: auto;
                }
                .payment-container {
                    display: grid;
                    grid-template-columns: 1fr 1.5fr;
                    gap: 30px;
                }
                .qr-image {
                    width: 100%;
                    border-radius: 12px;
                    border: 4px solid white;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                }
                .qr-hint {
                    margin-top: 15px;
                    font-size: 0.9rem;
                    color: #fff;
                    opacity: 0.8;
                    text-align: center;
                    font-style: italic;
                }
                .detail-item {
                    display: flex;
                    justify-content: space-between;
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
                }
                .memo-text {
                    color: #ff4d4d !important;
                    font-size: 1.2rem;
                    background: rgba(255, 77, 77, 0.1);
                    padding: 2px 8px;
                    border-radius: 4px;
                }
                .payment-notes {
                    margin-top: 20px;
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
                    padding-left: 20px;
                    font-size: 0.85rem;
                    line-height: 1.5;
                }
                .modal-footer {
                    padding: 20px;
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                    background: rgba(0, 0, 0, 0.2);
                }
                @media (max-width: 600px) {
                    .payment-container {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default TopupModal;
