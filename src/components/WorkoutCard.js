import { Card, Button, Badge } from 'react-bootstrap';
import { useState } from 'react';
import EditWorkout from './EditWorkout'; // You'll need to create this component
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

export default function WorkoutCard({ workoutProp, fetchData }) {
  const { _id, name, duration, dateAdded, status } = workoutProp;
  const [showEditModal, setShowEditModal] = useState(false);

  const formatDate = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:4000/workouts/deleteWorkout/${_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        fetchData(); 
      } else {
        console.error('Error deleting workout:', data.message);
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'complete': return 'success';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <>
      <Card className="workout-card h-100">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <Card.Title>{name}</Card.Title>
            <Badge bg={getStatusVariant(status)}>{status}</Badge>
          </div>
          
          <Card.Text>
            <strong>Duration:</strong> {duration} minutes
          </Card.Text>
          
          <Card.Text>
            {formatDate(dateAdded)}
          </Card.Text>
          
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={() => setShowEditModal(true)}
            >
              Edit
            </Button>
            
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={handleDelete}
            >
              Delete
            </Button>
            
            {status === 'pending' && (
              <Button 
                variant="outline-success" 
                size="sm"
                onClick={async () => {
                  const token = localStorage.getItem('token');
                  try {
                    const response = await fetch(`http://localhost:4000/workouts/completeWorkoutStatus/${_id}`, {
                      method: 'POST',
                      headers: {
                        Authorization: `Bearer ${token}`
                      }
                    });
                    
                    if (response.ok) {
                      fetchData(); 
                    }
                  } catch (error) {
                    console.error('Error completing workout:', error);
                  }
                }}
              >
                Complete
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <EditWorkout 
        workout={workoutProp}
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        fetchData={fetchData}
      />
    </>
  );
}
