import { useState, useEffect } from 'react';
import { appointmentsApi, type Appointment } from '../api/appointments.js';
import ReviewForm from '../components/ReviewForm.js';
import styles from './AppointmentsPage.module.css';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Ожидает',
  CONFIRMED: 'Подтверждено',
  CANCELLED: 'Отменено',
  COMPLETED: 'Завершено',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#22c55e',
  CANCELLED: '#ef4444',
  COMPLETED: '#6366f1',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await appointmentsApi.getMy();
      setAppointments(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id: number) => {
    if (!confirm('Отменить запись?')) return;
    try {
      await appointmentsApi.cancel(id);
      load();
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Ошибка');
    }
  };

  if (loading) return <p className={styles.loading}>Загрузка...</p>;

  return (
    <div>
      <h1 className={styles.title}>Мои записи</h1>
      {appointments.length === 0 ? (
        <p className={styles.empty}>У вас нет записей</p>
      ) : (
        <div className={styles.list}>
          {appointments.map(a => (
            <div key={a.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div>
                  <p className={styles.date}>
                    {new Date(a.date).toLocaleDateString('ru-RU')} в {a.timeSlot}
                  </p>
                  <p className={styles.ids}>Услуга #{a.serviceId}</p>
                </div>
                <span
                  className={styles.status}
                  style={{ color: STATUS_COLORS[a.status] }}
                >
                  {STATUS_LABELS[a.status]}
                </span>
              </div>
              {(a.status === 'PENDING' || a.status === 'CONFIRMED') && (
                <button onClick={() => handleCancel(a.id)} className={styles.cancelBtn}>
                  Отменить
                </button>
              )}
              {a.status === 'COMPLETED' && (
                <ReviewForm appointmentId={a.id} specialistId={a.specialistId} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
