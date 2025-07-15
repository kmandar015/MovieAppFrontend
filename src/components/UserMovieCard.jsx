import React from "react";
import { motion } from "framer-motion";
import { Star, Clock, Calendar, MapPin } from "lucide-react";
import { getImageUrl } from "../services/api";
import { useBooking } from "../contexts/BookingContext";

const UserMovieCard = ({ movie }) => {
  const { setSelectedMovie, setBookingStep } = useBooking();

  const handleBookNow = () => {
    setSelectedMovie(movie);
    setBookingStep("showtimes");
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
    >
      <div className="relative">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/** Rating Badge */}
        <div className="absolute top-4 right-4 flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black/75 text-white backdrop-blur-sm">
          <Star size={12} className="mr-1 text-yellow-500 fill-current" />
          {movie.vote_average.toFixed(1)}
        </div>

        {/** Adult Content Badge */}
        {movie.adult && (
          <div className="absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
            18+
          </div>
        )}

        {/** Book Now Button Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookNow}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Book Now
          </motion.button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {movie.title}
        </h3>

        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <span className="flex items-center">
            <Calendar size={14} className="mr-1" />
            {new Date(movie.release_date).getFullYear()}
          </span>
          <span className="flex items-center">
            <Clock size={14} className="mr-1" />
            2h 30m
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-3">
          {truncateText(movie.overview, 120)}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <MapPin size={14} />
            <span>Multiple Theaters</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBookNow}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all text-sm"
          >
            Book Tickets
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserMovieCard;
