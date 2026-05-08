import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import SeatMap from '../../components/SeatMap/SeatMap';
import styles from './SeatSelection.module.css';

export default function SeatSelection() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showTime, movieTitle, movieId } = location.state || {};
  const [selectedSeat, setSelectedSeat] = useState(null);

  if (!showTime) {
    return (
      <div className={styles.noData}>
        <p>No show time selected. Please go back to movies and select a show time.</p>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Movies
        </button>
      </div>
    );
  }

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

  const handleContinue = () => {
    navigate('/booking', {
      state: {
        showTime,
        movieTitle,
        movieId,
        selectedSeat,
        price: getPrice(selectedSeat?.seat_Type),
      },
    });
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        <ArrowLeft size={16} /> Back to Movies
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>Select Your Seat</h1>
        <div className={styles.subtitle}>
          <span>{movieTitle}</span>
          <span className={styles.subtitleDivider}>•</span>
          <span>{formatTime(showTime.start_Time)}</span>
          <span className={styles.subtitleDivider}>•</span>
          <span>{new Date(showTime.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          <span className={styles.hallBadge}>
            <MapPin size={12} />
            Hall {showTime.hall?.hall_No}
          </span>
        </div>
      </div>

      <div className={styles.seatMapWrapper}>
        <SeatMap
          hallNo={showTime.hall?.hall_No}
          showNo={showTime.show_No}
          selectedSeat={selectedSeat}
          onSelectSeat={setSelectedSeat}
        />
      </div>

      <div className={styles.selectionInfo}>
        <div className={styles.selectedSeatInfo}>
          <span className={styles.selectedSeatLabel}>Selected Seat</span>
          <span className={styles.selectedSeatValue}>
            {selectedSeat
              ? `${selectedSeat.row_Letter}${selectedSeat.seat_No} (${selectedSeat.seat_Type})`
              : 'None'}
          </span>
        </div>
        <div className={styles.priceInfo}>
          <span className={styles.priceLabel}>Price</span>
          <span className={styles.priceValue}>
            {selectedSeat ? `$${getPrice(selectedSeat.seat_Type)}` : '--'}
          </span>
        </div>
        <button
          className={styles.continueBtn}
          disabled={!selectedSeat}
          onClick={handleContinue}
        >
          Continue to Booking
        </button>
      </div>
    </div>
  );
}
