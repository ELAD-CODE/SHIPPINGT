import express from 'express';
import { body, validationResult } from 'express-validator';
import { Shipment } from '../models/shipment';

const router = express.Router();

const shipmentValidation = [
  body('shipment_type').isIn(['air', 'sea', 'road']),
  body('reference_no').optional().isString(),
  // conditional validation for sea
  body('container_number').if(body('shipment_type').equals('sea')).notEmpty().withMessage('container_number required for sea shipments'),
  body('bl_number').if(body('shipment_type').equals('sea')).notEmpty().withMessage('bl_number required for sea shipments'),
  // other validations...
];

router.post('/', shipmentValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const payload: Shipment = req.body;
  // persist using DB layer (example)
  // const created = await db.createShipment(payload);
  res.status(201).json({ ok: true, shipment: payload });
});

router.put('/:id', shipmentValidation, async (req, res) => {
  // similar validation and update flow
  res.json({ ok: true });
});

export default router;