import { ethers } from "ethers";
import OpenCampusABI from "../config/OpenCampus.json";
import ScholarshipABI from "../config/Schloarship.json";
import {
  OpenChainAddress,
  ScholarshipsAddress,
} from "../config/contractAddress";
import { OCAuthSandbox } from "@opencampus/ocid-connect-js";

// Contract ABIs and addresses
export const SCHOLARSHIP_MANAGER_ABI = ScholarshipABI;
export const OPEN_CAMPUS_ID_ABI = OpenCampusABI;

export const SCHOLARSHIP_MANAGER_ADDRESS = ScholarshipsAddress;
export const OPEN_CAMPUS_ID_ADDRESS = OpenChainAddress;

// Open Campus Layer 3 Network Configuration
const OPEN_CAMPUS_NETWORK = {
  id: 656476,
  name: "Open Campus Layer 3",
  rpcUrl: "https://rpc.open-campus-codex.gelato.digital",
  nativeCurrency: {
    name: "EDU",
    symbol: "EDU",
    decimals: 18,
  },
};

let ocidAuth;
// Initialize OCID Connect in sandbox mode for development
if (typeof window !== "undefined") {
  ocidAuth = new OCAuthSandbox();
}

export { ocidAuth };

async function checkAndSwitchNetwork() {
  if (typeof window === "undefined") return;
  if (!window.ethereum) throw new Error("No crypto wallet found");

  const chainId = await window.ethereum.request({ method: "eth_chainId" });
  if (parseInt(chainId, 16) !== OPEN_CAMPUS_NETWORK.id) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${OPEN_CAMPUS_NETWORK.id.toString(16)}` }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${OPEN_CAMPUS_NETWORK.id.toString(16)}`,
              chainName: OPEN_CAMPUS_NETWORK.name,
              rpcUrls: [OPEN_CAMPUS_NETWORK.rpcUrl],
              nativeCurrency: OPEN_CAMPUS_NETWORK.nativeCurrency,
              blockExplorerUrls: ["https://opencampus-codex.blockscout.com/"],
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  }
}

export async function connectWallet() {
  if (typeof window === "undefined") return null;
  if (typeof window.ethereum === "undefined") {
    throw new Error("Please install MetaMask to use this application");
  }

  try {
    await checkAndSwitchNetwork();
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return { provider, signer };
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
}

export async function getProfile(address) {
  try {
    // First try to get the profile from OCID
    if (ocidAuth) {
      const authState = await ocidAuth.getAuthState();
      if (authState.isAuthenticated) {
        return {
          ocid: authState.OCId,
          ethAddress: authState.ethAddress,
          isActive: true,
          // Other fields will be populated from the contract
        };
      }
    }

    // Fallback to contract if OCID auth not available
    const { provider } = await connectWallet();
    const contract = new ethers.Contract(
      OPEN_CAMPUS_ID_ADDRESS,
      OPEN_CAMPUS_ID_ABI,
      provider
    );

    const profile = await contract.profiles(address);
    return {
      ocid: profile.ocid.toString(),
      ethAddress: profile.ethAddress,
      skills: profile.skills || [],
      reputation: profile.reputation.toString(),
      isActive: profile.isActive,
      eduBalance: ethers.formatUnits(profile.eduBalance || 0, 18),
      ocPoints: profile.ocPoints.toString(),
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
}

export async function hasActiveProfile(address) {
  try {
    // First check OCID auth state
    if (ocidAuth) {
      const authState = await ocidAuth.getAuthState();
      if (
        authState.isAuthenticated &&
        authState.ethAddress.toLowerCase() === address.toLowerCase()
      ) {
        return true;
      }
    }

    // Fallback to contract check
    const { provider } = await connectWallet();
    const contract = new ethers.Contract(
      OPEN_CAMPUS_ID_ADDRESS,
      OPEN_CAMPUS_ID_ABI,
      provider
    );

    const profile = await contract.profiles(address);
    return profile.isActive;
  } catch (error) {
    console.error("Error checking active profile:", error);
    throw error;
  }
}

export async function createScholarship(scholarshipDetails, milestones) {
  try {
    const { signer } = await connectWallet();
    const contract = new ethers.Contract(
      SCHOLARSHIP_MANAGER_ADDRESS,
      SCHOLARSHIP_MANAGER_ABI,
      signer
    );

    const deadline =
      Math.floor(Date.now() / 1000) +
      parseInt(scholarshipDetails.duration) * 7 * 24 * 60 * 60; // Convert weeks to timestamp

    const requiredSkills = scholarshipDetails.requiredSkills
      .split(",")
      .map((skill) => skill.trim());

    const difficultyLevel = parseInt(scholarshipDetails.difficultyLevel) || 1;

    // Format milestone data
    const milestoneTitles = milestones.map((m) => m.title);
    const milestoneDescriptions = milestones.map((m) => m.description);
    const milestoneRewards = milestones.map((m) =>
      ethers.parseUnits(m.reward.toString(), 18)
    );

    // Calculate total amount from rewards
    const totalAmount = milestoneRewards.reduce(
      (acc, reward) => acc + reward,
      BigInt(0)
    );

    console.log("Creating scholarship with params:", {
      title: scholarshipDetails.title,
      description: scholarshipDetails.description,
      category: scholarshipDetails.category,
      deadline,
      requiredSkills,
      difficultyLevel,
      milestoneTitles,
      milestoneDescriptions,
      milestoneRewards: milestoneRewards.map((r) => r.toString()),
      totalAmount: totalAmount.toString(),
    });

    const tx = await contract.createScholarship(
      scholarshipDetails.title,
      scholarshipDetails.description,
      scholarshipDetails.category,
      deadline,
      requiredSkills,
      difficultyLevel,
      milestoneTitles,
      milestoneDescriptions,
      milestoneRewards,
      { value: totalAmount }
    );

    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error creating scholarship:", error);
    throw error;
  }
}

export async function getScholarshipDetails(scholarshipId) {
  try {
    const { provider } = await connectWallet();
    const contract = new ethers.Contract(
      SCHOLARSHIP_MANAGER_ADDRESS,
      SCHOLARSHIP_MANAGER_ABI,
      provider
    );

    console.log("Fetching scholarship details for ID:", scholarshipId);

    try {
      const details = await contract.scholarships(scholarshipId);
      console.log("Raw scholarship details:", details);

      // Format the details
      const formatted = {
        id: scholarshipId,
        sponsor: details.sponsor,
        title: details.title,
        description: details.description,
        category: details.category,
        totalAmount: ethers.formatUnits(details.totalAmount, 18),
        remainingAmount: ethers.formatUnits(details.remainingAmount, 18),
        deadline: new Date(Number(details.deadline) * 1000),
        isActive: details.isActive,
        requiredSkills: details.requiredSkills,
        difficultyLevel: Number(details.difficultyLevel),
        totalMilestones: Number(details.totalMilestones),
        selectedScholars: details.selectedScholars || [],
      };

      console.log("Formatted scholarship details:", formatted);
      return formatted;
    } catch (error) {
      console.log("Scholarship not found or error:", error);
      return null;
    }
  } catch (error) {
    console.error("Error fetching scholarship details:", error);
    throw error;
  }
}

export async function getMilestone(scholarshipId, milestoneId) {
  try {
    const { provider } = await connectWallet();
    const contract = new ethers.Contract(
      SCHOLARSHIP_MANAGER_ADDRESS,
      SCHOLARSHIP_MANAGER_ABI,
      provider
    );
    const milestone = await contract.getMilestone(scholarshipId, milestoneId);

    return {
      title: milestone.title,
      description: milestone.description,
      reward: ethers.formatUnits(milestone.reward, 18),
      isCompleted: milestone.isCompleted,
      isVerified: milestone.isVerified,
      proofIpfsHash: milestone.proofIpfsHash,
    };
  } catch (error) {
    console.error("Error fetching milestone:", error);
    throw error;
  }
}

export async function submitMilestone(
  scholarshipId,
  milestoneId,
  proofIpfsHash
) {
  try {
    const { signer } = await connectWallet();
    const contract = new ethers.Contract(
      SCHOLARSHIP_MANAGER_ADDRESS,
      SCHOLARSHIP_MANAGER_ABI,
      signer
    );

    const tx = await contract.submitMilestone(
      scholarshipId,
      milestoneId,
      proofIpfsHash
    );
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error submitting milestone:", error);
    throw error;
  }
}

export async function verifyMilestone(
  scholarshipId,
  milestoneId,
  scholarAddress
) {
  try {
    const { signer } = await connectWallet();
    const contract = new ethers.Contract(
      SCHOLARSHIP_MANAGER_ADDRESS,
      SCHOLARSHIP_MANAGER_ABI,
      signer
    );

    const tx = await contract.verifyMilestone(
      scholarshipId,
      milestoneId,
      scholarAddress
    );
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error verifying milestone:", error);
    throw error;
  }
}

export async function applyForScholarship(scholarshipId) {
  try {
    const { signer } = await connectWallet();
    const contract = new ethers.Contract(
      SCHOLARSHIP_MANAGER_ADDRESS,
      SCHOLARSHIP_MANAGER_ABI,
      signer
    );

    const tx = await contract.applyForScholarship(scholarshipId);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error applying for scholarship:", error);
    throw error;
  }
}
