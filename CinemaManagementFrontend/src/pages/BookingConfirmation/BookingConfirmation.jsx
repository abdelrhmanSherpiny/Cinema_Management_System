import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Ticket, Film, MapPin, Clock, CheckCircle, Home } from 'lucide-react';
import api from '../../services/api';
import CustomerForm from '../../components/CustomerForm/CustomerForm';
import styles from './BookingConfirmation.module.css';

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showTime, movieTitle, selectedSeat, price } = location.state || {};
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isBooked, setIsBooked] = useState(false);
  const [booking, setBooking] = useState(false);

  if (!showTime || !selectedSeat) {
    return (
      <div className={styles.noData}>
        <p>Missing booking information. Please start from the movies page.</p>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Movies
        </button>
      </div>
    );
  }

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    const h = parseInt(parts[0]);
    const m = parts[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayH}:${m} ${ampm}`;
  };

  const handleConfirm = async () => {
    if (!selectedCustomer) return;
    setBooking(true);
    try {
      await api.post('/tickets', {
        show_No: showTime.show_No,
        seat_No: selectedSeat.seat_No,
        row_Letter: selectedSeat.row_Letter,
        customer_ID: selectedCustomer.customer_ID,
      });
      setIsBooked(true);
    } catch (err) {
      console.error(err);
      alert('Failed to book ticket. The seat may already be taken.');
    } finally {
      setBooking(false);
    }
  };

  if (isBooked) {
    return (
      <div className={styles.container}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <CheckCircle size={40} />
          </div>
          <h1 className={styles.successTitle}>Booking Confirmed!</h1>
          <p className={styles.successSubtitle}>
            Your ticket has been booked successfully.
          </p>

          <div className={styles.successDetails}>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Movie</span>
                <span className={styles.summaryValue}>{movieTitle}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Date & Time</span>
                <span className={styles.summaryValue}>
                  {new Date(showTime.date).toLocaleDateString()} at {formatTime(showTime.start_Time)}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Seat</span>
                <span className={`${styles.summaryValue} ${styles.seatHighlight}`}>
                  {selectedSeat.row_Letter}{selectedSeat.seat_No} ({selectedSeat.seat_Type})
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Hall</span>
                <span className={styles.summaryValue}>Hall {showTime.hall?.hall_No}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Customer</span>
                <span className={styles.summaryValue}>
                  {selectedCustomer.first_Name} {selectedCustomer.last_Name}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Price Paid</span>
                <span className={`${styles.summaryValue} ${styles.priceHighlight}`}>${price}</span>
              </div>
            </div>
          </div>

          <button className={styles.homeBtn} onClick={() => navigate('/')}>
            <Home size={18} />
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back to Seat Selection
      </button>

      <h1 className={styles.title}>
        <Ticket size={24} className={styles.titleIcon} />
        Confirm Your Booking
      </h1>

      {/* Booking Summary */}
      <div className={styles.summaryCard}>
        <h3 className={styles.summaryTitle}>
          <Film size={18} className={styles.summaryTitleIcon} />
          Booking Summary
        </h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Movie</span>
            <span className={styles.summaryValue}>{movieTitle}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Show Time</span>
            <span className={styles.summaryValue}>{formatTime(showTime.start_Time)}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Date</span>
            <span className={styles.summaryValue}>
              {new Date(showTime.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Hall</span>
            <span className={styles.summaryValue}>Hall {showTime.hall?.hall_No}</span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Seat</span>
            <span className={`${styles.summaryValue} ${styles.seatHighlight}`}>
              {selectedSeat.row_Letter}{selectedSeat.seat_No} ({selectedSeat.seat_Type})
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Price</span>
            <span className={`${styles.summaryValue} ${styles.priceHighlight}`}>${price}</span>
          </div>
        </div>
      </div>

      {/* Customer Selection */}
      <CustomerForm
        selectedCustomer={selectedCustomer}
        onSelectCustomer={setSelectedCustomer}
      />

      {/* Confirm Button */}
      <button
        className={styles.confirmBtn}
        disabled={!selectedCustomer || booking}
        onClick={handleConfirm}
      >
        <Ticket size={18} />
        {booking ? 'Booking...' : 'Confirm & Book Ticket'}
      </button>
    </div>
  );
}
