import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, MapPin, Users } from "lucide-react";
import { useBooking, generateShowTimes } from "../contexts/BookingContext";
import { getImageUrl } from "../services/api";
import { format } from "date-fns";

const ShowTimeSelection = () => {
  const { selectedMovie, setSelectedShowTime, setBookingStep } = useBooking();

  if (!selectedMovie) return null;

  const showTimes = generateShowTimes(selectedMovie);

  const groupedShowTimes = showTimes.reduce((acc, showTime) => {
    const key = `${showTime.date}-${showTime.theater}`;
    if (!acc[key]) {
      acc[key] = {
        date: showTime.date,
        theater: showTime.theater,
        times: [],
      };
    }
    acc[key].times.push(showTime);
    return acc;
  }, {});

  const handleShowTimeSelect = (showTime) => {
    setSelectedShowTime(showTime);
    setBookingStep("seats");
  };

  const handleBack = () => {
    setBookingStep("movies");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
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
          Select Show Time
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8"
      >
        <div className="flex items-center space-x-6">
          <img
            src={getImageUrl(selectedMovie.poster_path)}
            alt={selectedMovie.title}
            className="w-24 h-36 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedMovie.title}
            </h2>
            <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 mb-3">
              <span className="flex items-center">
                <Calendar size={16} className="mr-1" />
                {new Date(selectedMovie.release_date).getFullYear()}
              </span>
              <span className="flex items-center">
                <Clock size={16} className="mr-1" />
                2h 30m
              </span>
              <span className="flex items-center">
                <Users size={16} className="mr-1" />
                {selectedMovie.adult ? "18+" : "U/A"}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
              {selectedMovie.overview}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {Object.values(groupedShowTimes).map((group, index) => (
          <motion.div
            key={`${group.date}-${group.theater}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-900 dark:text-white">
                  <Calendar size={20} className="mr-2" />
                  <span className="font-semibold">
                    {format(new Date(group.date), "EEEE, MMM d")}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin size={16} className="mr-1" />
                  <span>{group.theater}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {group.times.map((showTime) => (
                <motion.button
                  key={showTime.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleShowTimeSelect(showTime)}
                  className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {showTime.time}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Available
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ShowTimeSelection;
