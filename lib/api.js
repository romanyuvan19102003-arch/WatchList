const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const api = {
  // Get all movies
  async getMovies() {
    try {
      const response = await fetch(`${API_BASE_URL}/movies`);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  // Get single movie by ID
  async getMovie(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch movie');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching movie:', error);
      throw error;
    }
  },

  // Create new movie
  async createMovie(movieData) {
    try {
      const response = await fetch(`${API_BASE_URL}/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
      });
      if (!response.ok) {
        throw new Error('Failed to create movie');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating movie:', error);
      throw error;
    }
  },

  // Update movie
  async updateMovie(id, movieData) {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData),
      });
      if (!response.ok) {
        throw new Error('Failed to update movie');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating movie:', error);
      throw error;
    }
  },

  // Delete movie
  async deleteMovie(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete movie');
      }
      return true;
    } catch (error) {
      console.error('Error deleting movie:', error);
      throw error;
    }
  },
};