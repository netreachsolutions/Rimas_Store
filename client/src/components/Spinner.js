import { FaSpinner } from 'react-icons/fa';

const Spinner = () => (
  <div className="flex justify-center items-center mt-4">
    <FaSpinner className="animate-spin text-4xl text-gray-900" />
  </div>
);

export default Spinner;