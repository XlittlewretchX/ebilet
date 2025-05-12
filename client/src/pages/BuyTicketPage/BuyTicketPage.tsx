import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/app/store';
import { buyTicket, fetchUserTickets } from '@/features/AuthModal/model/authSlice';
import { eventAPI } from '@/shared/api/api';
import StepChooseSeat from '@/features/BuyTicket/ui/StepChooseSeat';
import StepUserData from '@/features/BuyTicket/ui/StepUserData';
import StepPayment from '@/features/BuyTicket/ui/StepPayment';
import StepSuccess from '@/features/BuyTicket/ui/StepSuccess';
import StepChooseCount from '@/features/BuyTicket/ui/StepChooseCount';
import Toast from '@/shared/ui/Toast';

const BuyTicketPage: React.FC = () => {
  const { eventId = '' } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userEmail = useSelector((state: RootState) => state.auth.user?.email || '');
  const [step, setStep] = useState(0);
  const [seat, setSeat] = useState<string[] | string | null>(null);
  const [userData, setUserData] = useState<{ name: string; phone: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<any>(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);
  const [count, setCount] = useState<number>(1);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    setEventLoading(true);
    eventAPI.getById(Number(eventId))
      .then(setEvent)
      .catch(() => setEventError('Ошибка загрузки события'))
      .finally(() => setEventLoading(false));
  }, [eventId]);

  const steps = [];
  const nextStep = () => {
    setError(null);
    setStep(step + 1);
  };

  if (eventLoading) return <div>Загрузка события...</div>;
  if (eventError || !event) return <div style={{color:'red'}}>{eventError || 'Событие не найдено'}</div>;

  // Показываем шаги в зависимости от типа рассадки
  if (event.seatingType === 'grid' || event.seatingType === 'circle') {
    steps.push(
      <StepChooseSeat
        key="choose-seat"
        eventId={eventId}
        seatingType={event.seatingType}
        onNext={(chosenSeats) => {
          setSeat(chosenSeats);
          nextStep();
        }}
      />
    );
  } else if (event.seatingType === 'none') {
    steps.push(
      <StepChooseCount
        key="choose-count"
        onNext={(selectedCount) => {
          setCount(selectedCount);
          setSeat(null);
          nextStep();
        }}
      />
    );
  }

  steps.push(
    <StepUserData
      key="user-data"
      initialEmail={userEmail}
      onNext={(data) => {
        setUserData(data);
        nextStep();
      }}
      onBack={() => setStep(step - 1)}
    />
  );
  steps.push(
    <StepPayment
      key="payment"
      eventTitle={event.title}
      amount={event.price * (event.seatingType === 'none' ? count : (Array.isArray(seat) ? seat.length : 1))}
      onPay={async () => {
        if (!userData) return;
        setLoading(true);
        setError(null);
        setToast(null);
        try {
          let seatToSend = seat;
          if (event.seatingType === 'none') {
            seatToSend = Array(count).fill(null); // массив из count билетов без мест
          }
          await dispatch(buyTicket({
            eventId: Number(eventId),
            seat: Array.isArray(seatToSend) && seatToSend.length === 1 ? seatToSend[0] : seatToSend,
            ...userData,
          }) as any);
          await dispatch(fetchUserTickets() as any);
          setToast({ message: 'Билеты успешно куплены!', type: 'success' });
          nextStep();
        } catch (e: any) {
          setError(e?.message || (e?.response?.data?.message) || 'Ошибка при покупке билета');
          setToast({ message: e?.message || (e?.response?.data?.message) || 'Ошибка при покупке билета', type: 'error' });
        } finally {
          setLoading(false);
        }
      }}
      loading={loading}
      onBack={() => setStep(step - 1)}
    />
  );
  steps.push(
    <StepSuccess
      key="success"
      eventTitle={event.title}
      places={Array.isArray(seat) ? seat : undefined}
      count={event.seatingType === 'none' ? count : (Array.isArray(seat) ? seat.length : 1)}
      onGoToTickets={() => navigate('/my-tickets')}
      onGoHome={() => navigate('/')}
    />
  );

  return (
    <div>
      <h1>Покупка билета</h1>
      {loading && <p>Покупка билета...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {steps[step]}
    </div>
  );
};

export default BuyTicketPage; 