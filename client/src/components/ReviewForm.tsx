import { useState } from 'react';
import { reviewsApi } from '../api/reviews.js';
import styles from './ReviewForm.module.css';

interface Props {
  appointmentId: number;
  specialistId: number;
}

export default function ReviewForm({ appointmentId, specialistId }: Props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reviewsApi.create({ appointmentId, specialistId, rating, comment });
      setDone(true);
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  if (done) return <span className={styles.done}>Отзыв оставлен ✓</span>;

  return (
    <div>
      {!open ? (
        <button onClick={() => setOpen(true)} className={styles.openBtn}>
          Оставить отзыв
        </button>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.stars}>
            {[1,2,3,4,5].map(n => (
              <button key={n} type="button"
                className={n <= rating ? styles.starOn : styles.starOff}
                onClick={() => setRating(n)}
              >★</button>
            ))}
          </div>
          <input
            placeholder="Комментарий (необязательно)"
            value={comment}
            onChange={e => setComment(e.target.value)}
            className={styles.input}
          />
          <div className={styles.actions}>
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? '...' : 'Отправить'}
            </button>
            <button type="button" onClick={() => setOpen(false)} className={styles.cancelBtn}>
              Отмена
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
