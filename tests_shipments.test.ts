import request from 'supertest';
import app from '../backend/app'; // adjust path as needed

describe('Shipments API', () => {
  it('creates a sea shipment with container and BL', async () => {
    const payload = {
      shipment_type: 'sea',
      reference_no: 'REF123',
      container_number: 'CONT1234567',
      bl_number: 'BL999',
    };

    const res = await request(app).post('/api/shipments').send(payload);
    expect(res.status).toBe(201);
    expect(res.body.shipment.shipment_type).toBe('sea');
    expect(res.body.shipment.bl_number).toBe('BL999');
  });
});