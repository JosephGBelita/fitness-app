import { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function AddWorkouts({ fetchData }) {
  const notyf = new Notyf();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:4000/workouts/addWorkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, duration })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        notyf.success('Workout added successfully!');
        setName('');
        setDuration('');
        fetchData();
      } else {
        notyf.error(data.message || 'Error adding workout');
      }
    } catch (error) {
      notyf.error('Network error. Please try again.');
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h5 className="mb-0">Add New Workout</h5>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Workout Name:</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter workout name"
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
              placeholder="Enter duration in minutes"
            />
          </Form.Group>
          
          <div className="d-grid">
            <Button variant="primary" type="submit">
              Add Workout
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}