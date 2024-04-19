import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Loader = () => {
    return (
        <div className="bottom-10 min-h-100 w-full flex justify-center items-center relative">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-blue-950" spinPulse/>
        </div>
    );
}

export default Loader;