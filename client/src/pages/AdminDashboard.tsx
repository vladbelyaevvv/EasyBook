import { useState, useEffect } from 'react';
import { adminsApi, type AdminUser, type AdminSpecialist, type AdminService, type AdminAppointment, type AdminReview } from '../api/admin.js';
import { useAuth } from '../context/AuthContext.js';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';

type Tab = 'users' | 'specialists' | 'services' | 'appointments' | 'reviews';

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('users');

  useEffect(() => {
    if (user && user.role !== 'ADMIN') navigate('/');
  }, [user, navigate]);

  return (
    <div>
      <h1 className={styles.title}>Админ-панель</h1>
      <div className={styles.tabs}>
        <button className={tab === 'users' ? styles.activeTab : styles.tab} onClick={() => setTab('users')}>Пользователи</button>
        <button className={tab === 'specialists' ? styles.activeTab : styles.tab} onClick={() => setTab('specialists')}>Специалисты</button>
        <button className={tab === 'services' ? styles.activeTab : styles.tab} onClick={() => setTab('services')}>Услуги</button>
        <button className={tab === 'appointments' ? styles.activeTab : styles.tab} onClick={() => setTab('appointments')}>Записи</button>
        <button className={tab === 'reviews' ? styles.activeTab : styles.tab} onClick={() => setTab('reviews')}>Отзывы</button>
      </div>
      {tab === 'users' && <UsersTab />}
      {tab === 'specialists' && <SpecialistsTab />}
      {tab === 'services' && <ServicesTab />}
      {tab === 'appointments' && <AppointmentsTab />}
      {tab === 'reviews' && <ReviewsTab />}
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: '', phone: '' });
  const load = () => adminsApi.users.getAll().then(r => setUsers(r.data));

  useEffect(() => { load(); }, []);

  const startEdit = (u: AdminUser) => {
    setEditingId(u.id);
    setEditForm({ name: u.name, email: u.email, role: u.role, phone: u.phone ?? '' });
  };

  const save = async (id: number) => {
    try {
      await adminsApi.users.update(id, editForm);
      setEditingId(null);
      load();
    } catch (err: any) { alert(err.response?.data?.message ?? 'Ошибка'); }
  };

  const remove = async (id: number) => {
    if (!confirm('Удалить пользователя?')) return;
    try { await adminsApi.users.delete(id); load(); }
    catch (err: any) { alert(err.response?.data?.message ?? 'Ошибка'); }
  };

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead><tr><th>ID</th><th>Имя</th><th>Email</th><th>Роль</th><th>Телефон</th><th></th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              {editingId === u.id ? (
                <>
                  <td>{u.id}</td>
                  <td><input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} /></td>
                  <td><input value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} /></td>
                  <td>
                    <select value={editForm.role} onChange={e => setEditForm(p => ({ ...p, role: e.target.value }))}>
                      <option value="CLIENT">CLIENT</option>
                      <option value="SPECIALIST">SPECIALIST</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td><input value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))} /></td>
                  <td className={styles.actions}>
                    <button className={styles.saveBtn} onClick={() => save(u.id)}>Сохранить</button>
                    <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>Отмена</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{u.id}</td><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td>{u.phone ?? '—'}</td>
                  <td className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => startEdit(u)}>Ред.</button>
                    <button className={styles.deleteBtn} onClick={() => remove(u.id)}>Уд.</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SpecialistsTab() {
  const [list, setList] = useState<AdminSpecialist[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ specialization: '', bio: '', isVerified: false });
  const load = () => adminsApi.specialists.getAll().then(r => setList(r.data));

  useEffect(() => { load(); }, []);

  const startEdit = (s: AdminSpecialist) => {
    setEditingId(s.id);
    setEditForm({ specialization: s.specialization, bio: s.bio ?? '', isVerified: s.isVerified });
  };

  const save = async (id: number) => {
    try { await adminsApi.specialists.update(id, editForm); setEditingId(null); load(); }
    catch (err: any) { alert(err.response?.data?.message ?? 'Ошибка'); }
  };

  const remove = async (id: number) => {
    if (!confirm('Удалить специалиста?')) return;
    try { await adminsApi.specialists.delete(id); load(); }
    catch (err: any) { alert(err.response?.data?.message ?? 'Ошибка'); }
  };

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead><tr><th>ID</th><th>User ID</th><th>Специализация</th><th>Bio</th><th>Вериф.</th><th></th></tr></thead>
        <tbody>
          {list.map(s => (
            <tr key={s.id}>
              {editingId === s.id ? (
                <>
                  <td>{s.id}</td><td>{s.userId}</td>
                  <td><input value={editForm.specialization} onChange={e => setEditForm(p => ({ ...p, specialization: e.target.value }))} /></td>
                  <td><input value={editForm.bio} onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))} /></td>
                  <td><input type="checkbox" checked={editForm.isVerified} onChange={e => setEditForm(p => ({ ...p, isVerified: e.target.checked }))} /></td>
                  <td className={styles.actions}>
                    <button className={styles.saveBtn} onClick={() => save(s.id)}>Сохранить</button>
                    <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>Отмена</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{s.id}</td><td>{s.userId}</td><td>{s.specialization}</td><td>{s.bio ?? '—'}</td><td>{s.isVerified ? '✓' : '—'}</td>
                  <td className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => startEdit(s)}>Ред.</button>
                    <button className={styles.deleteBtn} onClick={() => remove(s.id)}>Уд.</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ServicesTab() {
  const [list, setList] = useState<AdminService[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', price: 0, durationMinutes: 0 });
  const load = () => adminsApi.services.getAll().then(r => setList(r.data));

  useEffect(() => { load(); }, []);

  const startEdit = (s: AdminService) => {
    setEditingId(s.id);
    setEditForm({ name: s.name, price: s.price, durationMinutes: s.durationMinutes });
  };

  const save = async (id: number) => {
    try { await adminsApi.services.update(id, editForm); setEditingId(null); load(); }
    catch (err: any) { alert(err.response?.data?.message ?? 'Ошибка'); }
  };

  const remove = async (id: number) => {
    if (!confirm('Удалить услугу?')) return;
    try { await adminsApi.services.delete(id); load(); }
    catch (err: any) { alert(err.response?.data?.message ?? 'Ошибка'); }
  };

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead><tr><th>ID</th><th>Specialist ID</th><th>Название</th><th>Цена</th><th>Длит.</th><th></th></tr></thead>
        <tbody>
          {list.map(s => (
            <tr key={s.id}>
              {editingId === s.id ? (
                <>
                  <td>{s.id}</td><td>{s.specialistId}</td>
                  <td><input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} /></td>
                  <td><input type="number" value={editForm.price} onChange={e => setEditForm(p => ({ ...p, price: Number(e.target.value) }))} /></td>
                  <td><input type="number" value={editForm.durationMinutes} onChange={e => setEditForm(p => ({ ...p, durationMinutes: Number(e.target.value) }))} /></td>
                  <td className={styles.actions}>
                    <button className={styles.saveBtn} onClick={() => save(s.id)}>Сохранить</button>
                    <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>Отмена</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{s.id}</td><td>{s.specialistId}</td><td>{s.name}</td><td>{s.price} ₴</td><td>{s.durationMinutes} мин</td>
                  <td className={styles.actions}>
                    <button className={styles.editBtn} onClick={() => startEdit(s)}>Ред.</button>
                    <button className={styles.deleteBtn} onClick={() => remove(s.id)}>Уд.</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AppointmentsTab() {
  const [list, setList] = useState<AdminAppointment[]>([]);
  const load = () => adminsApi.appointments.getAll().then(r => setList(r.data));

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: string) => {
    try { await adminsApi.appointments.update(id, { status }); load(); }
    catch (err: any) { alert(err.response?.data?.message ?? 'Ошибка'); }
  };

  const remove = async (id: number) => {
    if (!confirm('Удалить запись?')) return;
    try { await adminsApi.appointments.delete(id); load(); }
    catch (err: any) { alert(err.response?.data?.message ?? 'Ошибка'); }
  };

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead><tr><th>ID</th><th>Client ID</th><th>Specialist ID</th><th>Service ID</th><th>Дата</th><th>Время</th><th>Статус</th><th></th></tr></thead>
        <tbody>
          {list.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td><td>{a.clientId}</td><td>{a.specialistId}</td><td>{a.serviceId}</td>
              <td>{new Date(a.date).toLocaleDateString('ru-RU')}</td><td>{a.timeSlot}</td>
              <td>
                <select value={a.status} onChange={e => updateStatus(a.id, e.target.value)}>
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </td>
              <td className={styles.actions}>
                <button className={styles.deleteBtn} onClick={() => remove(a.id)}>Уд.</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReviewsTab() {
  const [list, setList] = useState<AdminReview[]>([]);
  const load = () => adminsApi.reviews.getAll().then(r => setList(r.data));

  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm('Удалить отзыв?')) return;
    try { await adminsApi.reviews.delete(id); load(); }
    catch (err: any) { alert(err.response?.data?.message ?? 'Ошибка'); }
  };

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead><tr><th>ID</th><th>Client ID</th><th>Specialist ID</th><th>Рейтинг</th><th>Комментарий</th><th></th></tr></thead>
        <tbody>
          {list.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.clientId}</td><td>{r.specialistId}</td><td>{r.rating}</td><td>{r.comment ?? '—'}</td>
              <td className={styles.actions}>
                <button className={styles.deleteBtn} onClick={() => remove(r.id)}>Уд.</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
