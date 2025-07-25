
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
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#1B1B2E', zIndex: 9999 }}>
      <Lottie options={defaultOptions} height={400} width={400} />
    </div>
  );
};

export default LoadingScreen;
