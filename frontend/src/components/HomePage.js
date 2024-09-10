import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return(
        <div>
            <h1>Macro Track</h1>
            <h3>You are what you eat</h3>
            <ul>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign-up</Link></li>
                <li><Link to="/diary">diary</Link></li>
            </ul>
        </div>
    );
};

export default HomePage;