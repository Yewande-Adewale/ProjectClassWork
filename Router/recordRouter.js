const {createRecord,getRecords,getRecord,updateRecord,deleteRecord} = require('../Controller/recordController')
const {userAuth} = require('../Middleware/authMiddleware')

const express = require('express');
const routere = express.Router();

routere.post('/records', userAuth, createRecord);
routere.get('/records', userAuth, getRecords);
routere.get('/records/:id', userAuth, getRecord);
routere.put('/records/:id', userAuth, updateRecord);
routere.delete('/records/:id', userAuth, deleteRecord);


module.exports = routere;