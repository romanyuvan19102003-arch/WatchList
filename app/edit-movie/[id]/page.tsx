'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../lib/api';
import MovieForm from '../../../components/MovieForm';

export default function EditMovie() {
  const params = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleSubmit = async (formData) => {
    return await api.updateMovie(params.id, formData);
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <MovieForm
        movie={movie}
        onSubmit={handleSubmit}
        isEditing={true}
      />
    </div>
  );
}