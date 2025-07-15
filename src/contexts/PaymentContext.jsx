import React, { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [payments, setPayments] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState('all');

  const addPayment = (payment) => {
    const newPayment = {
      id: Date.now(),
      ...payment,
      timestamp: new Date().toISOString(),
    };
    setPayments(prev => [...prev, newPayment]);
  };

  const getPaymentsByMovie = (movieId) => {
    return payments.filter(payment => payment.movieId === movieId);
  };

  const getPaymentsByUser = (userId) => {
    return payments.filter(payment => payment.userId === userId);
  };

  const filteredPayments = payments.filter(payment => {
    if (paymentFilter === 'all') return true;
    return payment.status === paymentFilter;
  });

  return (
    <PaymentContext.Provider value={{
      payments: filteredPayments,
      addPayment,
      getPaymentsByMovie,
      getPaymentsByUser,
      paymentFilter,
      setPaymentFilter
    }}>
      {children}
    </PaymentContext.Provider>
  );
};