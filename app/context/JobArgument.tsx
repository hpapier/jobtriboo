// @module import
import React, { useState } from 'react';


// @context
const JobArgumentContext = React.createContext(null);


// @component
const JobArgument = (props) => {
  const [argument, setArgument] = useState(null);

  return (
    <JobArgumentContext.Provider value={{ argument }}>
      { props.children }
    </JobArgumentContext.Provider>
  );
};

// @export
export default JobArgument;