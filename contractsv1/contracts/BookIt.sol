// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BookIt is ERC721URIStorage, Ownable{
    
    mapping(address => uint256) public Stakers;
    Event[] internal allEvents;
    uint256 public tokenId;
    uint256 public eventId = 0;
    mapping(address => BoughtEvent[]) public eventsOfUser;
    mapping(uint256 => Review[]) public allReviewsofEvent;
    mapping(address => Event[]) public ticketsOfUser;

    event Stake(address from, uint256 amount);
    event Mint(address to, uint256 ticket_counts, uint256 total_price);
    event EventAdded(address from, uint256 capacity, uint256 price, string Date, string Venue);
    event Reviewed(address from, string data, string timestamp);


    struct Review{
        address reviewer;
        string comment;
        string timestamp;
    }

    struct Event{
        uint256 id;
        address owner;
        string Name;
        string Description;
        string Date;
        string Time; 
        string Venue;
        uint256 Capacity;
        uint256 Price;
        string IPFS_Logo;
    }

    struct BoughtEvent{
        uint256 id;
        address owner;
        string Name;    
        string Description;
        string Date;
        string Time;
        string Venue;
        uint256 TicketsBought;
        uint256 Price;
        uint256 TotalPrice;
        string IPFS_Logo;
    }

    constructor() ERC721("BookIT", "BKT") Ownable(msg.sender) {
    }

    modifier _checkStake(address staker) {
        require(Stakers[staker]>0, "User has not yet staked ETH.");
        _;
    }

    receive() external payable {
        Stakers[msg.sender] = msg.value;
        emit Stake(msg.sender, msg.value);
    }

    function buyTickets(uint256 event_id, address to, uint256 ticket_count) public payable {
        Event memory curr_event = getEventById(event_id);
        
        if(curr_event.Capacity < ticket_count) {
            revert("Not enough tickets available");
        }

        curr_event.Capacity -= ticket_count;
        uint256 price = curr_event.Price;  // in Wei
        string memory uri = curr_event.IPFS_Logo;
        
        // Remove the extra multiplication by 10**18
        require(msg.value == ticket_count * price, "Please enter the correct amount");
        
        address payable owner = payable(curr_event.owner);
        tokenId++;
        _safeMint(to, tokenId);

        
        
        // Transfer the exact payment to the owner
        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "Transfer failed");
        
        _setTokenURI(tokenId, uri);
        ticketsOfUser[to].push(curr_event);

        // Add to list of events of that particular user
        bool flg = false;
        for(uint256 i=0; i<eventsOfUser[to].length; i++){
            if(eventsOfUser[to][i].id == event_id){
                flg = true;
                break;
            }   
        }
        if(!flg){
            BoughtEvent memory newBoughtEvent = BoughtEvent(event_id, to, curr_event.Name, curr_event.Description, curr_event.Date, curr_event.Time, curr_event.Venue, ticket_count, price, msg.value, uri);
            eventsOfUser[to].push(newBoughtEvent);
        }
        emit Mint(to, ticket_count, msg.value);
    }

    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal {
        require(from == address(0), "Err: token transfer is BLOCKED");   
        _beforeTokenTransfer(from, to, firstTokenId, batchSize);  
    }

    function addEvent(address to, string memory Name, string memory Description, string memory Date, string memory Time, string memory Venue, uint256 capacity, uint256 price, string memory uri) public _checkStake(to) {
        Event memory newEvent = Event(eventId, to, Name, Description, Date, Time, Venue, capacity, price, uri);
        allEvents.push(newEvent);
        eventId++;
        emit EventAdded(to, capacity, price, Date, Venue);
    }

    function giveReview(uint256 event_id, address from, string memory comment, string memory timestamp) public {
        Review memory newReview = Review(from, comment, timestamp);
        allReviewsofEvent[event_id].push(newReview);
        emit Reviewed(from, comment, timestamp);
    }

    function getAllEvents() public view returns(Event[] memory) {
        return allEvents;
    }

    function getEventById(uint256 id) public view returns(Event memory){
        return allEvents[id];
    }

    function getAllReview(uint256 event_id) public view returns(Review[] memory){
        return allReviewsofEvent[event_id];
    }

    function getUserTickets(address user) public view returns(Event[] memory){
        return ticketsOfUser[user];
    }

    function getAllBoughtEvents(address user) public view returns(BoughtEvent[] memory){
        return eventsOfUser[user];
    }

    function getStake(address staker) public view returns(uint256){
        return Stakers[staker];
    }  

}