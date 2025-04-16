
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  // This would be replaced with actual auth check once Supabase is integrated
  const isAuthenticated = false;
  
  useEffect(() => {
    // Redirect to dashboard if authenticated, otherwise to login
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return null; // This component just handles redirection
};

export default Index;
