// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OpenCampusID
 * @dev Contract to verify and extend OCID profiles with EduImpact-specific data
 */
contract OpenCampusID is Ownable {
    struct ExtendedProfile {
        string ocid;           // Open Campus ID from the SDK
        string ethAddress;     // ETH address associated with OCID
        string[] skills;       // Technical skills
        uint256 reputation;    // Reputation score
        bool isActive;         // Profile status
        mapping(string => bool) verifiedSkills;  // Skills that have been verified
    }

    mapping(address => ExtendedProfile) public profiles;
    mapping(address => bool) public verifiers;

    event ProfileCreated(address indexed user, string ocid);
    event SkillAdded(address indexed user, string skill);
    event SkillVerified(address indexed user, string skill, address verifier);
    event ReputationUpdated(address indexed user, uint256 newReputation);
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);

    constructor() Ownable(msg.sender) {}

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

    /**
     * @dev Create or update profile with OCID data
     * @param ocid The Open Campus ID from the SDK
     * @param ethAddress The ETH address associated with the OCID
     * @param initialSkills Array of initial technical skills
     */
    function createProfile(
        string memory ocid,
        string memory ethAddress,
        string[] memory initialSkills
    ) external {
        ExtendedProfile storage profile = profiles[msg.sender];
        
        // If new profile
        if (!profile.isActive) {
            profile.ocid = ocid;
            profile.ethAddress = ethAddress;
            profile.reputation = 0;
            profile.isActive = true;
            emit ProfileCreated(msg.sender, ocid);
        }

        // Update skills
        profile.skills = initialSkills;
        for (uint i = 0; i < initialSkills.length; i++) {
            emit SkillAdded(msg.sender, initialSkills[i]);
        }
    }

    /**
     * @dev Verify a specific skill for a user
     * @param user Address of the user
     * @param skill Skill to verify
     */
    function verifySkill(address user, string memory skill) external onlyVerifier {
        ExtendedProfile storage profile = profiles[user];
        require(profile.isActive, "Profile does not exist");
        
        profile.verifiedSkills[skill] = true;
        emit SkillVerified(user, skill, msg.sender);
    }

    /**
     * @dev Update user's reputation score
     * @param user Address of the user
     * @param reputationChange Amount to change reputation by (positive or negative)
     */
    function updateReputation(address user, int256 reputationChange) external onlyVerifier {
        ExtendedProfile storage profile = profiles[user];
        require(profile.isActive, "Profile does not exist");

        if (reputationChange >= 0) {
            profile.reputation += uint256(reputationChange);
        } else {
            // Ensure reputation doesn't underflow
            uint256 change = uint256(-reputationChange);
            if (change > profile.reputation) {
                profile.reputation = 0;
            } else {
                profile.reputation -= change;
            }
        }

        emit ReputationUpdated(user, profile.reputation);
    }

    /**
     * @dev Get profile details
     * @param user Address of the user
     */
    function getProfile(address user) external view returns (
        string memory ocid,
        string memory ethAddress,
        string[] memory skills,
        uint256 reputation,
        bool isActive
    ) {
        ExtendedProfile storage profile = profiles[user];
        return (
            profile.ocid,
            profile.ethAddress,
            profile.skills,
            profile.reputation,
            profile.isActive
        );
    }

    /**
     * @dev Check if a specific skill is verified
     * @param user Address of the user
     * @param skill Skill to check
     */
    function isSkillVerified(address user, string memory skill) external view returns (bool) {
        return profiles[user].verifiedSkills[skill];
    }

    /**
     * @dev Check if a profile exists and is active
     * @param user Address to check
     */
    function hasActiveProfile(address user) external view returns (bool) {
        return profiles[user].isActive;
    }
} 