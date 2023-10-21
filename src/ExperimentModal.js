import React, { useState, useEffect } from 'react';
import './ExperimentModal.css'; // Import the CSS for styling

function ExperimentModal({
  showModal,
  onClose,
  onSave,
  editExperiment,
  selectedDays,
  setSelectedDays,
  selectedDaysOnSave,
  setSelectedDaysOnSave,
}) {
  const [action, setAction] = useState('');
  const [frequency, setFrequency] = useState('');
  const [inputType, setInputType] = useState('number');
  const [evaluationMetric, setEvaluationMetric] = useState('');

  const daysOfWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const resetSelectedDays = () => {
    setSelectedDays([]);
    setSelectedDaysOnSave([]);
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('New Experiment:', {
      action,
      frequency,
      inputType,
      evaluationMetric,
      selectedDays: selectedDaysOnSave,
    });

    // Determine the appropriate frequency value
    const experimentFrequency =
      selectedDaysOnSave.length > 0 ? 'weekly' : 'daily';

    // Construct an experiment object
    const newExperiment = {
      action,
      frequency: experimentFrequency,
      inputType,
      evaluationMetric,
      selectedDays: experimentFrequency === 'weekly' ? selectedDaysOnSave : [],
    };
    console.log('New Experiment:', newExperiment); // Check the newExperiment object
    resetSelectedDays(); // Call the function to reset selected days
    onSave(newExperiment); // Call the onSave prop with the new experiment
    onClose(); // Close the modal
  };

  useEffect(() => {
    if (showModal) {
      if (editExperiment) {
        setAction(editExperiment.action);
        setFrequency(
          editExperiment.frequency instanceof Array
            ? 'weekly'
            : editExperiment.frequency
        );
        setInputType(editExperiment.inputType);
        setEvaluationMetric(editExperiment.evaluationMetric);
        setSelectedDaysOnSave(
          editExperiment.frequency instanceof Array
            ? editExperiment.frequency
            : []
        );
      } else {
        // Reset to default values when adding a new experiment
        setAction('');
        setFrequency('');
        setInputType('number');
        setEvaluationMetric('');
        setSelectedDaysOnSave([]);
      }
    }
  }, [showModal, editExperiment]);

  function handleDayClick(day) {
    setSelectedDays((prevSelectedDays) => {
      if (prevSelectedDays.includes(day)) {
        return prevSelectedDays.filter((d) => d !== day);
      } else {
        return [...prevSelectedDays, day];
      }
    });

    setSelectedDaysOnSave((prevSelectedDaysOnSave) => {
      if (prevSelectedDaysOnSave.includes(day)) {
        return prevSelectedDaysOnSave.filter((d) => d !== day);
      } else {
        return [...prevSelectedDaysOnSave, day];
      }
    });

    function resetSelectedDays() {
      setSelectedDays([]);
      setSelectedDaysOnSave([]);
    }

    console.log('Selected Days:', selectedDays);
    console.log('Selected Days On Save:', selectedDaysOnSave);
  }

  return (
    <div className={`modal ${showModal ? 'show' : ''}`}>
      <div className="modal-content">
        <h2>Add Experiment</h2>
        <form onSubmit={handleSubmit}>
          {/* Input fields for experiment details */}
          {/* Action */}
          <label>Action:</label>
          <input
            type="text"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            required
          />
          {/* Frequency */}
          <label>Frequency:</label>
          <select
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            required
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          {frequency === 'weekly' && (
            <div className="days-of-week">
              {daysOfWeek.map((day) => (
                <div key={day}>
                  <input
                    type="checkbox"
                    id={day}
                    name={day}
                    value={day}
                    checked={selectedDaysOnSave.includes(day)} // Use selectedDaysOnSave here
                    onChange={() => handleDayClick(day)}
                  />
                  <label htmlFor={day}>{day.charAt(0).toUpperCase()}</label>
                </div>
              ))}
            </div>
          )}

          {/* Input Type */}
          <label>Input Type:</label>
          <select
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
            required
          >
            <option value="number">Number</option>
            <option value="checkbox">Checkbox</option>
          </select>
          {/* Evaluation Metric */}
          <label>Evaluation Metric:</label>
          <input
            type="text"
            value={evaluationMetric}
            onChange={(e) => setEvaluationMetric(e.target.value)}
            required
          />
          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExperimentModal;
