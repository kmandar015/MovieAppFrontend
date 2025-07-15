import { useAuth } from "../contexts/AuthContext";

const BASE_URL = "https://api.themoviedb.org/3";

export const fetchMovies = async (token, page = 1) => {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  const response = await fetch(`${BASE_URL}/movie/now_playing?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch movies");
  }

  return response.json();
};

export const searchMovies = async (token, query, page = 1) => {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  const response = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${page}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to search movies");
  }

  return response.json();
};

export const getImageUrl = (path, size = "w500") => {
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
