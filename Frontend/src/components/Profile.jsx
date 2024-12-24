export const Profile = () => {
    const { contract, address } = useContract();
    const [tickets, setTickets] = useState([]);
    const [stake, setStake] = useState(0);
  
    useEffect(() => {
      const fetchUserData = async () => {
        if (contract && address) {
          const userTickets = await contract.getUserTickets(address);
          const userStake = await contract.getStake(address);
          setTickets(userTickets);
          setStake(userStake);
        }
      };
      fetchUserData();
    }, [contract, address]);
  
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card glowing>
          <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-violet-400">Staked Amount</h3>
            <p className="text-2xl">{stake} ETH</p>
          </div>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-violet-400">Your Tickets</h3>
            {tickets.map((ticket) => (
              <Card key={ticket.id}>
                {/* Ticket details */}
              </Card>
            ))}
          </div>
        </Card>
      </div>
    );
  };