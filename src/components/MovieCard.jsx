import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Calendar, Play, Shield, DollarSign } from "lucide-react";
import { getImageUrl } from "../services/api";
import { usePayment } from "../contexts/PaymentContext";
import PublishModal from "./PublishModal";
import PaymentTracker from "./PaymentTracker";

const MovieCard = ({ movie, viewMode = "grid" }) => {
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const { addPayment } = usePayment();

  const handlePublish = async (publishData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsPublished(true);

    // Add sample payment data
    addPayment({
      movieId: movie.id,
      userId: "user123",
      amount: 12.99,
      status:
        Math.random() > 0.3
          ? "completed"
          : Math.random() > 0.5
          ? "pending"
          : "failed",
      movieTitle: movie.title,
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6"
      >
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="w-24 h-36 object-cover rounded-lg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {movie.title}
                  {movie.adult && (
                    <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      <Shield size={12} className="mr-1" />
                      18+
                    </span>
                  )}
                </h3>

                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {movie.release_date}
                  </span>
                  <span className="flex items-center">
                    <Star size={14} className="mr-1 text-yellow-500" />
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {truncateText(movie.overview, 150)}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPublishModal(true)}
                  className={`px-6 py-2 rounded-xl font-medium transition-all ${
                    isPublished
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                  }`}
                >
                  <Play size={16} className="inline mr-2" />
                  {isPublished ? "Published" : "Publish"}
                </motion.button>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <PaymentTracker movieId={movie.id} />
            </div>
          </div>
        </div>
        <PublishModal
          isOpen={showPublishModal}
          onClose={() => setShowPublishModal(false)}
          movie={movie}
          onPublish={handlePublish}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <div className="relative">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {movie.adult && (
          <div className="absolute top-4 left-4 flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <Shield size={12} className="mr-1" />
            18+
          </div>
        )}
        <div className="absolute top-4 right-4 flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black bg-opacity-75 text-white">
          <Star size={12} className="mr-1 text-yellow-500" />
          {movie.vote_average.toFixed(1)}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex items-center">
          <Calendar size={14} className="mr-1" />
          {movie.release_date}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          {truncateText(movie.overview, 100)}
        </p>

        <div className="space-y-4">
          <PaymentTracker movieId={movie.id} />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPublishModal(true)}
            className={`w-full px-4 py-3 rounded-xl font-medium transition-all ${
              isPublished
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
            }`}
          >
            <Play size={16} className="inline mr-2" />
            {isPublished ? "Published" : "Publish"}
          </motion.button>
        </div>
      </div>

      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        movie={movie}
        onPublish={handlePublish}
      />
    </motion.div>
  );
};

export default MovieCard;
