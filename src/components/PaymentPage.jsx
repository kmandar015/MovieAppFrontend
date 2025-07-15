import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useBooking } from "../contexts/BookingContext";
import { usePayment } from "../contexts/PaymentContext";
import { getImageUrl } from "../services/api";

const PaymentPage = () => {
  const {
    selectedMovie,
    selectedShowTime,
    selectedSeats,
    totalAmount,
    setBookingStep,
    resetBooking,
  } = useBooking();
  const { addPayment } = usePayment();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  if (!selectedMovie || !selectedShowTime || selectedSeats.length === 0)
    return null;

  const handleBack = () => {
    setBookingStep("seats");
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    addPayment({
      movieId: selectedMovie.id,
      userId: "user123",
      amount: totalAmount,
      status: Math.random() > 0.1 ? "completed" : "failed",
      movieTitle: selectedMovie.title,
    });

    setPaymentComplete(true);
    setIsProcessing(false);

    setTimeout(() => {
      resetBooking();
    }, 3000);
  };

  if (paymentComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Booking Confirmed!
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your tickets have been booked successfully. You will receive a
            confirmation email shortly.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-4">
              <img
                src={getImageUrl(selectedMovie.poster_path)}
                alt={selectedMovie.title}
                className="w-16 h-24 object-cover rounded-lg"
              />
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {selectedMovie.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedShowTime.theater}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedShowTime.date} • {selectedShowTime.time}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Seats:{" "}
                  {selectedSeats.map((s) => `${s.row}${s.number}`).join(", ")}
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Redirecting to home page...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mr-4"
        >
          <ArrowLeft size={24} />
        </motion.button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Payment
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Payment Method
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  id="card"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <label
                  htmlFor="card"
                  className="flex items-center space-x-2 text-gray-900 dark:text-white"
                >
                  <CreditCard size={20} />
                  <span>Credit/Debit Card</span>
                </label>
              </div>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <Shield size={16} />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Your payment information is encrypted and secure
              </p>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-8"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h3>

            <div className="flex items-center space-x-3 mb-4">
              <img
                src={getImageUrl(selectedMovie.poster_path)}
                alt={selectedMovie.title}
                className="w-12 h-16 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                  {selectedMovie.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedShowTime.theater}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedShowTime.date} • {selectedShowTime.time}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Seats ({selectedSeats.length})
              </h4>
              <div className="space-y-2">
                {selectedSeats.map((seat) => (
                  <div key={seat.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {seat.row}
                      {seat.number} ({seat.type})
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ₹{seat.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Convenience Fee
                </span>
                <span className="text-gray-900 dark:text-white">₹25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">GST</span>
                <span className="text-gray-900 dark:text-white">
                  ₹{Math.round(totalAmount * 0.18)}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Total
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{totalAmount + 25 + Math.round(totalAmount * 0.18)}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <Clock size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard size={16} />
                  <span>Pay Now</span>
                </>
              )}
            </motion.button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
              By proceeding, you agree to our Terms & Conditions
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
