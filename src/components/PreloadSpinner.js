import React from 'react';

import './PreloadSpinner.scss';

const PreloadSpinner = () => (
  <div className="preloader">
    <div className="loadingindactor" style={{marginTop: '10px'}}>
      <div className="spinner">
        <div className="preload-spinner"></div>
      </div>
    </div>
  </div>
);

export default PreloadSpinner;
