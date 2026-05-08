import { useState } from 'react';
import { X, MapPin, CheckCircle, Ticket, Check } from 'lucide-react';
import api from '../../services/api';
import SeatMap from '../SeatMap/SeatMap';
import CustomerForm from '../CustomerForm/CustomerForm';
import styles from './BookingModal.module.css';

export default function BookingModal({ bookingData, onClose }) {
  const { showTime, movieTitle, movieId, movieGenres } = bookingData;
  const [step, setStep] = useState(1); // 1=seat, 2=customer+confirm, 3=success
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [booking, setBooking] = useState(false);

  const getPrice = (seatType) => {
    switch (seatType) {
      case 'VIP': return 150;
      case 'Premium': return 100;
      default: return 50;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    const h = parseInt(parts[0]);
    const m = parts[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayH}:${m} ${ampm}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const price = selectedSeat ? getPrice(selectedSeat.seat_Type) : 0;

  const handleConfirm = async () => {
    if (!selectedCustomer || !selectedSeat) return;
    setBooking(true);
    try {
      await api.post('/tickets', {
        show_No: showTime.show_No,
        seat_No: selectedSeat.seat_No,
        row_Letter: selectedSeat.row_Letter,
        customer_ID: selectedCustomer.customer_ID,
      });
      setStep(3);
    } catch (err) {
      console.error(err);
      alert('Failed to book ticket. The seat may already be taken.');
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <h2>{movieTitle}</h2>
            <div className={styles.headerMeta}>
              <span>{formatTime(showTime.start_Time)}</span>
              <span className={styles.headerDot}>•</span>
              <span>{formatDate(showTime.date)}</span>
              <span className={styles.headerBadge}>
                <MapPin size={11} />
                Hall {showTime.hall?.hall_No}
              </span>
              {movieGenres?.length > 0 && (
                <>
                  <span className={styles.headerDot}>•</span>
                  <span>{movieGenres.join(', ')}</span>
                </>
              )}
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        {/* Steps */}
        {step < 3 && (
          <div className={styles.steps}>
            <div className={`${styles.step} ${step === 1 ? styles.stepActive : step > 1 ? styles.stepDone : ''}`}>
              <span className={styles.stepNumber}>{step > 1 ? <Check size={13} /> : '1'}</span>
              Select Seat
            </div>
            <div className={styles.stepDivider} />
            <div className={`${styles.step} ${step === 2 ? styles.stepActive : ''}`}>
              <span className={styles.stepNumber}>2</span>
              Confirm & Book
            </div>
          </div>
        )}

        {/* Body */}
        <div className={styles.modalBody}>
          {/* ── Step 1: Seat Selection ── */}
          {step === 1 && (
            <>
              <SeatMap
                hallNo={showTime.hall?.hall_No}
                showNo={showTime.show_No}
                selectedSeat={selectedSeat}
                onSelectSeat={setSelectedSeat}
              />
              <div className={styles.seatInfoRow}>
                <div className={styles.seatInfoBlock}>
                  <span className={styles.seatInfoLabel}>Selected Seat</span>
                  <span className={styles.seatInfoValue}>
                    {selectedSeat
                      ? `${selectedSeat.row_Letter}${selectedSeat.seat_No} (${selectedSeat.seat_Type})`
                      : 'None'}
                  </span>
                </div>
                <div className={styles.seatInfoBlock}>
                  <span className={styles.seatInfoLabel}>Price</span>
                  <span className={styles.priceInfoValue}>
                    {selectedSeat ? `$${price}` : '—'}
                  </span>
                </div>
                <button
                  className={styles.nextBtn}
                  disabled={!selectedSeat}
                  onClick={() => setStep(2)}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* ── Step 2: Customer + Confirm ── */}
          {step === 2 && (
            <>
              <div className={styles.summaryBar}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Movie</span>
                  <span className={styles.summaryValue}>{movieTitle}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Show Time</span>
                  <span className={styles.summaryValue}>
                    {formatTime(showTime.start_Time)} — {formatDate(showTime.date)}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Hall</span>
                  <span className={styles.summaryValue}>Hall {showTime.hall?.hall_No}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Seat</span>
                  <span className={`${styles.summaryValue} ${styles.seatValue}`}>
                    {selectedSeat.row_Letter}{selectedSeat.seat_No} ({selectedSeat.seat_Type})
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Price</span>
                  <span className={`${styles.summaryValue} ${styles.priceValue}`}>${price}</span>
                </div>
              </div>

              <CustomerForm
                selectedCustomer={selectedCustomer}
                onSelectCustomer={setSelectedCustomer}
              />

              <button
                className={styles.confirmBtn}
                disabled={!selectedCustomer || booking}
                onClick={handleConfirm}
              >
                <Ticket size={18} />
                {booking ? 'Booking...' : 'Confirm & Book Ticket'}
              </button>
            </>
          )}

          {/* ── Step 3: Success ── */}
          {step === 3 && (
            <div className={styles.successContainer}>
              <div className={styles.successIcon}>
                <CheckCircle size={36} />
              </div>
              <h2 className={styles.successTitle}>Booking Confirmed!</h2>
              <p className={styles.successSubtitle}>Your ticket has been booked successfully.</p>

              <div className={styles.successGrid}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Movie</span>
                  <span className={styles.summaryValue}>{movieTitle}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Date & Time</span>
                  <span className={styles.summaryValue}>
                    {formatDate(showTime.date)} at {formatTime(showTime.start_Time)}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Hall</span>
                  <span className={styles.summaryValue}>Hall {showTime.hall?.hall_No}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Seat</span>
                  <span className={`${styles.summaryValue} ${styles.seatValue}`}>
                    {selectedSeat.row_Letter}{selectedSeat.seat_No} ({selectedSeat.seat_Type})
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Customer</span>
                  <span className={styles.summaryValue}>
                    {selectedCustomer.first_Name} {selectedCustomer.last_Name}
                  </span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Price</span>
                  <span className={`${styles.summaryValue} ${styles.priceValue}`}>${price}</span>
                </div>
              </div>

              <button className={styles.doneBtn} onClick={onClose}>
                <CheckCircle size={16} />
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
