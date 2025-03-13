import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('https://frontend-take-home-service.fetch.com/auth/logout', {}, {
        withCredentials: true,
      });

      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="ml-4 p-2 bg-red-500 text-white rounded"
    >
      Log Out
    </button>
  );
};

export default Logout;
