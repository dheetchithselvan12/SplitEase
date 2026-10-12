import { ProgressSpinner } from 'primereact/progressspinner';

const Loader = () => (
  <div className="flex justify-center items-center h-40">
    <ProgressSpinner strokeWidth="4" animationDuration=".7s" style={{ width: '40px', height: '40px' }}  />
  </div>
);

export default Loader;