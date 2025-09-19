'use client';

import { api } from '../../lib/api';
import MovieForm from '../../components/MovieForm';

export default function AddMovie() {
  const handleSubmit = async (formData) => {
    return await api.createMovie(formData);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <MovieForm onSubmit={handleSubmit} />
    </div>
  );
}