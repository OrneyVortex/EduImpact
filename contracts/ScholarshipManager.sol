// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./OpenCampusID.sol";

/**
 * @title ScholarshipManager
 * @dev Manages scholarships, applications, and milestone-based funding
 */
contract ScholarshipManager is Ownable, ReentrancyGuard {
    OpenCampusID public immutable openCampusID;
    IERC20 public immutable paymentToken;

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
        string[] requiredSkills;
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

    event ScholarshipCreated(uint256 indexed scholarshipId, address indexed sponsor);
    event ApplicationSubmitted(uint256 indexed scholarshipId, address indexed applicant);
    event ScholarSelected(uint256 indexed scholarshipId, address indexed scholar);
    event MilestoneCompleted(uint256 indexed scholarshipId, address indexed scholar, uint256 milestoneId);
    event MilestoneVerified(uint256 indexed scholarshipId, address indexed scholar, uint256 milestoneId);
    event RewardReleased(uint256 indexed scholarshipId, address indexed scholar, uint256 amount);

    constructor(address _openCampusID, address _paymentToken) Ownable(msg.sender) {
        openCampusID = OpenCampusID(_openCampusID);
        paymentToken = IERC20(_paymentToken);
    }

    function createScholarship(
        string memory title,
        string memory description,
        string memory category,
        uint256 totalAmount,
        uint256 deadline,
        string[] memory requiredSkills,
        string[] memory milestoneTitles,
        string[] memory milestoneDescriptions,
        uint256[] memory milestoneRewards
    ) external {
        require(milestoneTitles.length == milestoneRewards.length, "Invalid milestone data");
        require(paymentToken.transferFrom(msg.sender, address(this), totalAmount), "Transfer failed");

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

        emit ScholarshipCreated(scholarshipId, msg.sender);
    }

    function applyForScholarship(uint256 scholarshipId) external {
        Scholarship storage scholarship = scholarships[scholarshipId];
        require(scholarship.isActive, "Scholarship not active");
        require(!scholarship.applicants[msg.sender], "Already applied");
        require(block.timestamp < scholarship.deadline, "Deadline passed");

        // Verify that applicant has an active OpenCampusID profile
        (,,,bool isActive) = openCampusID.getProfile(msg.sender);
        require(isActive, "Active OpenCampusID required");

        scholarship.applicants[msg.sender] = true;
        emit ApplicationSubmitted(scholarshipId, msg.sender);
    }

    function selectScholar(uint256 scholarshipId, address scholar) external {
        Scholarship storage scholarship = scholarships[scholarshipId];
        require(msg.sender == scholarship.sponsor, "Not sponsor");
        require(scholarship.applicants[scholar], "Not an applicant");

        scholarship.selectedScholars.push(scholar);
        emit ScholarSelected(scholarshipId, scholar);
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

        emit MilestoneCompleted(scholarshipId, msg.sender, milestoneId);
    }

    function verifyMilestone(
        uint256 scholarshipId,
        address scholar,
        uint256 milestoneId
    ) external {
        Scholarship storage scholarship = scholarships[scholarshipId];
        require(msg.sender == scholarship.sponsor, "Not sponsor");
        require(completedMilestones[scholarshipId][scholar][milestoneId], "Milestone not completed");

        Milestone storage milestone = scholarship.milestones[milestoneId];
        require(!milestone.isVerified, "Already verified");

        milestone.isVerified = true;
        scholarProgress[scholarshipId][scholar]++;

        // Release milestone reward
        require(paymentToken.transfer(scholar, milestone.reward), "Reward transfer failed");
        scholarship.remainingAmount -= milestone.reward;

        emit MilestoneVerified(scholarshipId, scholar, milestoneId);
        emit RewardReleased(scholarshipId, scholar, milestone.reward);
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