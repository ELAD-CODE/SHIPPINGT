import { mapTrackingGetResponse } from '../lib/tracking/converters';

describe('mapTrackingGetResponse', () => {
  it('maps a sample payload origin_info.trackinfo to internal format', () => {
    const sample = {
      meta: { code: 200 },
      data: {
        origin_info: [
          {
            tracking_number: '123',
            carrier_code: 'ups',
            status: 'transit',
            original_country: 'China',
            destination_country: 'Israel',
            trackinfo: [
              { Date: '2024-01-01 10:00:00', StatusDescription: 'Picked up', Details: 'Shenzhen, China' },
              { Date: '2024-01-02 12:00:00', StatusDescription: 'In transit', Details: 'Air hub' },
            ],
            estimated_delivery_time: '2024-01-05T00:00:00Z',
          },
        ],
      },
    };

    const mapped = mapTrackingGetResponse(sample, '123', 'ups');
    expect(mapped.success).toBe(true);
    
    if (mapped.success) {
      expect(mapped.tracking_number).toBe('123');
      expect(mapped.carrier?.code).toBe('ups');
      expect(mapped.events?.length).toBe(2);
      expect(mapped.estimated_delivery).toBe('2024-01-05T00:00:00Z');
    }
  });

  it('returns error when meta code != 200', () => {
    const sample = { meta: { code: 400, message: 'Bad' }, data: {} };
    const mapped = mapTrackingGetResponse(sample, 'x');
    expect(mapped.success).toBe(false);
    
    if (!mapped.success) {
      expect(mapped.error).toBeDefined();
    }
  });
});
