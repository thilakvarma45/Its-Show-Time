// TMDB API Service
// Documentation: https://developer.themoviedb.org/docs/getting-started

const TMDB_API_KEY = '059ba08539dec5723646e27a30fbab9d';
const TMDB_ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNTliYTA4NTM5ZGVjNTcyMzY0NmUyN2EzMGZiYWI5ZCIsIm5iZiI6MTc0NzYzMzExOC42Mywic3ViIjoiNjgyYWMzZGVkZDRmYTRkYzdmMmY3NGIwIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.PurQdndiONhAqxq5F0twH68WYHK8HlnuxURgou3Cfgw';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_IMAGE_BASE_URL_ORIGINAL = 'https://image.tmdb.org/t/p/original';
const TMDB_IMAGE_BASE_URL_BACKDROP = 'https://image.tmdb.org/t/p/w1280';

// Genre mapping from TMDB genre IDs to names
const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

/**
 * Transform TMDB movie data to match our app's movie structure
 */
const transformMovie = (tmdbMovie) => {
  // Convert runtime from minutes to "Xh Ym" format
  const formatDuration = (runtime) => {
    if (!runtime) return 'N/A';
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  // Convert rating from 0-10 scale to 0-5 scale
  const convertRating = (voteAverage) => {
    if (!voteAverage) return 0;
    return (voteAverage / 2).toFixed(1);
  };

  // Map genre IDs to genre names (handles both genre_ids array and genres objects)
  const getGenres = (genreIds, genres) => {
    // If genres array with objects is provided (from full details)
    if (genres && Array.isArray(genres) && genres.length > 0 && typeof genres[0] === 'object') {
      return genres.map(g => g.name).slice(0, 3);
    }
    // If genre_ids array is provided (from search/popular)
    if (genreIds && Array.isArray(genreIds)) {
      return genreIds
        .map(id => GENRE_MAP[id])
        .filter(Boolean)
        .slice(0, 3);
    }
    return ['Unknown'];
  };

  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    genre: getGenres(tmdbMovie.genre_ids, tmdbMovie.genres),
    rating: parseFloat(convertRating(tmdbMovie.vote_average)),
    duration: formatDuration(tmdbMovie.runtime || tmdbMovie.runtime_minutes),
    poster: tmdbMovie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${tmdbMovie.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Poster',
    posterOriginal: tmdbMovie.poster_path ? `${TMDB_IMAGE_BASE_URL_ORIGINAL}${tmdbMovie.poster_path}` : null,
    // High-res backdrop for banners/hero sections
    backdrop: tmdbMovie.backdrop_path ? `${TMDB_IMAGE_BASE_URL_BACKDROP}${tmdbMovie.backdrop_path}` : null,
    // Additional TMDB data that might be useful
    overview: tmdbMovie.overview,
    releaseDate: tmdbMovie.release_date,
    originalTitle: tmdbMovie.original_title,
    popularity: tmdbMovie.popularity,
    voteCount: tmdbMovie.vote_count
  };
};

/**
 * Fetch popular movies from TMDB
 */
export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    // Fetch detailed info for each movie to get runtime
    const moviesWithDetails = await Promise.all(
      data.results.map(async (movie) => {
        try {
          const detailResponse = await fetch(
            `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}`,
            {
              headers: {
                'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
              }
            }
          );
          const details = await detailResponse.json();
          return { ...movie, runtime: details.runtime };
        } catch (error) {
          console.warn(`Failed to fetch details for movie ${movie.id}:`, error);
          return movie;
        }
      })
    );

    return {
      movies: moviesWithDetails.map(transformMovie),
      totalPages: data.total_pages,
      totalResults: data.total_results
    };
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

/**
 * Search movies using TMDB API
 */
export const searchMovies = async (query, page = 1) => {
  try {
    if (!query || query.trim() === '') {
      return { movies: [], totalPages: 0, totalResults: 0 };
    }

    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    // Fetch detailed info for each movie to get runtime
    const moviesWithDetails = await Promise.all(
      data.results.map(async (movie) => {
        try {
          const detailResponse = await fetch(
            `${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}`,
            {
              headers: {
                'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
              }
            }
          );
          const details = await detailResponse.json();
          return { ...movie, runtime: details.runtime };
        } catch (error) {
          console.warn(`Failed to fetch details for movie ${movie.id}:`, error);
          return movie;
        }
      })
    );

    return {
      movies: moviesWithDetails.map(transformMovie),
      totalPages: data.total_pages,
      totalResults: data.total_results
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};


/**
 * Get movie details by ID with full information
 */
export const getMovieById = async (movieId) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,images`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform genres from full genre objects
    const genres = data.genres ? data.genres.map(g => g.name) : [];

    const baseMovie = transformMovie(data);

    return {
      ...baseMovie,
      // Override genre with full genre list
      genre: genres,
      // Full details
      backdrop: data.backdrop_path ? `${TMDB_IMAGE_BASE_URL_BACKDROP}${data.backdrop_path}` : null,
      tagline: data.tagline,
      budget: data.budget,
      revenue: data.revenue,
      status: data.status,
      // Cast and crew
      cast: data.credits?.cast?.slice(0, 10).map(actor => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profilePath: actor.profile_path ? `${TMDB_IMAGE_BASE_URL}${actor.profile_path}` : null,
        order: actor.order
      })) || [],
      crew: data.credits?.crew?.filter(person =>
        ['Director', 'Producer', 'Screenplay', 'Writer'].includes(person.job)
      ).slice(0, 5).map(person => ({
        id: person.id,
        name: person.name,
        job: person.job,
        profilePath: person.profile_path ? `${TMDB_IMAGE_BASE_URL}${person.profile_path}` : null
      })) || [],
      // Images
      images: data.images?.backdrops?.slice(0, 8).map(img => ({
        path: `${TMDB_IMAGE_BASE_URL_BACKDROP}${img.file_path}`,
        aspectRatio: img.aspect_ratio
      })) || [],
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

/**
 * Get movie recommendations based on a movie ID
 */
export const getMovieRecommendations = async (movieId) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform and return first 15 recommendations
    return data.results.slice(0, 15).map(transformMovie);
  } catch (error) {
    console.error('Error fetching movie recommendations:', error);
    throw error;
  }
};

/**
 * Fetch trending movies for banner slider
 */
export const fetchTrendingMovies = async () => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    // Return top 5 trending movies with backdrop images
    return data.results.slice(0, 5).map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      rating: (movie.vote_average / 2).toFixed(1),
      backdrop: movie.backdrop_path ? `${TMDB_IMAGE_BASE_URL_BACKDROP}${movie.backdrop_path}` : null,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
      releaseDate: movie.release_date,
      genreIds: movie.genre_ids
    }));
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

/**
 * Fetch now playing movies for recommendations
 */
export const fetchNowPlayingMovies = async () => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&region=IN`,
      {
        headers: {
          'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }

    const data = await response.json();

    return data.results.slice(0, 10).map(transformMovie);
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    throw error;
  }
};

/**
 * Discover movies via TMDB (used for curated rows).
 */
const discoverMovies = async (params = {}) => {
  const query = new URLSearchParams({ api_key: TMDB_API_KEY, ...params });
  const response = await fetch(`${TMDB_BASE_URL}/discover/movie?${query.toString()}`, {
    headers: {
      'Authorization': `Bearer ${TMDB_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`);
  }

  const data = await response.json();
  return (data.results || []).map(transformMovie);
};

/**
 * Telugu recent releases (India region).
 */
export const fetchTeluguRecentMovies = async () => {
  try {
    const today = new Date();
    const from = new Date(today);
    from.setDate(today.getDate() - 365);

    return await discoverMovies({
      region: 'IN',
      with_original_language: 'te',
      sort_by: 'primary_release_date.desc',
      'primary_release_date.gte': from.toISOString().slice(0, 10),
      'primary_release_date.lte': today.toISOString().slice(0, 10),
      include_adult: 'false',
      page: '1',
    });
  } catch (error) {
    console.error('Error fetching Telugu recent movies:', error);
    throw error;
  }
};

/**
 * Indian recent releases (India region).
 */
export const fetchIndianRecentMovies = async () => {
  try {
    const today = new Date();
    const from = new Date(today);
    from.setDate(today.getDate() - 180);

    return await discoverMovies({
      region: 'IN',
      sort_by: 'primary_release_date.desc',
      'primary_release_date.gte': from.toISOString().slice(0, 10),
      'primary_release_date.lte': today.toISOString().slice(0, 10),
      include_adult: 'false',
      page: '1',
    });
  } catch (error) {
    console.error('Error fetching Indian recent movies:', error);
    throw error;
  }
};

/**
 * Recent releases for a specific language (TMDB original language).
 * Example codes: te, hi, ta, ml, kn, en, ko, ja
 */
export const fetchRecentMoviesByLanguage = async (languageCode) => {
  try {
    if (!languageCode || languageCode === 'all') return [];

    const indianLangs = new Set(['te', 'hi', 'ta', 'ml', 'kn', 'bn', 'mr', 'gu', 'pa', 'or']);
    const today = new Date();
    const from = new Date(today);
    from.setDate(today.getDate() - 365);

    const params = {
      with_original_language: languageCode,
      sort_by: 'primary_release_date.desc',
      'primary_release_date.gte': from.toISOString().slice(0, 10),
      'primary_release_date.lte': today.toISOString().slice(0, 10),
      include_adult: 'false',
      page: '1',
    };

    // If it's an Indian language, bias to IN region.
    if (indianLangs.has(languageCode)) {
      params.region = 'IN';
    }

    return await discoverMovies(params);
  } catch (error) {
    console.error('Error fetching recent movies by language:', error);
    throw error;
  }
};
