import { useState, useEffect } from 'react';
import { specialistsApi, type Specialist } from '../api/specialists.js';
import { servicesApi, type Service } from '../api/services.js';
import { appointmentsApi, type Appointment } from '../api/appointments.js';
import { useAuth } from '../context/AuthContext.js';
import styles from './SpecialistDashboard.module.css';

export default function SpecialistDashboard() {
  useAuth();
  const [specialist, setSpecialist] = useState<Specialist | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newService, setNewService] = useState({ name: '', price: '', durationMinutes: '' });
  const [creating, setCreating] = useState(false);
  const [tab, setTab] = useState<'appointments' | 'services' | 'profile'>('appointments');
  const [profileForm, setProfileForm] = useState({ specialization: '', bio: '', avatarUrl: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const specRes = await specialistsApi.getMe();
      setSpecialist(specRes.data);
      setProfileForm({
        specialization: specRes.data.specialization,
        bio: specRes.data.bio ?? '',
        avatarUrl: specRes.data.avatarUrl ?? '',
      });
      const [svcRes, appRes] = await Promise.all([
        servicesApi.getBySpecialist(specRes.data.id),
        appointmentsApi.getMy(),
      ]);
      setServices(svcRes.data);
      setAppointments(appRes.data);
    } catch {}
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialist) return;
    setSavingProfile(true);
    try {
      await specialistsApi.update(specialist.id, profileForm);
      loadData();
      alert('Профиль обновлён');
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Ошибка');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await servicesApi.create({
        name: newService.name,
        price: Number(newService.price),
        durationMinutes: Number(newService.durationMinutes),
      });
      setNewService({ name: '', price: '', durationMinutes: '' });
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Ошибка');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm('Удалить услугу?')) return;
    try {
      await servicesApi.delete(id);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Ошибка');
    }
  };

  const handleStatusUpdate = async (id: number, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => {
    try {
      await appointmentsApi.updateStatus(id, status);
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.message ?? 'Ошибка');
    }
  };

  if (!specialist) return (
    <div className={styles.noProfile}>
      <h2>У вас нет профиля специалиста</h2>
      <p>Обратитесь к администратору для создания профиля</p>
    </div>
  );

  return (
    <div>
      <h1 className={styles.title}>Панель специалиста</h1>

      <div className={styles.tabs}>
        <button className={tab === 'appointments' ? styles.activeTab : styles.tab} onClick={() => setTab('appointments')}>
          Записи ({appointments.length})
        </button>
        <button className={tab === 'services' ? styles.activeTab : styles.tab} onClick={() => setTab('services')}>
          Услуги ({services.length})
        </button>
        <button className={tab === 'profile' ? styles.activeTab : styles.tab} onClick={() => setTab('profile')}>
          Мой профиль
        </button>
      </div>

      {tab === 'appointments' && (
        <div className={styles.list}>
          {appointments.length === 0
            ? <p className={styles.empty}>Записей нет</p>
            : appointments.map(a => (
              <div key={a.id} className={styles.card}>
                <div>
                  <p className={styles.date}>
                    {new Date(a.date).toLocaleDateString('ru-RU')} в {a.timeSlot}
                  </p>
                  <p className={styles.sub}>Клиент #{a.clientId} · Услуга #{a.serviceId}</p>
                </div>
                {a.status === 'PENDING' && (
                  <div className={styles.actions}>
                    <button onClick={() => handleStatusUpdate(a.id, 'CONFIRMED')} className={styles.confirmBtn}>
                      Подтвердить
                    </button>
                    <button onClick={() => handleStatusUpdate(a.id, 'CANCELLED')} className={styles.rejectBtn}>
                      Отклонить
                    </button>
                  </div>
                )}
                {a.status === 'CONFIRMED' && (
                  <div className={styles.actions}>
                    <button onClick={() => handleStatusUpdate(a.id, 'COMPLETED')} className={styles.completeBtn}>
                      Завершить
                    </button>
                    <button onClick={() => handleStatusUpdate(a.id, 'CANCELLED')} className={styles.rejectBtn}>
                      Отклонить
                    </button>
                  </div>
                )}
                {(a.status === 'CANCELLED' || a.status === 'COMPLETED') && (
                  <span className={styles.statusLabel}>{a.status}</span>
                )}
              </div>
            ))
          }
        </div>
      )}

      {tab === 'services' && (
        <div>
          <form onSubmit={handleCreateService} className={styles.serviceForm}>
            <input
              placeholder="Название услуги"
              value={newService.name}
              onChange={e => setNewService(p => ({ ...p, name: e.target.value }))}
              required
            />
            <input
              placeholder="Цена (₴)"
              type="number"
              value={newService.price}
              onChange={e => setNewService(p => ({ ...p, price: e.target.value }))}
              required
            />
            <input
              placeholder="Длительность (мин)"
              type="number"
              value={newService.durationMinutes}
              onChange={e => setNewService(p => ({ ...p, durationMinutes: e.target.value }))}
              required
            />
            <button type="submit" disabled={creating} className={styles.addBtn}>
              {creating ? '...' : '+ Добавить'}
            </button>
          </form>

          <div className={styles.list}>
            {services.map(s => (
              <div key={s.id} className={styles.card}>
                <div>
                  <strong>{s.name}</strong>
                  <p className={styles.sub}>{s.price} ₴ · {s.durationMinutes} мин</p>
                </div>
                <button onClick={() => handleDeleteService(s.id)} className={styles.rejectBtn}>
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === 'profile' && (
        <form onSubmit={handleSaveProfile} className={styles.profileForm}>
          <label>Специализация
            <input
              value={profileForm.specialization}
              onChange={e => setProfileForm(p => ({ ...p, specialization: e.target.value }))}
              required
            />
          </label>
          <label>О себе
            <textarea
              value={profileForm.bio}
              onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
              rows={4}
            />
          </label>
          <label>Ссылка на аватар
            <input
              value={profileForm.avatarUrl}
              onChange={e => setProfileForm(p => ({ ...p, avatarUrl: e.target.value }))}
              placeholder="https://..."
            />
          </label>
          <button type="submit" disabled={savingProfile} className={styles.addBtn}>
            {savingProfile ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>
      )}
    </div>
  );
}
