import { useContract } from '../hooks/useContract.js'
import { useState, useEffect } from 'react';
import { Card } from './ui/Card.jsx';
export const Events = () => {
    const { contract } = useContract();
    const [events, setEvents] = useState([]);
  
    useEffect(() => {
      const fetchEvents = async () => {
        if (contract) {
          const allEvents = await contract.getAllEvents();
          setEvents(allEvents);
        }
      };
      fetchEvents();
    }, [contract]);
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} glowing>
            {/* Event details */}
          </Card>
        ))}
      </div>
    );
  };