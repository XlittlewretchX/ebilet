import React from 'react';
import styles from './StepChooseSeat.module.scss';
import { useChooseSeat, MAX_SELECT } from '../model/useChooseSeat';

interface StepChooseSeatProps {
  eventId: string;
  onNext: (seat: string[] | null) => void;
  onBack?: () => void;
  seatingType?: 'grid' | 'circle';
  initialSeats?: string[] | null;
}

const SECTOR_GAP = 6; // зазор между секторами в градусах
const SECTORS = [
  { name: 'A', color: '#ffe066', startAngle: 225 + SECTOR_GAP/2, endAngle: 315 - SECTOR_GAP/2 }, // низ
  { name: 'B', color: '#5eb3fa', startAngle: 135 + SECTOR_GAP/2, endAngle: 225 - SECTOR_GAP/2 }, // лево
  { name: 'C', color: '#f7a6c7', startAngle: 45 + SECTOR_GAP/2, endAngle: 135 - SECTOR_GAP/2 },  // верх
  { name: 'D', color: '#8fd18f', startAngle: -45 + SECTOR_GAP/2, endAngle: 45 - SECTOR_GAP/2 },  // право
];
const ROWS = 5;
const SEATS_PER_ROW = 7;
const SEAT_SIZE = 18;
const RADIUS_STEP = 32;

const StepChooseSeat: React.FC<StepChooseSeatProps> = ({ eventId, onNext, onBack, seatingType = 'grid', initialSeats = null }) => {
  const { bookedSeats, selectedSeats, setSelectedSeats, loading, error, handleSelect } = useChooseSeat(eventId);

  // Устанавливаем начальные значения при монтировании
  React.useEffect(() => {
    if (initialSeats) {
      setSelectedSeats(initialSeats);
    }
  }, []);

  const handleNext = () => {
    if (selectedSeats.length > 0) onNext(selectedSeats);
  };

  if (loading) return <div>Загрузка схемы зала...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;

  return (
    <div>
      <h2>Выбор мест</h2>
      {/* Легенда */}
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.legendBoxFree} /> свободно
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendBoxSelected} /> выбрано
        </span>
        <span className={styles.legendItem}>
          <span className={styles.legendBoxBooked} /> занято
        </span>
      </div>
      {seatingType === 'grid' && (
        <>
          <div className={styles.sceneLabel}>Сцена</div>
          <div className={styles.grid}>
            {Array.from({ length: 5 }).map((_, rowIdx) => (
              <div key={rowIdx} className={styles.gridRow}>
                {Array.from({ length: 8 }).map((_, seatIdx) => {
                  const seat = `${String.fromCharCode(65+rowIdx)}${seatIdx+1}`;
                  const isBooked = bookedSeats.includes(seat);
                  const isSelected = selectedSeats.includes(seat);
                  return (
                    <button
                      key={seat}
                      disabled={isBooked}
                      className={[
                        styles.seatButton,
                        isSelected ? styles.selected : '',
                        isBooked ? styles.booked : '',
                      ].join(' ')}
                      onClick={() => handleSelect(seat)}
                      title={isBooked ? 'Место занято' : `Место ${seat}`}
                      aria-label={`Место ${seat}${isBooked ? ' (занято)' : isSelected ? ' (выбрано)' : ''}`}
                    >
                      {seat}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </>
      )}
      {seatingType === 'circle' && (
        <div className={styles.circleWrapper}>
          <svg width={600} height={600} viewBox="0 0 600 600" style={{background:'#f8fafd', borderRadius: '8px', boxShadow:'0 2px 16px #2563eb11'}}>
            {/* Поле в центре */}
            <rect x={200} y={220} width={200} height={160} rx={30} fill="#bfe6ff" stroke="#222" strokeWidth={2}/>
            <rect x={200} y={220} width={200} height={160} rx={30} fill="none" stroke="#222" strokeWidth={2}/>
            <text x={300} y={305} textAnchor="middle" fill="#222" fontSize={32} fontWeight={700}>Поле</text>
            {/* Сектора */}
            {SECTORS.map((sector, sectorIdx) => {
              const sectorAngle = sector.endAngle - sector.startAngle;
              let seatNum = 1;
              return (
                <g key={sector.name}>
                  {/* Подпись сектора */}
                  <text
                    x={300 + 220 * Math.cos(((sector.startAngle + sector.endAngle)/2) * Math.PI/180)}
                    y={300 + 220 * Math.sin(((sector.startAngle + sector.endAngle)/2) * Math.PI/180)}
                    textAnchor="middle"
                    fontSize={28}
                    fontWeight={700}
                    fill={sector.color}
                    opacity={0.7}
                  >{sector.name}</text>
                  {/* Ряды и места */}
                  {Array.from({ length: ROWS }).map((_, rowIdx) => {
                    const radius = 140 + rowIdx * RADIUS_STEP;
                    return Array.from({ length: SEATS_PER_ROW }).map((_, seatIdx) => {
                      const angle = sector.startAngle + (sectorAngle / (SEATS_PER_ROW-1)) * seatIdx;
                      const rad = angle * Math.PI / 180;
                      const x = 300 + radius * Math.cos(rad);
                      const y = 300 + radius * Math.sin(rad);
                      const seat = `${sector.name}${seatNum++}`;
                      const isBooked = bookedSeats.includes(seat);
                      const isSelected = selectedSeats.includes(seat);
                      return (
                        <g key={seat} style={{cursor: isBooked ? 'not-allowed' : 'pointer'}} onClick={() => handleSelect(seat)}>
                          <rect
                            x={x-SEAT_SIZE/2}
                            y={y-SEAT_SIZE/2}
                            width={SEAT_SIZE}
                            height={SEAT_SIZE}
                            rx={4}
                            fill={isBooked ? '#ccc' : isSelected ? '#2563eb' : sector.color}
                            stroke={isSelected ? '#2563eb' : '#bbb'}
                            strokeWidth={isSelected ? 2 : 1}
                            style={{filter: isSelected ? 'drop-shadow(0 0 8px #2563eb55)' : undefined, transition:'all 0.15s'}}
                          />
                          <text
                            x={x}
                            y={y+4}
                            textAnchor="middle"
                            fontSize={10}
                            fontWeight={isSelected ? 700 : 400}
                            fill={isBooked ? '#888' : isSelected ? '#fff' : '#222'}
                            pointerEvents="none"
                          >{seat}</text>
                        </g>
                      );
                    });
                  })}
                </g>
              );
            })}
          </svg>
        </div>
      )}
      <div style={{marginTop:20, display:'flex', gap:8}}>
        {onBack && (
          <button onClick={onBack} className={styles.prevButton}>Назад</button>
        )}
        <button onClick={handleNext} disabled={selectedSeats.length === 0} className={styles.nextButton}>Далее</button>
      </div>
      {selectedSeats.length > 0 && <div className={styles.selectedInfo}>Вы выбрали места: <b>{selectedSeats.join(', ')}</b></div>}
      {selectedSeats.length === MAX_SELECT && <div className={styles.maxInfo}>Максимум {MAX_SELECT} мест за одну покупку</div>}
    </div>
  );
};

export default StepChooseSeat; 