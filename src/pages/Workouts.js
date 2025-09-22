import { useState, useEffect, useContext } from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import WorkoutCard from '../components/WorkoutCard';
import AddWorkouts from './AddWorkouts';
import UserContext from '../context/UserContext';
import { Navigate } from 'react-router-dom';

export default function Workouts() {
  const { user } = useContext(UserContext);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/workouts/getMyWorkouts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.workouts && Array.isArray(data.workouts)) {
          setWorkouts(data.workouts);
        } else {
          setWorkouts([]);
        }
      } else {
        setError(data.message || 'Failed to fetch workouts');
        setWorkouts([]);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError('Network error. Please try again.');
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.id !== null) {
      fetchData();
    }
  }, [user]);

  if (user.id === null) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Workouts</h1>
      </div>
      
      <Row>
        <Col md={8}>
          {loading && (
            <div className="text-center">
              <p>Loading workouts...</p>
            </div>
          )}
          
          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}
          
          {!loading && !error && (
            <Row>
              {workouts.length > 0 ? (
                workouts.map(workout => (
                  <Col key={workout._id} md={6} className="mb-4">
                    <WorkoutCard workoutProp={workout} fetchData={fetchData} />
                  </Col>
                ))
              ) : (
                <Col className="text-center">
                  <p>No workouts found. Add your first workout!</p>
                </Col>
              )}
            </Row>
          )}
        </Col>
        
        <Col md={4}>
          <AddWorkouts fetchData={fetchData} />
        </Col>
      </Row>
    </div>
  );
}