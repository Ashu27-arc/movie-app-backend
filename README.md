# Movie App Backend

Backend API for the Movie App using Express, MongoDB, and TMDB API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Open `.env` file
   - Add your TMDB API key: `TMDB_KEY=your_actual_api_key_here`
   - Get your API key from: https://www.themoviedb.org/settings/api

3. Make sure MongoDB is running locally on port 27017

4. Start the server:
```bash
npm run dev
```

The server will run on http://localhost:5000

## API Endpoints

### TMDB Routes
- `GET /tmdb/trending` - Get trending movies
- `GET /tmdb/popular` - Get popular movies
- `GET /tmdb/top-rated` - Get top rated movies
- `GET /tmdb/search/:query` - Search movies
- `GET /tmdb/category/:genre` - Get movies by genre

### Movie Routes
- `GET /api/movies` - Get all saved movies
- `POST /api/movies` - Add a new movie
- `DELETE /api/movies/:id` - Delete a movie
# movie-app-backend
