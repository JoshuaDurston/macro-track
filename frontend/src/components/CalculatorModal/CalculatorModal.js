import React, { useState } from 'react';
import './CalculatorModal.css';

const CalculatorModal = ({ weight, onClose }) => {
    const [result, setResult] = useState(null);
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [sex, setSex] = useState('male');
    const [goal, setGoal] = useState('maintain');

    const calculateIntake = () => {
        // Mifflin-St Jeor Formula
        // Men: BMR = 10 × weight(kg) + 6.25 × height(cm) – 5 × age + 5
        // Women: BMR = 10 × weight(kg) + 6.25 × height(cm) – 5 × age – 161
        // 1kcal = 4.184 kj
        const kilojoules = weight ? (parseFloat(weight) * 100).toFixed(0) : 0;
        setResult(kilojoules);


        const w = parseFloat(weight);
        const h = parseFloat(height);
        const a = parseInt(age);

        if(isNaN(w) || isNaN(h) || isNaN(a)){
            alert("Please ensure all fields are filled correctly.");
            return;
        }

        const s = sex === 'male' ? 5 : -161;

        let multiplier = 1; // default for 'maintain'

        if (goal === 'lose') {
         multiplier = 0.85; // 15% deficit
        } else if (goal === 'gain') {
          multiplier = 1.15; // 15% surplus
        }

        const bmr = (10 * w + 6.25 * h - 5 * a + s) * multiplier;

        const bmrKJ = (bmr * 4.184).toFixed(0);
        setResult(bmrKJ);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✖</button>
                <h3>Daily Energy Intake Calculator</h3>

                <p>Based on your info, we'll estimate your Basal Metabolic Rate (BMR):</p>

                <label>
                    Height (cm):
                    <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
                </label>
                <br/>
                <label>
                    Age:
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                </label>
                <br/>
                <label>
                    Sex:
                    <select value={sex} onChange={(e) => setSex(e.target.value)}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </label>
                <br/>
                <label htmlFor="goal">I'm looking to:</label>
                    <select id="goal" value={goal} onChange={(e) => setGoal(e.target.value)}>
                        <option value="lose">Lose Weight</option>
                        <option value="maintain">Maintain Weight</option>
                        <option value="gain">Gain Weight</option>
                    </select>
                <br/>
                <p>Current Weight: <strong>{weight} kg</strong></p>

                <button onClick={calculateIntake}>
                    Calculate Daily BMR
                </button>

                {result && (
                    <p>Your estimated BMR is: <strong>{result} kJ/day</strong></p>
                )}
            </div>
        </div>
    );
};

export default CalculatorModal;
