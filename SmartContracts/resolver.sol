// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "https://github.com/ethereum-attestation-service/eas-contracts/blob/master/contracts/resolver/SchemaResolver.sol";

import "https://github.com/ethereum-attestation-service/eas-contracts/blob/master/contracts/IEAS.sol";

/// @title AttesterResolver
/// @notice A sample schema resolver that checks whether the attestation is from a specific attester.
/// Injected provider is MetaMask

contract AttesterResolver is SchemaResolver {
    address private immutable _targetAttester;

    constructor(IEAS eas, address targetAttester) SchemaResolver(eas) {
        _targetAttester = targetAttester;
    }

    function onAttest(Attestation calldata attestation, uint256 /*value*/) internal view override returns (bool) {
        return attestation.attester == _targetAttester;
    }

    function onRevoke(Attestation calldata /*attestation*/, uint256 /*value*/) internal pure override returns (bool) {
        return true;
    }
}