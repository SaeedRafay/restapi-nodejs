const express = require("express");
const uuid = require("uuid");
const router = express.Router();
const movies = require("../../Movies"); // Movies Database

// Get list of all movies
router.get("/", (req, res) => res.status(200).json(movies));

// Get movie by id
router.get("/:id", (req, res) => {
  const search_id = req.params.id;
  const found = movies.some((movie) => movie.id === search_id);

  if (found) {
    res.status(200).json(movies.filter((movie) => movie.id === search_id));
  } else {
    res.status(400).json({ msg: `No movie with the id of ${search_id}` });
  }
});

// Add a movie to the database
router.post("/", (req, res) => {
  const newMovie = {
    id: uuid.v4(),
    title: req.body.title,
    director: req.body.director,
    release_date: req.body.release_date,
  };

  // If title or director or release_date is not available, then return error
  if (!newMovie.title || !newMovie.director || !newMovie.release_date) {
    return res.status(400).json({
      msg: "Please include a movie title, director name and release date",
    });
  }

  // If there are any other fields than title, director or release_date, then add a note
  const reqObj = req.body;
  const extraFields = [];
  for (let key in reqObj) {
    if (reqObj.hasOwnProperty(key)) {
      if (!(key === "title" || key === "director" || key === "release_date")) {
        extraFields.push(key);
      }
    }
  }
  let extraFieldsNotice = "";
  if(extraFields.length > 0) {
    extraFieldsNotice += `. Extra fields: ${extraFields.join(", ")} are not accepted. ID is auto-generated.`;
  }

  movies.push(newMovie);
  res.status(200).json({
    msg: `New movie has been added with the id of ${newMovie.id}${extraFieldsNotice}`,
    movies,
  });
});

// Update a movie by ID
router.put("/:id", (req, res) => {
  const update_id = req.params.id;
  const found = movies.some((movie) => movie.id === update_id);

  if (found) {
    const updateMovie = req.body;
    movies.forEach((movie) => {
      if (movie.id === update_id) {
        movie.title = updateMovie.title ? updateMovie.title : movie.title;
        movie.director = updateMovie.director
          ? updateMovie.director
          : movie.director;
        movie.release_date = updateMovie.release_date
          ? updateMovie.release_date
          : movie.release_date;

        res
          .status(200)
          .json({ msg: `Movie updated with the id of ${update_id}`, movies });
      }
    });
  } else {
    res.status(400).json({ msg: `No movie with the id of ${update_id}` });
  }
});

// Delete a movie by ID
router.delete("/:id", (req, res) => {
  const delete_id = req.params.id;
  const found = movies.some((movie) => movie.id === delete_id);

  if (found) {
    res.status(200).json({
      msg: `Movie deleted with the id of ${delete_id}`,
      movies: movies.filter((movie) => movie.id !== delete_id),
    });
  } else {
    res.status(400).json({ msg: `No movie with the id of ${delete_id}` });
  }
});

module.exports = router;
