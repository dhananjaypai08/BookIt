import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ethers } from 'ethers';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Coins,
  Ticket,
  Loader2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useContract } from '../hooks/useContract';

const EventCard = ({ event, onBuyTickets }) => {
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate prices for display and transaction
  const totalPrice = parseFloat(ethers.formatEther(event.Price)) * quantity;
  // For transaction: price * quantity * 10^18 as per smart contract
  const totalPriceWei = event.Price * BigInt(quantity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card glowing className="h-full flex flex-col">
        {/* Event Image */}
        <div className="relative w-full h-48 rounded-t-xl overflow-hidden">
          <img
            src={event.IPFS_Logo}
            alt={event.Name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Event Details */}
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-bold mb-2">{event.Name}</h3>
          
          <div className="space-y-2 text-gray-400 mb-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{event.Date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{event.Time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{event.Venue}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>{Number(event.Capacity)} seats available</span>
            </div>
            <div className="flex items-center">
              <Coins className="w-4 h-4 mr-2" />
              <span>{ethers.formatEther(event.Price)} ETH per ticket</span>
            </div>
          </div>

          {/* Description (with show more/less toggle) */}
          <div className="mb-4">
            <p className={`text-gray-400 ${!isExpanded ? 'line-clamp-2' : ''}`}>
              {event.Description}
            </p>
            {event.Description.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-violet-500 hover:text-violet-400 text-sm mt-1"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {/* Ticket Purchase Section */}
          <div className="mt-auto">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="number"
                min="1"
                max={Number(event.Capacity)}
                value={quantity}
                onChange={(e) => {
                  const newQuantity = parseInt(e.target.value) || 1;
                  setQuantity(Math.min(newQuantity, Number(event.Capacity), 4));
                }}
                className="w-20 px-3 py-2 bg-gray-900 rounded-lg border border-gray-800 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              />
              <span className="text-gray-400">
                Total: {totalPrice.toFixed(4)} ETH
              </span>
            </div>
            
            <Button
              onClick={() => onBuyTickets(event.id, quantity, totalPriceWei)}
              className="w-full group"
              disabled={event.Capacity === 0}
            >
              <Ticket className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
              {event.Capacity === 0 ? 'Sold Out' : 'Buy Tickets'}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export const Events = () => {
  const { contract, address, signer } = useContract();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [status, setStatus] = useState({
    txHash: null,
    error: null,
    successMessage: null
  });

  useEffect(() => {
    const fetchEvents = async () => {
      if (contract) {
        try {
          const allEvents = await contract.getAllEvents();
          setEvents(allEvents);
        } catch (error) {
          console.error('Error fetching events:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchEvents();
  }, [contract]);

  const handleBuyTickets = async (eventId, quantity, totalPriceWei) => {
    if (!contract || !signer) return;
    setPurchasing(true);
    setStatus({
      txHash: null,
      error: null,
      successMessage: null
    });
    console.log(eventId, quantity, totalPriceWei);
    try {
      const connectedContract = contract.connect(signer);
      const tx = await connectedContract.buyTickets(
        eventId,
        address,
        quantity,
        {
          value: totalPriceWei // Send exact wei amount
        }
      );

      setStatus({
        txHash: tx.hash,
        successMessage: `Successfully purchased ${quantity} ticket${quantity > 1 ? 's' : ''}!`
      });

      await tx.wait();
      
      // Refresh events to update availability
      const updatedEvents = await contract.getAllEvents();
      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error purchasing tickets:', error);
      setStatus({
        error: 'Failed to purchase tickets. Please try again.'
      });
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-violet-500 mb-4" />
          <p className="text-gray-400">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      {/* Gradient Orb Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-violet-500 to-pink-500 text-transparent bg-clip-text">
              Upcoming Events
            </span>
          </h1>
          <p className="text-xl text-gray-400">
            Discover and book amazing events happening near you
          </p>
        </motion.div>

        {/* Status Messages */}
        {(status.txHash || status.error || status.successMessage) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card glowing className="border border-violet-500/20">
              <div className="p-4">
                {status.txHash && (
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <a
                      href={`https://block-explorer.testnet.lens.dev/tx/${status.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-500 hover:text-violet-400"
                    >
                      View transaction
                    </a>
                  </div>
                )}
                
                {status.successMessage && (
                  <div className="flex items-center text-sm text-green-500">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {status.successMessage}
                  </div>
                )}

                {status.error && (
                  <div className="flex items-center text-sm text-red-500">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {status.error}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Events Grid */}
        {events.length === 0 ? (
          <Card glowing className="text-center p-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-4">No Events Found</h3>
              <p className="text-gray-400 mb-8">
                Be the first to create an amazing event for the community!
              </p>
              <Button onClick={() => navigate('/create')} className="group">
                Create Event
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onBuyTickets={handleBuyTickets}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;