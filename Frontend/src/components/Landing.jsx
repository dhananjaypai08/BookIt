import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Ticket, 
  Shield, 
  Wallet, 
  Users,
  ArrowRight
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="relative"
  >
    <Card glowing>
      <div className="relative z-10">
        <Icon className="w-8 h-8 mb-4 text-violet-500" />
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </Card>
  </motion.div>
);

export const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Ticket,
      title: "Create & Host Events",
      description: "Stake 0.2 tokens and start hosting unforgettable experiences with secure blockchain ticketing."
    },
    {
      icon: Shield,
      title: "Soulbound Tickets",
      description: "Every ticket is a unique NFT, providing proof of ownership and preventing fraud."
    },
    {
      icon: Wallet,
      title: "Instant Payments",
      description: "Direct payments to event organizers with smart contract automation."
    },
    {
      icon: Users,
      title: "Community Reviews",
      description: "Build trust with transparent, blockchain-verified event reviews."
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4">
        {/* Gradient Orb Background Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center items-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-16 h-16 text-violet-500" />
              </motion.div>
            </div>

            <h1 className="text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text">
                Next-Gen Event
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 text-transparent bg-clip-text">
                Booking Revolution
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Experience the future of event ticketing with blockchain technology.
              Secure, transparent, and community-driven.
            </p>

            <div className="flex justify-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button onClick={() => navigate('/events')} className="group">
                  <span>Explore Events</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => navigate('/create')}
                  variant="secondary"
                  className="group border border-violet-500/20 hover:border-violet-500/50"
                >
                  <span>Create Event</span>
                  <Sparkles className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-32"
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-32 text-center"
          >
            <Card glowing className="inline-block px-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-8">
                <div>
                  <h4 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 text-transparent bg-clip-text">
                    100%
                  </h4>
                  <p className="text-gray-400 mt-2">Secure Transactions</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
                    0%
                  </h4>
                  <p className="text-gray-400 mt-2">Ticket Fraud</p>
                </div>
                <div>
                  <h4 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-pink-500 text-transparent bg-clip-text">
                    24/7
                  </h4>
                  <p className="text-gray-400 mt-2">Instant Access</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;