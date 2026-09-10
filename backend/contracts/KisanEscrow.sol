// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract KisanEscrow {
    address public buyer;
    address public farmer;
    address public inspector; // KisanSetu Platform Admin
    
    enum State { Created, Deposited, Delivered, Refunded }
    State public currentState;

    uint256 public amount;

    event PaymentDeposited(address indexed buyer, uint256 amount);
    event DeliveryConfirmed(address indexed farmer, uint256 amount);
    event RefundIssued(address indexed buyer, uint256 amount);

    modifier onlyBuyer() {
        require(msg.sender == buyer, "Caller is not the buyer");
        _;
    }

    modifier onlyInspector() {
        require(msg.sender == inspector, "Caller is not the inspector");
        _;
    }

    modifier inState(State expectedState) {
        require(currentState == expectedState, "Invalid state transition");
        _;
    }

    constructor(address _farmer, address _inspector) {
        require(_farmer != address(0) && _inspector != address(0), "Invalid addresses");
        buyer = msg.sender;
        farmer = _farmer;
        inspector = _inspector;
        currentState = State.Created;
    }

    /// @notice Buyer deposits produce funds into escrow
    function depositPayment() external payable onlyBuyer inState(State.Created) {
        require(msg.value > 0, "Deposit must be greater than zero");
        amount = msg.value;
        currentState = State.Deposited;
        emit PaymentDeposited(msg.sender, msg.value);
    }

    /// @notice Releases funds to farmer once produce delivery & quality are verified
    function confirmDelivery() external inState(State.Deposited) {
        require(msg.sender == buyer || msg.sender == inspector, "Unauthorized to release funds");
        
        currentState = State.Delivered;
        (bool success, ) = payable(farmer).call{value: amount}("");
        require(success, "ETH transfer failed");

        emit DeliveryConfirmed(farmer, amount);
    }

    /// @notice Refunds buyer if order fails transit or quality check
    function refundBuyer() external onlyInspector inState(State.Deposited) {
        currentState = State.Refunded;
        (bool success, ) = payable(buyer).call{value: amount}("");
        require(success, "Refund transfer failed");

        emit RefundIssued(buyer, amount);
    }
}

