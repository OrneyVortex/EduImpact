// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title OpenCampusID
 * @dev Manages decentralized identities and credentials for EduImpact users
 */
contract OpenCampusID is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Credential {
        string credentialType; // e.g., "course", "certification", "contribution"
        string ipfsHash;      // IPFS hash of the credential details
        uint256 timestamp;
        bool isVerified;
        address verifier;
    }

    struct Profile {
        string name;
        string ipfsHash;      // IPFS hash of additional profile data
        uint256[] credentials;
        bool isActive;
    }

    mapping(address => Profile) public profiles;
    mapping(uint256 => Credential) public credentials;
    mapping(address => bool) public verifiers;

    event ProfileCreated(address indexed user, string name);
    event CredentialIssued(address indexed user, uint256 indexed credentialId, string credentialType);
    event CredentialVerified(uint256 indexed credentialId, address indexed verifier);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);

    constructor() ERC721("OpenCampusID", "OCID") Ownable(msg.sender) {}

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Not authorized as verifier");
        _;
    }

    function addVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }

    function removeVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = false;
        emit VerifierRemoved(verifier);
    }

    function createProfile(string memory name, string memory ipfsHash) external {
        require(!profiles[msg.sender].isActive, "Profile already exists");
        
        profiles[msg.sender] = Profile({
            name: name,
            ipfsHash: ipfsHash,
            credentials: new uint256[](0),
            isActive: true
        });

        emit ProfileCreated(msg.sender, name);
    }

    function issueCredential(
        address to,
        string memory credentialType,
        string memory ipfsHash
    ) external onlyVerifier returns (uint256) {
        require(profiles[to].isActive, "Profile does not exist");

        _tokenIds.increment();
        uint256 newCredentialId = _tokenIds.current();

        credentials[newCredentialId] = Credential({
            credentialType: credentialType,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            isVerified: true,
            verifier: msg.sender
        });

        profiles[to].credentials.push(newCredentialId);
        _mint(to, newCredentialId);

        emit CredentialIssued(to, newCredentialId, credentialType);
        return newCredentialId;
    }

    function getProfile(address user) external view returns (
        string memory name,
        string memory ipfsHash,
        uint256[] memory credentialIds,
        bool isActive
    ) {
        Profile memory profile = profiles[user];
        return (
            profile.name,
            profile.ipfsHash,
            profile.credentials,
            profile.isActive
        );
    }

    function getCredential(uint256 credentialId) external view returns (
        string memory credentialType,
        string memory ipfsHash,
        uint256 timestamp,
        bool isVerified,
        address verifier
    ) {
        Credential memory credential = credentials[credentialId];
        return (
            credential.credentialType,
            credential.ipfsHash,
            credential.timestamp,
            credential.isVerified,
            credential.verifier
        );
    }

    function updateProfile(string memory name, string memory ipfsHash) external {
        require(profiles[msg.sender].isActive, "Profile does not exist");
        profiles[msg.sender].name = name;
        profiles[msg.sender].ipfsHash = ipfsHash;
    }
} 