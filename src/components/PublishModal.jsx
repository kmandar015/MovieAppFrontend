import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, MapPin, Check } from "lucide-react";
import { format } from "date-fns";

const PublishModal = ({ isOpen, onClose, movie, onPublish }) => {
  const [publishData, setPublishData] = useState({
    date: "",
    time: "",
    venue: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const venues = [
    { id: "theater-a", name: "Theater A", capacity: 150 },
    { id: "theater-b", name: "Theater B", capacity: 200 },
    { id: "theater-c", name: "Theater C", capacity: 100 },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!publishData.date || !publishData.time || !publishData.venue) return;

    setIsSubmitting(true);
    try {
      await onPublish({
        ...publishData,
        movieId: movie.id,
        movieTitle: movie.title,
      });
      onClose();
      setPublishData({ date: "", time: "", venue: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Publish Movie
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X size={20} />
                </motion.button>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {movie.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {movie.release_date}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar size={16} className="mr-2" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={publishData.date}
                    onChange={(e) =>
                      setPublishData({ ...publishData, date: e.target.value })
                    }
                    min={today}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock size={16} className="mr-2" />
                    Select Time
                  </label>
                  <input
                    type="time"
                    value={publishData.time}
                    onChange={(e) =>
                      setPublishData({ ...publishData, time: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin size={16} className="mr-2" />
                    Select Venue
                  </label>
                  <select
                    value={publishData.venue}
                    onChange={(e) =>
                      setPublishData({ ...publishData, venue: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Choose a venue</option>
                    {venues.map((venue) => (
                      <option key={venue.id} value={venue.id}>
                        {venue.name} (Capacity: {venue.capacity})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-4 pt-6">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={
                      !publishData.date ||
                      !publishData.time ||
                      !publishData.venue ||
                      isSubmitting
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
                  >
                    <Check size={16} />
                    <span>{isSubmitting ? "Publishing..." : "Publish"}</span>
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PublishModal;
