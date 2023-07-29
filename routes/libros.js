const express = require("express");
const route = express.Router();

const libros = require("../data");
const Joi = require("joi");

const libroSchema = Joi.object({
  nombre: Joi.string().required(),
  autor: Joi.string().required(),
});

//Obtener todos los libros
route.get("/", (req, res, next) => {
  try {
    res.json(libros);
  } catch (err) {
    next(err);
  }
});

//Obtener un libro por ID
route.get("/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const libro = libros.find((l) => l.id === id);

    if (!libro) {
      const error = new Error("Libro no encontrado");
      error.status = 404;
      throw error;
    }

    res.json(libro);
  } catch (err) {
    next(err);
  }
});

//Crear un nuevo libro
route.post("/", (req, res, next) => {
  try {
    const { error, value } = libroSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const { nombre, autor } = value;
    const nuevoLibro = {
      id: libros.length + 1,
      nombre,
      autor,
    };

    libros.push(nuevoLibro);
    res.status(201).json(nuevoLibro);
  } catch (err) {
    next(err);
  }
});

//Actualizar un libro existente
route.put("/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { error, value } = libroSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { nombre, autor } = value;

    const libro = libros.find((l) => l.id === id);

    if (!libro) {
      const error = new Error("Libro no encontrado");
      error.status = 404;
      throw error;
    }

    libro.nombre = nombre || libro.nombre;
    libro.autor = autor || libro.autor;
    res.json(libro);
  } catch (err) {
    next(err);
  }
});

//Eliminar un producto
route.delete("/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const index = libros.findIndex((l) => l.id === id);

    if (index === -1) {
      const error = new Error("Libro no encontrado");
      error.status = 404;
      throw error;
    }

    const libroEliminado = libros.splice(index, 1);

    res.json(libroEliminado[0]);
  } catch (err) {
    next(err);
  }
});

module.exports = route;
