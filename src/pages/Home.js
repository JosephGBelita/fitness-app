import Banner from '../components/Banner';
import { useContext } from 'react';
import UserContext from '../context/UserContext';

export default function Home() {
  const { user } = useContext(UserContext);

  const data = user.id === null ? {
    title: "Fitness Tracker",
    content: "You must login or register to use the app",
    destination: "/login",
    buttonLabel: "Login/Register"
  } : {
    title: "Fitness Tracker",
    content: "Track your workouts and achieve your fitness goals",
    destination: "/workouts",
    buttonLabel: "View Workouts"
  };

  return (
    <>
      <Banner data={data} />
    </>
  );
}