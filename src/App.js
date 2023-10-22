import React, { useState } from 'react';
import './App.css';
import ExperimentModal from './ExperimentModal'; // Import the ExperimentModal component

console.log(process.env.REACT_APP_BACKEND_URL);

function App() {
  // State for the list of experiments
  const [experiments, setExperiments] = useState([]);
  const [frequency, setFrequency] = useState('daily'); // Define frequency state here
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [editExperiment, setEditExperiment] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedDaysOnSave, setSelectedDaysOnSave] = useState([]); // Initialize selectedDaysOnSave
  const daysOfWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  function toggleDropdown(experimentId) {
    setShowDropdown((prevId) =>
      prevId === experimentId ? null : experimentId
    );
  }

  function handleEdit(experiment) {
    setEditExperiment(experiment);
    setShowModal(true);
  }

  function handleDelete(experimentId) {
    setExperiments((prevExperiments) =>
      prevExperiments.filter((experiment) => experiment.id !== experimentId)
    );
  }

  // State for tracking selected experiments

  function openModal(e) {
    e.preventDefault();
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setShowDropdown(null);
  }

  const handleNumberInputChange = (e, experimentId) => {
    const inputValue = e.target.value;
    setExperiments((prevExperiments) =>
      prevExperiments.map((experiment) =>
        experiment.id === experimentId
          ? {
              ...experiment,
              numberInputValue: Number(inputValue),
              isSaved: false,
            }
          : experiment
      )
    );
  };

  const handleKeyDown = (e, experimentId) => {
    if (e.key === 'Enter') {
      setExperiments((prevExperiments) => {
        return prevExperiments.map((experiment) => {
          if (experiment.id === experimentId) {
            const today = new Date().toISOString().split('T')[0];

            if (
              experiment.numberInputValue !== undefined &&
              experiment.numberInputValue !== null
            ) {
              let historicalData = experiment.historicalData || [];

              // Find the index of the existing data point for today, if it exists
              const todayIndex = historicalData.findIndex(
                (dataPoint) => dataPoint.date === today
              );

              const newHistoricalDataPoint = {
                date: today,
                value: experiment.numberInputValue,
                experimentId: experiment.id,
              };

              if (todayIndex >= 0) {
                // If a data point for today already exists, update it
                historicalData[todayIndex] = newHistoricalDataPoint;
              } else {
                // If no data point for today exists, add a new one
                historicalData.push(newHistoricalDataPoint);
              }
              console.log('Updated historical data:', historicalData); // This line will log the historical data array to the console

              return { ...experiment, historicalData, isSaved: true };
            }
          }
          return experiment;
        });
      });
    }
  };

  function saveExperiment(newExperiment) {
    const timestamp = editExperiment ? editExperiment.id : Date.now();
    let frequencyValue = newExperiment.frequency;

    if (newExperiment.frequency === 'weekly') {
      frequencyValue = selectedDaysOnSave; // Maintain array structure
    }

    // Get the current date in 'YYYY-MM-DD' format
    const today = new Date().toISOString().split('T')[0];

    // Get the existing historical data array if editing an experiment; otherwise, start a new array
    const historicalData = editExperiment
      ? [...(editExperiment.historicalData || [])]
      : [];

    const experimentWithId = {
      ...newExperiment,
      id: timestamp,
      frequency: frequencyValue,
      numberInputValue:
        newExperiment.numberInputValue !== null &&
        newExperiment.numberInputValue !== undefined
          ? Number(newExperiment.numberInputValue)
          : newExperiment.numberInputValue,
      historicalData, // adding the historicalData array to your experiment object
    };
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/experiments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(experimentWithId),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Experiment saved to backend:', data);

        // Update the local state after successfully saving to the backend
        setExperiments((prevExperiments) => [
          ...prevExperiments.filter(
            (experiment) => experiment.id !== timestamp
          ),
          experimentWithId,
        ]);
        setEditExperiment(null);
        closeModal();
        setShowDropdown(null);
        console.log('Saved experiment:', experimentWithId);
      })
      .catch((error) => {
        console.error('Error saving experiment to backend:', error);
      });
  }

  function handleCompleteButtonClick(experimentId) {
    setExperiments((prevExperiments) =>
      prevExperiments.map((experiment) =>
        experiment.id === experimentId
          ? { ...experiment, completed: !experiment.completed }
          : experiment
      )
    );
  }

  const isInputEnabled = (experiment) => {
    const today = new Date()
      .toLocaleString('en-US', { weekday: 'long' })
      .toLowerCase();
    // converted the day to lowercase to match with your daysOfWeek array

    if (experiment.frequency === 'daily') {
      return true;
    }

    if (
      Array.isArray(experiment.frequency) &&
      experiment.frequency.includes(today)
    ) {
      return true;
    }

    return false;
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 id="sidebar-title">Add Experiments</h2>
        <form>
          <button className="add-button" onClick={openModal}>
            Add
          </button>
          {/* New delete button */}
        </form>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h2 className="experiment-title">Your Experiments</h2>
        <div className="experiment-container">
          {experiments.map((experiment) => (
            <div className="experiment-row" key={experiment.id}>
              <div
                className={`experiment-details-container ${
                  !isInputEnabled(experiment) ? 'disabled' : ''
                }`}
              >
                {' '}
                <button
                  className="ellipsis-button"
                  onClick={() => toggleDropdown(experiment.id)}
                >
                  ...
                </button>
                {showDropdown === experiment.id && (
                  <div className="dropdown">
                    <button onClick={() => handleEdit(experiment)}>Edit</button>
                    <button onClick={() => handleDelete(experiment.id)}>
                      Delete
                    </button>
                    <button>See Graph</button>
                  </div>
                )}{' '}
                {/* New container */}
                <div className="experiment-details">
                  <div className="experiment-detail-box">
                    <span className="key">Action:</span>
                    <span className="value">{experiment.action}</span>
                  </div>
                  <div className="experiment-detail-box">
                    <span className="key">Frequency:</span>
                    <span className="value">
                      {Array.isArray(experiment.frequency) ? (
                        <div className="days-of-week">
                          {daysOfWeek.map((day) => (
                            <div
                              key={day}
                              className={`day-box ${
                                experiment.frequency.includes(day)
                                  ? 'selected'
                                  : ''
                              }`}
                            >
                              <input
                                type="checkbox"
                                id={`${experiment.id}_${day}`}
                                name={day}
                                value={day}
                                checked={experiment.frequency.includes(day)}
                                readOnly // Set the readOnly attribute
                              />
                              <label
                                className="label"
                                htmlFor={`${experiment.id}_${day}`}
                              >
                                {day.charAt(0).toUpperCase() +
                                  day.charAt(1).toLowerCase()}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span>{experiment.frequency}</span>
                      )}
                    </span>
                  </div>
                  <div className="experiment-detail-box">
                    <span className="key">Input Type:</span>
                    <span className="value">{experiment.inputType}</span>
                  </div>
                  <div className="experiment-detail-box">
                    <span className="key">Evaluation Metric:</span>
                    <span className="value">{experiment.evaluationMetric}</span>
                  </div>
                </div>
              </div>
              {experiment.inputType === 'checkbox' ? (
                <button
                  className={`complete-button ${
                    experiment.completed ? 'completed' : ''
                  }`}
                  onClick={() => handleCompleteButtonClick(experiment.id)}
                >
                  {experiment.completed ? '✔' : 'Complete'}
                </button>
              ) : (
                <input
                  type="number"
                  value={experiment.numberInputValue || ''}
                  className={`number-input ${
                    experiment.isSaved ? 'saved' : ''
                  }`}
                  onChange={(e) => handleNumberInputChange(e, experiment.id)}
                  onKeyDown={(e) => handleKeyDown(e, experiment.id)}
                  disabled={!isInputEnabled(experiment)} // Conditionally setting the disabled attribute
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <ExperimentModal
        showModal={showModal}
        onClose={closeModal}
        onSave={saveExperiment}
        clearInputs={showModal}
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
        selectedDaysOnSave={selectedDaysOnSave} // Pass selectedDaysOnSave as a prop
        setSelectedDaysOnSave={setSelectedDaysOnSave} // Pass setSelectedDaysOnSave as a prop
        frequency={frequency} // Pass the frequency prop
        editExperiment={editExperiment}
      />
    </div>
  );
}

export default App;
