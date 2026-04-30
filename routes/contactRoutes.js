
const express = require('express'); const router = express.Router(); 
const Contact = require('../models/Contact'); 
 
// Obtener todos los contactos 
router.get('/', async (req, res) => {
       const contacts = await Contact.find();
       res.json(contacts); 
}); 
 
// Crear un nuevo contacto
router.post('/', async (req, res) => {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json(newContact); 
}); 
 
module.exports = router; 
