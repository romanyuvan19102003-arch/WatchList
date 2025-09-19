'use client';

import Link from 'next/link';
import { Star, Eye, EyeOff, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function MovieCard({ movie, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this movie?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete(movie.id);
      toast.success(`"${movie.title}" has been deleted successfully`);
    } catch (error) {
      console.error('Error deleting movie:', error);
      toast.error('Failed to delete movie. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <Link href={`/movie/${movie.id}`}>
        <div className="relative">
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="w-full h-96 object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x600/374151/9CA3AF?text=No+Image';
            }}
          />
          
          {/* Watched Badge */}
          <div className="absolute top-4 left-4">
            {movie.watched ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <Eye className="w-4 h-4 mr-1" />
                Watched
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                <EyeOff className="w-4 h-4 mr-1" />
                To Watch
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
            <span className="text-sm font-bold">{movie.rating}</span>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/movie/${movie.id}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {movie.title}
          </h3>
        </Link>
        
        <div className="space-y-2 mb-4">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Director:</span> {movie.director}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Genre:</span> {movie.genre}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Year:</span> {movie.releaseYear}
          </p>
        </div>

        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {movie.description}
        </p>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`/edit-movie/${movie.id}`}
            className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Link>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}