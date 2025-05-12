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

interface FormData {
  count: number;
  seat: string[] | string | null;
  userData: { name: string; phone: string; email: string } | null;
}

const BuyTicketPage: React.FC = () => {
  const { eventId = '' } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userEmail = useSelector((state: RootState) => state.auth.user?.email || '');
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    count: 1,
    seat: null,
    userData: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<any>(null);
  const [eventLoading, setEventLoading] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);
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

  const prevStep = () => {
    setError(null);
    setStep(step - 1);
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
          setFormData(prev => ({ ...prev, seat: chosenSeats }));
          nextStep();
        }}
        onBack={step > 0 ? prevStep : undefined}
        initialSeats={formData.seat as string[] | null}
      />
    );
  } else if (event.seatingType === 'none') {
    steps.push(
      <StepChooseCount
        key="choose-count"
        onNext={(selectedCount) => {
          setFormData(prev => ({ ...prev, count: selectedCount, seat: null }));
          nextStep();
        }}
        onBack={step > 0 ? prevStep : undefined}
        initialCount={formData.count}
      />
    );
  }

  steps.push(
    <StepUserData
      key="user-data"
      initialEmail={userEmail}
      initialData={formData.userData}
      onNext={(data) => {
        setFormData(prev => ({ ...prev, userData: data }));
        nextStep();
      }}
      onBack={prevStep}
    />
  );

  steps.push(
    <StepPayment
      key="payment"
      eventTitle={event.title}
      amount={event.price * (event.seatingType === 'none' ? formData.count : (Array.isArray(formData.seat) ? formData.seat.length : 1))}
      onPay={async () => {
        if (!formData.userData) return;
        setLoading(true);
        setError(null);
        setToast(null);
        try {
          let seatToSend = formData.seat;
          if (event.seatingType === 'none') {
            seatToSend = Array(formData.count).fill(null); // массив из count билетов без мест
          }
          await dispatch(buyTicket({
            eventId: Number(eventId),
            seat: Array.isArray(seatToSend) && seatToSend.length === 1 ? seatToSend[0] : seatToSend,
            ...formData.userData,
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
      onBack={prevStep}
    />
  );

  steps.push(
    <StepSuccess
      key="success"
      eventTitle={event.title}
      places={Array.isArray(formData.seat) ? formData.seat : undefined}
      count={event.seatingType === 'none' ? formData.count : (Array.isArray(formData.seat) ? formData.seat.length : 1)}
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