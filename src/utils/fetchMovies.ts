// src/utils/fetchMovies.ts

interface Movie {
  id: number;
  title: string;
  release_date: string;
  runtime: number | null;
  genres: { id: number; name: string }[];
  overview: string;
  poster_path: string;
  production_countries: { iso_3166_1: string; name: string }[];
  vote_average: number;
  vote_count: number;
  weightedRating?: number;
  credits?: {
    crew: { job: string; name: string }[];
    cast: { name: string }[];
  };
}

const allowedCountries = ["US", "CN", "FR", "DE", "JP", "GB", "KR", "IT"];
const C = 3000; // Constante utilisée pour le calcul de la note pondérée
const globalAverage = 6.5; // Moyenne globale à utiliser pour la pondération

// Fonction pour récupérer les détails d'un film, y compris les crédits
async function fetchMovieDetails(movieId: number, apiKey: string) {
  const detailsResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=fr-FR`
  );
  if (!detailsResponse.ok) throw new Error("Failed to fetch movie details.");
  const detailsData = await detailsResponse.json();

  const creditsResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=fr-FR`
  );
  if (!creditsResponse.ok) throw new Error("Failed to fetch movie credits.");
  const creditsData = await creditsResponse.json();

  return { ...detailsData, credits: creditsData };
}

// Fonction pour récupérer la liste des films
export async function fetchMovies(
  apiKey: string,
  currentPage: number,
  selectedYear: string = ""
) {
  let dateRange = "";

  // Si une année est sélectionnée, construire la plage de dates
  if (selectedYear) {
    const [startYear, endYear] = selectedYear.split("-");
    if (startYear && endYear) {
      dateRange = `&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${endYear}-12-31`;
    } else {
      throw new Error("Invalid date range.");
    }
  }

  console.log("Fetching movies from API with date range:", dateRange);

  // Requête pour récupérer les films en fonction de la page et de la plage de dates
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=fr-FR&include_adult=false&sort_by=vote_average.desc&vote_count.gte=3000&page=${currentPage}${dateRange}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movies.");
  }

  const data = await response.json();
  console.log("Movies fetched from API:", data);

  const totalPages = Math.min(data.total_pages, 500);

  // Récupérer les détails de chaque film
  const movieDetailsPromises = data.results.map((movie: Movie) =>
    fetchMovieDetails(movie.id, apiKey)
  );

  let movies = await Promise.all(movieDetailsPromises);

  // Filtrer les films en fonction de certains critères, comme les films d'animation et les pays autorisés
  movies = movies.filter((movie: Movie) => {
    const movieCountries = movie.production_countries.map(
      (country) => country.iso_3166_1
    );
    const isAllowedCountry = movieCountries.some((country) =>
      allowedCountries.includes(country)
    );
    const isAnimation = movie.genres.some(
      (genre) => genre.name === "Animation"
    );
    return isAllowedCountry && !isAnimation;
  });

  // Calculer la note pondérée pour chaque film
  movies = movies.map((movie) => ({
    ...movie,
    weightedRating:
      (movie.vote_count / (movie.vote_count + C)) * movie.vote_average +
      (C / (movie.vote_count + C)) * globalAverage,
  }));

  // Trier les films par note pondérée
  movies = movies.sort(
    (a, b) => (b.weightedRating ?? 0) - (a.weightedRating ?? 0)
  );

  // Retourner les films et le nombre total de pages
  return { movies, totalPages };
}
