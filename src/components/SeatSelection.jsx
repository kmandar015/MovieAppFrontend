import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Monitor, CreditCard } from "lucide-react";
import { useBooking } from "../contexts/BookingContext";
import { getImageUrl } from "../services/api";

const SeatSelection = () => {
  const {
    selectedMovie,
    selectedShowTime,
    selectedSeats,
    setSelectedSeats,
    setBookingStep,
  } = useBooking();

  if (!selectedMovie || !selectedShowTime) return null;

  const handleSeatClick = (seat) => {
    if (seat.status === "booked") return;

    const isSelected = selectedSeats.find((s) => s.id === seat.id);

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length < 10) {
        setSelectedSeats([...selectedSeats, { ...seat, status: "selected" }]);
      }
    }
  };

  const handleBack = () => {
    setBookingStep("showtimes");
  };

  const handleProceedToPayment = () => {
    setBookingStep("payment");
  };

  const getSeatColor = (seat) => {
    const isSelected = selectedSeats.find((s) => s.id === seat.id);

    if (seat.status === "booked") {
      return "bg-red-500 cursor-not-allowed";
    }
    if (isSelected) {
      return "bg-green-500 hover:bg-green-600";
    }

    switch (seat.type) {
      case "vip":
        return "bg-purple-500 hover:bg-purple-600";
      case "premium":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-gray-400 hover:bg-gray-500";
    }
  };

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const seatsByRow = selectedShowTime.seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = [];
    }
    acc[seat.row].push(seat);
    return acc;
  }, {});

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBack}
            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 mr-4"
          >
            <ArrowLeft size={24} />
          </motion.button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Select Seats
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {selectedMovie.title} • {selectedShowTime.date} •{" "}
              {selectedShowTime.time} • {selectedShowTime.theater}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Monitor size={20} />
                  <span className="font-medium">SCREEN</span>
                </div>
              </div>
              <div className="h-2 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent rounded-full mb-8"></div>
            </div>

            <div className="space-y-3">
              {Object.entries(seatsByRow).map(([row, seats]) => (
                <div
                  key={row}
                  className="flex items-center justify-center space-x-2"
                >
                  <div className="w-8 text-center font-medium text-gray-600 dark:text-gray-400">
                    {row}
                  </div>
                  <div className="flex space-x-1">
                    {seats.slice(0, 6).map((seat) => (
                      <motion.button
                        key={seat.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSeatClick(seat)}
                        className={`w-8 h-8 rounded-lg text-white text-xs font-medium transition-all ${getSeatColor(
                          seat
                        )}`}
                        disabled={seat.status === "booked"}
                      >
                        {seat.number}
                      </motion.button>
                    ))}
                  </div>
                  <div className="w-8"></div>
                  <div className="flex space-x-1">
                    {seats.slice(6).map((seat) => (
                      <motion.button
                        key={seat.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSeatClick(seat)}
                        className={`w-8 h-8 rounded-lg text-white text-xs font-medium transition-all ${getSeatColor(
                          seat
                        )}`}
                        disabled={seat.status === "booked"}
                      >
                        {seat.number}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-400 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Regular ₹150
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Premium ₹200
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    VIP ₹300
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Selected
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    Booked
                  </span>
                </div>
              </div>
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
              Booking Summary
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

            {selectedSeats.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Selected Seats ({selectedSeats.length})
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
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  Total
                </span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleProceedToPayment}
              disabled={selectedSeats.length === 0}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
            >
              <CreditCard size={16} />
              <span>Proceed to Payment</span>
            </motion.button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
              You can select up to 10 seats
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
