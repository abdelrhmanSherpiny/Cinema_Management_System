import { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from './SeatMap.module.css';

export default function SeatMap({ hallNo, showNo, selectedSeat, onSelectSeat }) {
  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [seatsRes, bookedRes] = await Promise.all([
          api.get(`/halls/${hallNo}/seats`),
          api.get(`/halls/${hallNo}/seats/booked?showNo=${showNo}`),
        ]);
        setSeats(seatsRes.data);
        setBookedSeats(bookedRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hallNo, showNo]);

  if (loading) {
    return <div className={styles.loading}>Loading seats...</div>;
  }

  // Group seats by row
  const rows = {};
  seats.forEach((seat) => {
    const row = seat.row_Letter;
    if (!rows[row]) rows[row] = [];
    rows[row].push(seat);
  });

  // Sort rows and seats
  const sortedRowKeys = Object.keys(rows).sort();
  sortedRowKeys.forEach((key) => {
    rows[key].sort((a, b) => a.seat_No - b.seat_No);
  });

  const isBooked = (seatNo, rowLetter) => {
    return bookedSeats.some(
      (b) => b.seat_No === seatNo && b.row_Letter === rowLetter
    );
  };

  const isSelected = (seatNo, rowLetter) => {
    return (
      selectedSeat &&
      selectedSeat.seat_No === seatNo &&
      selectedSeat.row_Letter === rowLetter
    );
  };

  const getSeatClass = (seat) => {
    if (isBooked(seat.seat_No, seat.row_Letter)) return styles.seatBooked;
    if (isSelected(seat.seat_No, seat.row_Letter)) return styles.seatSelected;
    if (seat.seat_Type === 'VIP') return styles.seatVIP;
    if (seat.seat_Type === 'Premium') return styles.seatPremium;
    return styles.seatRegular;
  };

  const handleClick = (seat) => {
    if (isBooked(seat.seat_No, seat.row_Letter)) return;
    onSelectSeat({
      seat_No: seat.seat_No,
      row_Letter: seat.row_Letter,
      seat_Type: seat.seat_Type,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.screen}>
        <div className={styles.screenBar} />
        <span className={styles.screenLabel}>Screen</span>
      </div>

      <div className={styles.seatGrid}>
        {sortedRowKeys.map((rowKey) => (
          <div key={rowKey} className={styles.seatRow}>
            <span className={styles.rowLabel}>{rowKey}</span>
            {rows[rowKey].map((seat) => (
              <button
                key={`${seat.row_Letter}-${seat.seat_No}`}
                className={`${styles.seat} ${getSeatClass(seat)}`}
                onClick={() => handleClick(seat)}
                disabled={isBooked(seat.seat_No, seat.row_Letter)}
                title={`${seat.row_Letter}${seat.seat_No} (${seat.seat_Type})${
                  isBooked(seat.seat_No, seat.row_Letter) ? ' - Booked' : ''
                }`}
              >
                {seat.seat_No}
              </button>
            ))}
            <span className={styles.rowLabel}>{rowKey}</span>
          </div>
        ))}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSwatch} ${styles.swatchRegular}`} />
          Regular <span className={styles.priceLabel}>$50</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSwatch} ${styles.swatchPremium}`} />
          Premium <span className={styles.priceLabel}>$100</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSwatch} ${styles.swatchVIP}`} />
          VIP <span className={styles.priceLabel}>$150</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSwatch} ${styles.swatchSelected}`} />
          Selected
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendSwatch} ${styles.swatchBooked}`} />
          Booked
        </div>
      </div>
    </div>
  );
}
