// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract USDSCollateral {
	using SafeERC20 for IERC20;

	struct Round {
		uint256 paymentAmount;
		IERC20 token;
		uint8 numberOfPlayers;
		address[] players;
		uint256 totalAmountLocked;
		uint8 availableSlots;
		uint256 endTime;
		mapping(address => bool) withdrawnCollateral;
	}

	mapping(string roundId => Round round) private _rounds;

	event RoundInitialized(string indexed roundId, address initializer);
	event PlayerAdded(string indexed roundId, address player);
	event CollateralWithdrawn(
		string indexed roundId,
		address player,
		uint256 amount
	);

	error RoundAlreadyExists();
	error RoundEnded();
	error RoundNotEnded();
	error RoundFull();
	error CollateralAlreadyWithdrawn();

	function initializeRound(
		string calldata roundId,
		uint256 paymentAmount,
		IERC20 token,
		uint8 numberOfPlayers
	) external {
		if (address(_rounds[roundId].token) != address(0)) {
			revert RoundAlreadyExists();
		}

		Round storage round = _rounds[roundId];

		round.paymentAmount = paymentAmount;
		round.token = token;
		round.numberOfPlayers = numberOfPlayers;
		round.players.push(msg.sender);
		round.endTime = block.timestamp + 7 days;
		round.totalAmountLocked += paymentAmount;
		round.availableSlots = numberOfPlayers--;

		token.safeTransferFrom(msg.sender, address(this), paymentAmount);

		emit RoundInitialized(roundId, msg.sender);
	}

	function addPlayer(string calldata roundId) external {
		Round storage round = _rounds[roundId];
		if (block.timestamp > round.endTime) {
			revert RoundEnded();
		}
		if (round.availableSlots == 0) {
			revert RoundFull();
		}

		round.players.push(msg.sender);
		round.totalAmountLocked += round.paymentAmount;
		round.availableSlots--;

		round.token.safeTransferFrom(
			msg.sender,
			address(this),
			round.paymentAmount
		);

		emit PlayerAdded(roundId, msg.sender);
	}

	function withdrawCollateral(string calldata roundId) external {
		Round storage round = _rounds[roundId];
		if (block.timestamp < round.endTime) {
			revert RoundNotEnded();
		}
		if (round.withdrawnCollateral[msg.sender]) {
			revert CollateralAlreadyWithdrawn();
		}

		round.token.safeTransfer(msg.sender, round.paymentAmount);
		round.withdrawnCollateral[msg.sender] = true;

		emit CollateralWithdrawn(roundId, msg.sender, round.paymentAmount);
	}
}
