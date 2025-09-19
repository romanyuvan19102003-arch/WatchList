'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { ArrowLeft, Star, Calendar, User, Film, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MovieDetails() {
  const params = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchMovie();
    }
  }, [params.id]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const data = await api.getMovie(params.id);
      setMovie(data);
    } catch (err) {
      setError('Failed to load movie details.');
      console.error('Error fetching movie:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this movie?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.deleteMovie(movie.id);
      toast.success(`"${movie.title}" has been deleted successfully`);
      router.push('/');
    } catch (err) {
      console.error('Error deleting movie:', err);
      toast.error('Failed to delete movie. Please try again.');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading movie details...</span>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-600 dark:text-red-400">{error || 'Movie not found'}</p>
            <Link
              href="/"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Movies
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Movie Poster */}
          <div className="md:w-1/3">
            <img
              src={movie.imageUrl}
              alt={movie.title}
              className="w-full h-96 md:h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x600/374151/9CA3AF?text=No+Image';
              }}
            />
          </div>

          {/* Movie Details */}
          <div className="md:w-2/3 p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {movie.title}
                </h1>
                
                {/* Status Badge */}
                <div className="mb-4">
                  {movie.watched ? (
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <Eye className="w-4 h-4 mr-2" />
                      Watched
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      <EyeOff className="w-4 h-4 mr-2" />
                      To Watch
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Link
                  href={`/edit-movie/${movie.id}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Link>
                
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>

            {/* Movie Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Director</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{movie.director}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Film className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Genre</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{movie.genre}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Release Year</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{movie.releaseYear}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">{movie.rating}/10</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {movie.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}