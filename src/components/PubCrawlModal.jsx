import React, { useState } from 'react';
import Modal from 'react-modal';

const PubCrawlModal = ({ isOpen, onRequestClose, onSavePubCrawl, breweries }) => {
const [pubCrawlData, setPubCrawlData] = useState({
    name: '',
    description: '',
    legs: [],
});

const [currentLeg, setCurrentLeg] = useState(1);

const handleNameChange = (event) => {
    setPubCrawlData({ ...pubCrawlData, name: event.target.value });
};

const handleDescriptionChange = (event) => {
    setPubCrawlData({ ...pubCrawlData, description: event.target.value }); 
};

const handleAddLeg = () => {
    const newLeg = {
    legName: `Leg ${currentLeg}`,
    breweryId: '', // Initialise with an empty brewery ID
    };
    setPubCrawlData({ ...pubCrawlData, legs: [...pubCrawlData.legs, newLeg] });
    setCurrentLeg(currentLeg + 1);
};

const handleBrewerySelection = (legIndex, breweryId) => {
    const updatedLegs = [...pubCrawlData.legs];
    updatedLegs[legIndex].breweryId = breweryId;
    setPubCrawlData({ ...pubCrawlData, legs: updatedLegs });
};

const handleSavePubCrawl = () => {
    // Create a new PubCrawl object with name, description, and legs
    const newPubCrawl = {
    name: pubCrawlData.name, // Use the name from pubCrawlData
    description: pubCrawlData.description, // Use the description from pubCrawlData
    legs: pubCrawlData.legs,
    };

    // Send a POST request to save the new pub crawl to your API
    fetch('https://pub-crawl-backend-g8ks.onrender.com/pubCrawl', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newPubCrawl),
    })
    .then((response) => {
        if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((savedPubCrawl) => {
        // Close the modal by calling the `onRequestClose` function
        onRequestClose();
        setPubCrawlData({ // Reset the pubCrawlData state
        name: '',
        description: '',
        legs: [],
        });
    })
    .catch((error) => {
        console.error('Error saving pub crawl:', error);
    });
};

return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Pub Crawl Builder">
    <h2 className="pubCrawlModal">Create a Pub Crawl</h2>
    <label className="pubCrawlModal" htmlFor="name">Name:</label>
    <input
        type="text"
        id="name"
        value={pubCrawlData.name}
        onChange={handleNameChange}
        placeholder="Enter a name for your Pub Crawl"
    />
    <label className="pubCrawlModal" htmlFor="description">Description:</label>
    <textarea
        id="description"
        value={pubCrawlData.description}
        onChange={handleDescriptionChange}
        placeholder="Give your Pub Crawl a description"
    />

    {pubCrawlData.legs.map((leg, index) => (
        <div key={index}>
        <p className="pubCrawlModal">{leg.legName}</p>
        <label className="pubCrawlModal">Select a Brewery:</label>
        <select
            value={leg.breweryId}
            onChange={(e) => handleBrewerySelection(index, e.target.value)}
        >
            <option value="">Select a Brewery</option>
            {breweries.map((brewery) => (
            <option key={brewery.id} value={brewery.id}>
                {brewery.name}
            </option>
            ))}
        </select>
        </div>
    ))}
    <button onClick={handleAddLeg}>Add Leg</button>
    <button onClick={handleSavePubCrawl}>Save Pub Crawl</button>
    </Modal>
    
);
};

export default PubCrawlModal;