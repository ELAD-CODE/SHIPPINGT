import React from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  shipment_type: 'air' | 'sea' | 'road';
  reference_no?: string;
  container_number?: string;
  vessel_name?: string;
  voyage_number?: string;
  bl_number?: string;
  // ...
};

export const ShipmentForm: React.FC = () => {
  const { register, watch, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const shipmentType = watch('shipment_type', 'air');

  const onSubmit = (data: FormValues) => {
    // POST /api/shipments
    fetch('/api/shipments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Type</label>
      <select {...register('shipment_type')}>
        <option value="air">Air</option>
        <option value="sea">Sea</option>
        <option value="road">Road</option>
      </select>

      <label>Reference</label>
      <input {...register('reference_no')} />

      {shipmentType === 'sea' && (
        <>
          <label>Container number</label>
          <input {...register('container_number', { required: true })} />
          {errors.container_number && <span>Required for sea shipments</span>}

          <label>Vessel name</label>
          <input {...register('vessel_name')} />

          <label>Voyage number</label>
          <input {...register('voyage_number')} />

          <label>B/L number</label>
          <input {...register('bl_number', { required: true })} />
          {errors.bl_number && <span>Required for sea shipments</span>}
        </>
      )}

      <button type="submit">Save</button>
    </form>
  );
};