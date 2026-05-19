import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { specialistsApi, type Specialist } from '../api/specialists.js';
import styles from './HomePage.module.css';

export default function HomePage() {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await specialistsApi.getAll(specialization || undefined);
        setSpecialists(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [specialization]);

  return (
    <div>
      <div className={styles.hero}>
        <h1>Найди специалиста</h1>
        <p>Барберы, репетиторы, тренеры — запись онлайн</p>
        <input
          className={styles.search}
          placeholder="Фильтр по специализации..."
          value={specialization}
          onChange={e => setSpecialization(e.target.value)}
        />
      </div>

      {loading ? (
        <p className={styles.loading}>Загрузка...</p>
      ) : specialists.length === 0 ? (
        <p className={styles.empty}>Специалисты не найдены</p>
      ) : (
        <div className={styles.grid}>
          {specialists.map(s => (
            <Link to={`/specialists/${s.id}`} key={s.id} className={styles.card}>
              <div className={styles.avatar}>
                {s.avatarUrl
                  ? <img src={s.avatarUrl} alt={s.specialization} />
                  : <span>{s.specialization[0].toUpperCase()}</span>
                }
              </div>
              <div className={styles.info}>
                <h3>{s.specialization}</h3>
                {s.bio && <p>{s.bio}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
