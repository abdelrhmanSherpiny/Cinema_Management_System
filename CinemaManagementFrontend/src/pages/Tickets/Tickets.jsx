import { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import styles from '../shared/PageStyles.module.css';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showtimes, setShowtimes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [halls, setHalls] = useState([]);
  const [seats, setSeats] = useState([]);

  const [showNo, setShowNo] = useState('');
  const [hallNo, setHallNo] = useState('');
  const [seatId, setSeatId] = useState('');
  const [customerId, setCustomerId] = useState('');

  useEffect(() => {
    fetchTickets();
    fetchShowtimes();
    fetchCustomers();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets');
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchShowtimes = async () => {
    try {
      const res = await api.get('/showtimes');
      setShowtimes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
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

  // When a showtime is selected, set the hall and fetch its seats
  const handleShowtimeChange = async (val) => {
    setShowNo(val);
    setSeatId('');
    setSeats([]);
    setHallNo('');
    if (!val) return;
    const st = showtimes.find((s) => s.show_No === parseInt(val));
    if (st?.hall?.hall_No) {
      setHallNo(st.hall.hall_No);
      try {
        const [seatsRes, bookedRes] = await Promise.all([
          api.get(`/halls/${st.hall.hall_No}/seats`),
          api.get(`/halls/${st.hall.hall_No}/seats/booked?showNo=${val}`),
        ]);
        const booked = bookedRes.data || [];
        const available = (seatsRes.data || []).filter(
          (s) => !booked.some((b) => b.seat_No === s.seat_No && b.row_Letter === s.row_Letter)
        );
        setSeats(available);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await api.delete(`/tickets/${id}`);
        fetchTickets();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!seatId) return;
    const seat = seats.find((s) => `${s.row_Letter}-${s.seat_No}` === seatId);
    if (!seat) return;
    try {
      await api.post('/tickets', {
        show_No: parseInt(showNo),
        seat_No: seat.seat_No,
        row_Letter: seat.row_Letter,
        customer_ID: parseInt(customerId),
      });
      setIsModalOpen(false);
      setShowNo('');
      setHallNo('');
      setSeatId('');
      setCustomerId('');
      setSeats([]);
      fetchTickets();
    } catch (err) {
      console.error(err);
      alert('Error adding ticket. Ensure seat exists and is available.');
    }
  };

  // Find customer name for display
  const getCustomerName = (id) => {
    const c = customers.find((c) => c.customer_ID === id);
    return c ? `${c.first_Name} ${c.last_Name}` : `#${id}`;
  };

  // Find showtime info for display
  const getShowInfo = (sNo) => {
    const st = showtimes.find((s) => s.show_No === sNo);
    if (!st) return `#${sNo}`;
    return `${st.movie?.title || ''} — ${formatTime(st.start_Time)}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Ticket size={28} className={styles.titleIcon} />
          Tickets
        </h1>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Book Ticket
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Movie / Show</th>
              <th>Customer</th>
              <th>Hall</th>
              <th>Seat</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.ticket_ID}>
                <td>{t.ticket_ID}</td>
                <td>{getShowInfo(t.show_No)}</td>
                <td>{getCustomerName(t.customer_ID)}</td>
                <td><span className={styles.badge}>Hall {t.hall_No}</span></td>
                <td>{t.row_Letter}{t.seat_No}</td>
                <td>${t.price}</td>
                <td>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(t.ticket_ID)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.overlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
            <h2 className={styles.modalTitle}>Book New Ticket</h2>
            <form className={styles.form} onSubmit={handleAdd}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Customer</label>
                <select required className={styles.input} value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.customer_ID} value={c.customer_ID}>{c.first_Name} {c.last_Name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Show Time</label>
                <select required className={styles.input} value={showNo} onChange={(e) => handleShowtimeChange(e.target.value)}>
                  <option value="">Select Show</option>
                  {showtimes.map((st) => (
                    <option key={st.show_No} value={st.show_No}>
                      {st.movie?.title} — {formatTime(st.start_Time)} — {new Date(st.date).toLocaleDateString()} — Hall {st.hall?.hall_No}
                    </option>
                  ))}
                </select>
              </div>

              {hallNo && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Hall</label>
                  <div className={styles.input} style={{ cursor: 'default', opacity: 0.8 }}>
                    Hall {hallNo}
                  </div>
                </div>
              )}

              {seats.length > 0 && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>Available Seat</label>
                  <select required className={styles.input} value={seatId} onChange={(e) => setSeatId(e.target.value)}>
                    <option value="">Select Seat</option>
                    {seats.map((s) => (
                      <option key={`${s.row_Letter}-${s.seat_No}`} value={`${s.row_Letter}-${s.seat_No}`}>
                        Row {s.row_Letter} — Seat {s.seat_No} ({s.seat_Type})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button type="submit" className={styles.submitBtn} disabled={!seatId}>Book Ticket</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
