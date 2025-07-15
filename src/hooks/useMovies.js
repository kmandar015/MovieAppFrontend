import { useQuery } from '@tanstack/react-query';
import { fetchMovies, searchMovies } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const useMovies = (page = 1) => {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['movies', page],
    queryFn: () => fetchMovies(token, page),
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSearchMovies = (query, page = 1) => {
  const { token } = useAuth();
  
  return useQuery({
    queryKey: ['searchMovies', query, page],
    queryFn: () => searchMovies(token, query, page),
    enabled: !!token && !!query,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};