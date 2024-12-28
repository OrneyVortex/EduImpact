// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./OpenCampusID.sol";

/**
 * @title ScholarshipManager
 * @dev Manages scholarships, applications, and milestone-based funding using native EDU
 */
contract ScholarshipManager is Ownable, ReentrancyGuard {
    OpenCampusID public immutable openCampusID;
    
    // Reputation thresholds
    uint256 public constant BEGINNER_REPUTATION = 0;
    uint256 public constant INTERMEDIATE_REPUTATION = 50;
    uint256 public constant ADVANCED_REPUTATION = 100;
    uint256 public constant EXPERT_REPUTATION = 200;

    // Reputation rewards
    uint256 public constant SELECTION_REWARD = 10;
    uint256 public constant MILESTONE_COMPLETION_REWARD = 5;

    struct Milestone {
        string title;
        string description;
        uint256 reward;
        bool isCompleted;
        bool isVerified;
        string proofIpfsHash;
    }

    struct Scholarship {
        address sponsor;
        string title;
        string description;
        string category;
        uint256 totalAmount;
        uint256 remainingAmount;
        uint256 deadline;
        bool isActive;
        string[] requiredSkills;    // Skills required for this scholarship
        uint256 difficultyLevel;    // 0=Beginner, 1=Intermediate, 2=Advanced, 3=Expert
        mapping(uint256 => Milestone) milestones;
        uint256 totalMilestones;
        mapping(address => bool) applicants;
        address[] selectedScholars;
    }

    mapping(uint256 => Scholarship) public scholarships;
    uint256 private scholarshipCounter;

    // Scholar's progress tracking
    mapping(uint256 => mapping(address => mapping(uint256 => bool))) public completedMilestones;
    mapping(uint256 => mapping(address => uint256)) public scholarProgress;

    // New mapping to track staked amounts for each scholar in each scholarship
    mapping(uint256 => mapping(address => uint256)) public stakedAmounts;

    event ScholarshipCreated(
        uint256 indexed scholarshipId, 
        address indexed sponsor, 
        uint256 amount,
        string[] requiredSkills,
        uint256 difficultyLevel
    );
    event ApplicationSubmitted(uint256 indexed scholarshipId, address indexed applicant);
    event ScholarSelected(uint256 indexed scholarshipId, address indexed scholar);
    event MilestoneCompleted(
        uint256 indexed scholarshipId, 
        address indexed scholar, 
        uint256 milestoneId,
        string proofIpfsHash
    );
    event MilestoneVerified(uint256 indexed scholarshipId, address indexed scholar, uint256 milestoneId);
    event RewardReleased(uint256 indexed scholarshipId, address indexed scholar, uint256 amount);
    event RewardStaked(uint256 indexed scholarshipId, address indexed scholar, uint256 amount);
    event AllMilestonesCompleted(uint256 indexed scholarshipId, address indexed scholar);

    /**
     * @dev Constructor sets the OpenCampusID contract address
     * @param _openCampusIDContract The address of the official OpenCampusID contract on Open Campus Layer-3
     */
    constructor(address _openCampusIDContract) Ownable(msg.sender) {
        openCampusID = OpenCampusID(_openCampusIDContract);
    }

    /**
     * @dev Get minimum reputation required for a difficulty level
     * @param difficultyLevel 0=Beginner, 1=Intermediate, 2=Advanced, 3=Expert
     */
    function getRequiredReputation(uint256 difficultyLevel) public pure returns (uint256) {
        if (difficultyLevel == 0) return BEGINNER_REPUTATION;
        if (difficultyLevel == 1) return INTERMEDIATE_REPUTATION;
        if (difficultyLevel == 2) return ADVANCED_REPUTATION;
        if (difficultyLevel == 3) return EXPERT_REPUTATION;
        revert("Invalid difficulty level");
    }

    function createScholarship(
        string memory title,
        string memory description,
        string memory category,
        uint256 deadline,
        string[] memory requiredSkills,
        uint256 difficultyLevel,
        string[] memory milestoneTitles,
        string[] memory milestoneDescriptions,
        uint256[] memory milestoneRewards
    ) external payable {
        require(milestoneTitles.length == milestoneRewards.length, "Invalid milestone data");
        require(deadline > block.timestamp, "Invalid deadline");
        require(requiredSkills.length > 0, "Must specify required skills");
        require(difficultyLevel <= 3, "Invalid difficulty level");
        
        uint256 totalAmount = 0;
        for(uint256 i = 0; i < milestoneRewards.length; i++) {
            totalAmount += milestoneRewards[i];
        }
        require(msg.value == totalAmount, "Incorrect EDU amount sent");

        uint256 scholarshipId = scholarshipCounter++;
        Scholarship storage scholarship = scholarships[scholarshipId];
        
        scholarship.sponsor = msg.sender;
        scholarship.title = title;
        scholarship.description = description;
        scholarship.category = category;
        scholarship.totalAmount = totalAmount;
        scholarship.remainingAmount = totalAmount;
        scholarship.deadline = deadline;
        scholarship.isActive = true;
        scholarship.requiredSkills = requiredSkills;
        scholarship.difficultyLevel = difficultyLevel;
        scholarship.totalMilestones = milestoneTitles.length;

        for (uint256 i = 0; i < milestoneTitles.length; i++) {
            scholarship.milestones[i] = Milestone({
                title: milestoneTitles[i],
                description: milestoneDescriptions[i],
                reward: milestoneRewards[i],
                isCompleted: false,
                isVerified: false,
                proofIpfsHash: ""
            });
        }

        emit ScholarshipCreated(scholarshipId, msg.sender, totalAmount, requiredSkills, difficultyLevel);
    }

    function applyForScholarship(uint256 scholarshipId) external {
        Scholarship storage scholarship = scholarships[scholarshipId];
        require(scholarship.isActive, "Scholarship not active");
        require(!scholarship.applicants[msg.sender], "Already applied");
        require(block.timestamp < scholarship.deadline, "Deadline passed");

        // Get applicant's profile and verify requirements
        (,, string[] memory skills, uint256 reputation, bool isActive) = openCampusID.getProfile(msg.sender);
        require(isActive, "Active OpenCampusID required");
        
        // Check reputation meets difficulty level requirement
        uint256 requiredReputation = getRequiredReputation(scholarship.difficultyLevel);
        require(reputation >= requiredReputation, "Insufficient reputation for difficulty level");

        // Verify required skills
        bool hasAllSkills = true;
        for (uint256 i = 0; i < scholarship.requiredSkills.length; i++) {
            if (!openCampusID.isSkillVerified(msg.sender, scholarship.requiredSkills[i])) {
                hasAllSkills = false;
                break;
            }
        }
        require(hasAllSkills, "Missing required verified skills");

        scholarship.applicants[msg.sender] = true;
        emit ApplicationSubmitted(scholarshipId, msg.sender);
    }

    function selectScholar(uint256 scholarshipId, address scholar) external {
        Scholarship storage scholarship = scholarships[scholarshipId];
        require(msg.sender == scholarship.sponsor, "Not sponsor");
        require(scholarship.applicants[scholar], "Not an applicant");

        scholarship.selectedScholars.push(scholar);
        emit ScholarSelected(scholarshipId, scholar);

        // Update scholar's reputation through OpenCampusID
        openCampusID.updateReputation(scholar, 10); // Reward for being selected
    }

    function submitMilestone(
        uint256 scholarshipId,
        uint256 milestoneId,
        string memory proofIpfsHash
    ) external {
        Scholarship storage scholarship = scholarships[scholarshipId];
        require(isSelectedScholar(scholarshipId, msg.sender), "Not selected scholar");
        require(!completedMilestones[scholarshipId][msg.sender][milestoneId], "Already completed");

        scholarship.milestones[milestoneId].proofIpfsHash = proofIpfsHash;
        scholarship.milestones[milestoneId].isCompleted = true;
        completedMilestones[scholarshipId][msg.sender][milestoneId] = true;

        emit MilestoneCompleted(scholarshipId, msg.sender, milestoneId, proofIpfsHash);
    }

    function verifyMilestone(
        uint256 scholarshipId,
        address scholar,
        uint256 milestoneId
    ) external nonReentrant {
        Scholarship storage scholarship = scholarships[scholarshipId];
        require(msg.sender == scholarship.sponsor, "Not sponsor");
        require(completedMilestones[scholarshipId][scholar][milestoneId], "Milestone not completed");

        Milestone storage milestone = scholarship.milestones[milestoneId];
        require(!milestone.isVerified, "Already verified");

        milestone.isVerified = true;
        scholarProgress[scholarshipId][scholar]++;

        // Update scholar's reputation
        openCampusID.updateReputation(scholar, int256(MILESTONE_COMPLETION_REWARD));

        // Stake milestone reward instead of immediate transfer
        uint256 reward = milestone.reward;
        scholarship.remainingAmount -= reward;
        stakedAmounts[scholarshipId][scholar] += reward;
        
        emit MilestoneVerified(scholarshipId, scholar, milestoneId);
        emit RewardStaked(scholarshipId, scholar, reward);

        // Check if all milestones are completed
        if (scholarProgress[scholarshipId][scholar] == scholarship.totalMilestones) {
            emit AllMilestonesCompleted(scholarshipId, scholar);
            _releaseStakedFunds(scholarshipId, scholar);
        }
    }

    /**
     * @dev Get the total staked amount for a scholar in a scholarship
     * @param scholarshipId The ID of the scholarship
     * @param scholar The address of the scholar
     * @return The total staked amount
     */
    function getStakedAmount(uint256 scholarshipId, address scholar) external view returns (uint256) {
        return stakedAmounts[scholarshipId][scholar];
    }

    /**
     * @dev Internal function to release all staked funds to a scholar
     * @param scholarshipId The ID of the scholarship
     * @param scholar The address of the scholar
     */
    function _releaseStakedFunds(uint256 scholarshipId, address scholar) internal {
        uint256 totalStaked = stakedAmounts[scholarshipId][scholar];
        require(totalStaked > 0, "No staked amount");

        stakedAmounts[scholarshipId][scholar] = 0;
        
        (bool success, ) = payable(scholar).call{value: totalStaked}("");
        require(success, "EDU transfer failed");

        emit RewardReleased(scholarshipId, scholar, totalStaked);
    }

    /**
     * @dev Get scholar's progress and staking details
     * @param scholarshipId The ID of the scholarship
     * @param scholar The address of the scholar
     * @return completedMilestones_ Number of completed milestones
     * @return totalMilestones Total number of milestones
     * @return stakedAmount Current staked amount
     */
    function getScholarProgress(uint256 scholarshipId, address scholar) external view returns (
        uint256 completedMilestones_,
        uint256 totalMilestones,
        uint256 stakedAmount
    ) {
        Scholarship storage scholarship = scholarships[scholarshipId];
        return (
            scholarProgress[scholarshipId][scholar],
            scholarship.totalMilestones,
            stakedAmounts[scholarshipId][scholar]
        );
    }

    function isSelectedScholar(uint256 scholarshipId, address scholar) public view returns (bool) {
        Scholarship storage scholarship = scholarships[scholarshipId];
        for (uint256 i = 0; i < scholarship.selectedScholars.length; i++) {
            if (scholarship.selectedScholars[i] == scholar) {
                return true;
            }
        }
        return false;
    }

    function getScholarshipDetails(uint256 scholarshipId) external view returns (
        address sponsor,
        string memory title,
        string memory description,
        string memory category,
        uint256 totalAmount,
        uint256 remainingAmount,
        uint256 deadline,
        bool isActive,
        string[] memory requiredSkills,
        uint256 difficultyLevel,
        uint256 totalMilestones,
        address[] memory selectedScholars
    ) {
        Scholarship storage scholarship = scholarships[scholarshipId];
        return (
            scholarship.sponsor,
            scholarship.title,
            scholarship.description,
            scholarship.category,
            scholarship.totalAmount,
            scholarship.remainingAmount,
            scholarship.deadline,
            scholarship.isActive,
            scholarship.requiredSkills,
            scholarship.difficultyLevel,
            scholarship.totalMilestones,
            scholarship.selectedScholars
        );
    }

    function getMilestone(uint256 scholarshipId, uint256 milestoneId) external view returns (
        string memory title,
        string memory description,
        uint256 reward,
        bool isCompleted,
        bool isVerified,
        string memory proofIpfsHash
    ) {
        Milestone storage milestone = scholarships[scholarshipId].milestones[milestoneId];
        return (
            milestone.title,
            milestone.description,
            milestone.reward,
            milestone.isCompleted,
            milestone.isVerified,
            milestone.proofIpfsHash
        );
    }
} 