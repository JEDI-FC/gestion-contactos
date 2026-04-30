const express = require('express');
const mongoose = require('mongoose');
const Contact = require('../models/Contact');

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function buildSearchFilter(search) {
  if (!search) {
    return {};
  }

  const regex = new RegExp(search.trim(), 'i');

  return {
    $or: [
      { name: regex },
      { email: regex },
      { phone: regex },
      { company: regex },
      { notes: regex },
    ],
  };
}

router.get('/', async (req, res) => {
  try {
    const filter = buildSearchFilter(req.query.search);
    const contacts = await Contact.find(filter).sort({ createdAt: -1 });

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'No se pudieron obtener los contactos', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID de contacto invalido' });
    }

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'No se pudo obtener el contacto', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: 'No se pudo crear el contacto', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID de contacto invalido' });
    }

    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: 'No se pudo actualizar el contacto', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'ID de contacto invalido' });
    }

    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    res.json({ message: 'Contacto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'No se pudo eliminar el contacto', error: error.message });
  }
});

module.exports = router;
