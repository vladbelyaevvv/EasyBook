import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { specialistsApi } from '../api/specialists.js';
import styles from './AuthPage.module.css';
import { useAuth } from '../context/AuthContext.js';

export default function BecomeSpecialistPage() {
  const [form, setForm] = useState({ specialization: '', bio: '', avatarUrl: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, login, token } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await specialistsApi.create(form);
      login(token!, { ...user!, role: 'SPECIALIST' });
      navigate('/specialist/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Стать специалистом</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Специализация
            <input name="specialization" placeholder="Барбер, репетитор, тренер..." value={form.specialization} onChange={handleChange} required />
          </label>
          <label>О себе
            <input name="bio" placeholder="Расскажите о себе..." value={form.bio} onChange={handleChange} />
          </label>
          <label>Ссылка на аватар
            <input name="avatarUrl" placeholder="https://..." value={form.avatarUrl} onChange={handleChange} />
          </label>
          <button type="submit" disabled={loading} className={styles.btn}>
            {loading ? 'Загрузка...' : 'Создать профиль'}
          </button>
        </form>
      </div>
    </div>
  );
}
