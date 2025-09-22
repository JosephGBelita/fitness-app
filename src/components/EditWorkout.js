import { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function EditWorkout({ workout, show, onHide, fetchData }) {
  const notyf = new Notyf();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (workout) {
      setName(workout.name);
      setDuration(workout.duration);
    }
  }, [workout]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/workouts/updateWorkout/${workout._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, duration })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        notyf.success('Workout updated successfully!');
        onHide();
        fetchData();
      } else {
        notyf.error(data.message || 'Error updating workout');
      }
    } catch (error) {
      notyf.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Workout</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Workout Name:</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Duration (minutes):</Form.Label>
            <Form.Control
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
              min="1"
              disabled={isSubmitting}
            />
          </Form.Group>
          
          <div className="d-flex gap-2 justify-content-end">
            <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Workout'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}