'use client';

import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import MovieCard from '../components/MovieCard';
import { Loader2, Search, Filter } from 'lucide-react';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWatched, setFilterWatched] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getMovies();
      setMovies(data);
    } catch (err) {
      setError('Failed to load movies. Please make sure the API server is running on http://localhost:5000');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      await api.deleteMovie(movieId);
      setMovies(prev => prev.filter(movie => movie.id !== movieId));
    } catch (err) {
      throw err;
    }
  };

  // Filter and sort movies
  const filteredAndSortedMovies = movies
    .filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          movie.genre.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterWatched === 'all' || 
                           (filterWatched === 'watched' && movie.watched) ||
                           (filterWatched === 'unwatched' && !movie.watched);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return b.releaseYear - a.releaseYear;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading movies...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={fetchMovies}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Your Movie Collection
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover, track, and manage your favorite movies all in one place.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Filter by watched status */}
          <div>
            <select
              value={filterWatched}
              onChange={(e) => setFilterWatched(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Movies</option>
              <option value="watched">Watched</option>
              <option value="unwatched">To Watch</option>
            </select>
          </div>

          {/* Sort by */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="title">Sort by Title</option>
              <option value="year">Sort by Year</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movie Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{movies.length}</h3>
          <p className="text-gray-600 dark:text-gray-400">Total Movies</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
            {movies.filter(m => m.watched).length}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Watched</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
          <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {movies.filter(m => !m.watched).length}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">To Watch</p>
        </div>
      </div>

      {/* Movies Grid */}
      {filteredAndSortedMovies.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
            <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No movies found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterWatched !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Start by adding your first movie to the collection.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredAndSortedMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onDelete={handleDeleteMovie}
            />
          ))}
        </div>
      )}
    </div>
  );
}