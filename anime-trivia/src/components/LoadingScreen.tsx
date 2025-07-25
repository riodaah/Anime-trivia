
import Lottie from 'react-lottie';
import animationData from '../Lotties/Pochita Improved.json';

const LoadingScreen = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1B1B2E' }}>
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};

export default LoadingScreen;
