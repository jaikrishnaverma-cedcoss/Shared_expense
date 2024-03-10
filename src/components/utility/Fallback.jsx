import React from 'react';
import './fallback.css'; // Assuming your CSS file is named Fallback.css
import { useNavigate } from 'react-router-dom';

const Fallback = ({ title, message,fullScreen }) => {
    const navigate=useNavigate()
  return (
    <div className={`fallback-container ${fullScreen?"fallback-full":''}`}>
      <div className="fallback-content">
        <h1 className="fallback-title">Oops! Something went wrong.</h1>
        {title && <h3 className="fallback-subtitle">{title}</h3>}
        {message && <small className="fallback-message">{message}</small>}
        <p className="fallback-message">We're sorry, but it seems there was an error.</p>
        <p className="fallback-message">Please try again later or <span className="fallback-contact" onClick={()=>navigate('/login')}>Go to login</span>.</p>
      </div>
    </div>
  );
};

export default Fallback;
