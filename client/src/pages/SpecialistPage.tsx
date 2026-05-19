import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { specialistsApi, type Specialist } from '../api/specialists.js';
import { servicesApi, type Service } from '../api/services.js';
import { reviewsApi, type Review } from '../api/reviews.js';
import { appointmentsApi } from '../api/appointments.js';
import { useAuth } from '../context/AuthContext.js';
import styles from './SpecialistPage.module.css';

export default function SpecialistPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState('');
  const [bookSuccess, setBookSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [specRes, svcRes, revRes] = await Promise.all([
        specialistsApi.getById(Number(id)),
        servicesApi.getBySpecialist(Number(id)),
        reviewsApi.getBySpecialist(Number(id)),
      ]);
      setSpecialist(specRes.data);
      setServices(svcRes.data);
      setReviews(revRes.data);
    };
    load();
  }, [id]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!selectedService || !date || !timeSlot) return;
    setBooking(true);
    setBookError('');
    try {
      await appointmentsApi.create({
        specialistId: Number(id),
        serviceId: selectedService,
        date,
        timeSlot,
      });
      setBookSuccess(true);
    } catch (err: any) {
      setBookError(err.response?.data?.message ?? 'Ошибка записи');
    } finally {
      setBooking(false);
    }
  };

  if (!specialist) return <p className={styles.loading}>Загрузка...</p>;

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            {specialist.avatarUrl
              ? <img src={specialist.avatarUrl} alt="" />
              : <span>{specialist.specialization[0].toUpperCase()}</span>
            }
          </div>
          <div>
            <h1>{specialist.specialization}</h1>
            {avgRating && <p className={styles.rating}>★ {avgRating} ({reviews.length} отзывов)</p>}
            {specialist.bio && <p className={styles.bio}>{specialist.bio}</p>}
          </div>
        </div>

        <h2 className={styles.sectionTitle}>Услуги</h2>
        <div className={styles.services}>
          {services.map(s => (
            <div key={s.id} className={styles.serviceCard}>
              <div>
                <strong>{s.name}</strong>
                {s.description && <p>{s.description}</p>}
              </div>
              <div className={styles.serviceRight}>
                <span className={styles.price}>{s.price} ₴</span>
                <span className={styles.duration}>{s.durationMinutes} мин</span>
              </div>
            </div>
          ))}
        </div>

        <h2 className={styles.sectionTitle}>Отзывы</h2>
        {reviews.length === 0
          ? <p className={styles.empty}>Отзывов пока нет</p>
          : reviews.map(r => (
            <div key={r.id} className={styles.review}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewAuthor}>{r.client.name}</span>
                <span className={styles.reviewRating}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
              </div>
              {r.comment && <p>{r.comment}</p>}
            </div>
          ))
        }
      </div>

      <div className={styles.sidebar}>
        <div className={styles.bookCard}>
          <h2>Записаться</h2>
          {bookSuccess ? (
            <p className={styles.success}>Запись создана! Ожидайте подтверждения.</p>
          ) : (
            <form onSubmit={handleBook} className={styles.bookForm}>
              {bookError && <p className={styles.error}>{bookError}</p>}
              <label>Услуга
                <select value={selectedService ?? ''} onChange={e => setSelectedService(Number(e.target.value))} required>
                  <option value="">Выберите услугу</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} — {s.price} ₴</option>
                  ))}
                </select>
              </label>
              <label>Дата
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
              </label>
              <label>Время
                <input type="time" value={timeSlot} onChange={e => setTimeSlot(e.target.value)} required />
              </label>
              <button type="submit" disabled={booking} className={styles.bookBtn}>
                {booking ? 'Загрузка...' : isAuthenticated ? 'Записаться' : 'Войдите чтобы записаться'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
