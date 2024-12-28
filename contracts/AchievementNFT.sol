// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ScholarshipManager.sol";

/**
 * @title AchievementNFT
 * @dev Issues NFT badges for completed milestones and achievements
 */
contract AchievementNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    ScholarshipManager public immutable scholarshipManager;

    struct Achievement {
        uint256 scholarshipId;
        uint256 milestoneId;
        address scholar;
        string achievementType;
        uint256 timestamp;
    }

    mapping(uint256 => Achievement) public achievements;
    mapping(address => uint256[]) public userAchievements;

    event AchievementMinted(
        uint256 indexed tokenId,
        address indexed scholar,
        uint256 indexed scholarshipId,
        uint256 milestoneId
    );

    constructor(address _scholarshipManager) ERC721("EduImpact Achievement", "EDUA") Ownable(msg.sender) {
        scholarshipManager = ScholarshipManager(_scholarshipManager);
    }

    modifier onlyScholarshipManager() {
        require(msg.sender == address(scholarshipManager), "Not scholarship manager");
        _;
    }

    function mintAchievement(
        address to,
        uint256 scholarshipId,
        uint256 milestoneId,
        string memory achievementType,
        string memory tokenURI
    ) external onlyScholarshipManager returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        achievements[newTokenId] = Achievement({
            scholarshipId: scholarshipId,
            milestoneId: milestoneId,
            scholar: to,
            achievementType: achievementType,
            timestamp: block.timestamp
        });

        userAchievements[to].push(newTokenId);

        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        emit AchievementMinted(newTokenId, to, scholarshipId, milestoneId);
        return newTokenId;
    }

    function getUserAchievements(address user) external view returns (uint256[] memory) {
        return userAchievements[user];
    }

    function getAchievement(uint256 tokenId) external view returns (
        uint256 scholarshipId,
        uint256 milestoneId,
        address scholar,
        string memory achievementType,
        uint256 timestamp
    ) {
        Achievement memory achievement = achievements[tokenId];
        return (
            achievement.scholarshipId,
            achievement.milestoneId,
            achievement.scholar,
            achievement.achievementType,
            achievement.timestamp
        );
    }
} 