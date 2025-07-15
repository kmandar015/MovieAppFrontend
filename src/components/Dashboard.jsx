import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { useMovies, useSearchMovies } from '../hooks/useMovies';
import MovieCard from './MovieCard';
import MovieCardSkeleton from './MovieCardSkeleton';

const MoviesDashboard = ({ searchQuery, setSearchQuery, sortBy, setSortBy, viewMode, setViewMode }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { 
    data: moviesData, 
    isLoading, 
    error,
    isFetching
  } = useMovies(currentPage);

  const { 
    data: searchResults, 
    isLoading: isSearching 
  } = useSearchMovies(searchQuery, currentPage);

  const displayData = searchQuery ? searchResults : moviesData;
  const isLoadingData = searchQuery ? isSearching : isLoading;

  const sortedMovies = useMemo(() => {
    if (!displayData?.results) return [];
    
    const movies = [...displayData.results];
    const [field, order] = sortBy.split('.');
    
    return movies.sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];
      
      if (field === 'release_date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [displayData, sortBy]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (displayData?.total_pages || 1)) {
      setCurrentPage(newPage);
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center"
      >
        <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">
          Failed to load movies
        </h2>
        <p className="text-red-700 dark:text-red-300 mb-4">
          {error.message || 'Something went wrong. Please check your API token and try again.'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {searchQuery ? 'Search Results' : 'Now Playing'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {searchQuery ? `Results for "${searchQuery}"` : 'Latest movies in theaters'}
          </p>
        </div>
        {displayData && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {displayData.total_pages} • {displayData.total_results} movies
          </div>
        )}
      </div>

      {isLoadingData ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {Array.from({ length: 8 }).map((_, index) => (
            <MovieCardSkeleton key={index} />
          ))}
        </div>
      ) : sortedMovies.length > 0 ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}
          >
            {sortedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} viewMode={viewMode} />
            ))}
          </motion.div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-4 mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </motion.button>

            <div className="flex items-center space-x-2">
              {[...Array(Math.min(5, displayData?.total_pages || 1))].map((_, index) => {
                const pageNumber = currentPage - 2 + index;
                if (pageNumber < 1 || pageNumber > (displayData?.total_pages || 1)) return null;
                
                return (
                  <motion.button
                    key={pageNumber}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      pageNumber === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNumber}
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === displayData?.total_pages}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </motion.button>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            <AlertCircle size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No movies found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? 'Try adjusting your search terms' : 'Unable to load movies at this time'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default MoviesDashboard;
