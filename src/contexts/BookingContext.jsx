import React, { createContext, useContext, useState } from "react";

const BookingContext = createContext(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

export const BookingProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowTime, setSelectedShowTime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingStep, setBookingStep] = useState("movies");

  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  const resetBooking = () => {
    setSelectedMovie(null);
    setSelectedShowTime(null);
    setSelectedSeats([]);
    setBookingStep("movies");
  };

  return (
    <BookingContext.Provider
      value={{
        selectedMovie,
        setSelectedMovie,
        selectedShowTime,
        setSelectedShowTime,
        selectedSeats,
        setSelectedSeats,
        bookingStep,
        setBookingStep,
        totalAmount,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

// Generate sample seat data
export const generateSeats = (movieId) => {
  const seats = [];
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const seatsPerRow = 12;

  rows.forEach((row, rowIndex) => {
    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      let type = "regular";
      let price = 150;

      if (rowIndex < 3) {
        type = "vip";
        price = 300;
      } else if (rowIndex < 6) {
        type = "premium";
        price = 200;
      }

      const random = Math.random();
      let status = "available";
      if (random < 0.2) {
        status = "booked";
      }

      seats.push({
        id: `${row}${seatNum}`,
        row,
        number: seatNum,
        type,
        status,
        price,
      });
    }
  });

  return seats;
};

// Generate sample showtimes
export const generateShowTimes = (movie) => {
  const times = ["10:00", "13:30", "17:00", "20:30"];
  const theaters = ["Theater A", "Theater B", "Theater C"];
  const dates = [
    new Date().toISOString().split("T")[0],
    new Date(Date.now() + 86400000).toISOString().split("T")[0],
    new Date(Date.now() + 172800000).toISOString().split("T")[0],
  ];

  const showTimes = [];

  dates.forEach((date) => {
    times.forEach((time) => {
      theaters.forEach((theater) => {
        showTimes.push({
          id: `${movie.id}-${date}-${time}-${theater}`,
          time,
          date,
          theater,
          movieId: movie.id,
          movieTitle: movie.title,
          moviePoster: movie.poster_path,
          seats: generateSeats(movie.id),
        });
      });
    });
  });

  return showTimes;
};
