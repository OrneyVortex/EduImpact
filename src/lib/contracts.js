import { ethers } from "ethers";

// Contract ABIs will be imported here after deployment
const SCHOLARSHIP_MANAGER_ABI = [];
const OPEN_CAMPUS_ID_ABI = [];

// Contract addresses will be set after deployment
const SCHOLARSHIP_MANAGER_ADDRESS = "";
const OPEN_CAMPUS_ID_ADDRESS = "";

export async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    throw new Error("Please install MetaMask to use this application");
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return { provider, signer };
  } catch (error) {
    console.error("Error connecting to wallet:", error);
    throw error;
  }
}

export async function getScholarshipManagerContract(signer) {
  return new ethers.Contract(
    SCHOLARSHIP_MANAGER_ADDRESS,
    SCHOLARSHIP_MANAGER_ABI,
    signer
  );
}

export async function getOpenCampusIDContract(signer) {
  return new ethers.Contract(
    OPEN_CAMPUS_ID_ADDRESS,
    OPEN_CAMPUS_ID_ABI,
    signer
  );
}

export async function createScholarship(scholarshipDetails, milestones) {
  try {
    const { signer } = await connectWallet();
    const contract = await getScholarshipManagerContract(signer);

    const tx = await contract.createScholarship(
      scholarshipDetails.title,
      scholarshipDetails.description,
      ethers.utils.parseEther(scholarshipDetails.amount),
      scholarshipDetails.category,
      scholarshipDetails.requiredSkills.split(",").map((skill) => skill.trim()),
      parseInt(scholarshipDetails.duration),
      parseInt(scholarshipDetails.maxParticipants),
      milestones.map((milestone) => ({
        title: milestone.title,
        description: milestone.description,
        reward: ethers.utils.parseEther(milestone.reward),
        deadline: new Date(milestone.deadline).getTime() / 1000,
        proofRequirements: milestone.proofRequirements,
      })),
      { value: ethers.utils.parseEther(scholarshipDetails.amount) }
    );

    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error creating scholarship:", error);
    throw error;
  }
}

export async function getActiveScholarships() {
  try {
    const { provider } = await connectWallet();
    const contract = await getScholarshipManagerContract(provider);
    const scholarships = await contract.getActiveScholarships();

    return scholarships.map((scholarship) => ({
      id: scholarship.id.toString(),
      title: scholarship.title,
      description: scholarship.description,
      amount: ethers.utils.formatEther(scholarship.amount),
      remainingAmount: ethers.utils.formatEther(scholarship.remainingAmount),
      category: scholarship.category,
      requiredSkills: scholarship.requiredSkills,
      duration: scholarship.duration.toString(),
      maxParticipants: scholarship.maxParticipants.toString(),
      currentParticipants: scholarship.currentParticipants.toString(),
      sponsor: scholarship.sponsor,
      isActive: scholarship.isActive,
      milestones: scholarship.milestones.map((milestone) => ({
        id: milestone.id.toString(),
        title: milestone.title,
        description: milestone.description,
        reward: ethers.utils.formatEther(milestone.reward),
        deadline: new Date(milestone.deadline * 1000).toISOString(),
        proofRequirements: milestone.proofRequirements,
        isCompleted: milestone.isCompleted,
      })),
    }));
  } catch (error) {
    console.error("Error fetching active scholarships:", error);
    throw error;
  }
}

export async function getSponsorScholarships(sponsorAddress) {
  try {
    const { provider } = await connectWallet();
    const contract = await getScholarshipManagerContract(provider);
    const scholarships = await contract.getSponsorScholarships(sponsorAddress);

    return scholarships.map((scholarship) => ({
      id: scholarship.id.toString(),
      title: scholarship.title,
      description: scholarship.description,
      amount: ethers.utils.formatEther(scholarship.amount),
      remainingAmount: ethers.utils.formatEther(scholarship.remainingAmount),
      category: scholarship.category,
      requiredSkills: scholarship.requiredSkills,
      duration: scholarship.duration.toString(),
      maxParticipants: scholarship.maxParticipants.toString(),
      currentParticipants: scholarship.currentParticipants.toString(),
      sponsor: scholarship.sponsor,
      isActive: scholarship.isActive,
      milestones: scholarship.milestones.map((milestone) => ({
        id: milestone.id.toString(),
        title: milestone.title,
        description: milestone.description,
        reward: ethers.utils.formatEther(milestone.reward),
        deadline: new Date(milestone.deadline * 1000).toISOString(),
        proofRequirements: milestone.proofRequirements,
        isCompleted: milestone.isCompleted,
      })),
    }));
  } catch (error) {
    console.error("Error fetching sponsor scholarships:", error);
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
    const contract = await getScholarshipManagerContract(signer);

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

export async function getScholarProfile(address) {
  try {
    const { provider } = await connectWallet();
    const contract = await getOpenCampusIDContract(provider);

    const profile = await contract.getProfile(address);
    return {
      address: profile.userAddress,
      reputation: profile.reputation.toString(),
      skills: profile.skills,
      completedMilestones: profile.completedMilestones.toString(),
      activeScholarships: profile.activeScholarships.toString(),
    };
  } catch (error) {
    console.error("Error fetching scholar profile:", error);
    throw error;
  }
}

export async function updateScholarshipStatus(scholarshipId, isActive) {
  try {
    const { signer } = await connectWallet();
    const contract = await getScholarshipManagerContract(signer);

    const tx = await contract.updateScholarshipStatus(scholarshipId, isActive);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error updating scholarship status:", error);
    throw error;
  }
}

export async function withdrawRemainingFunds(scholarshipId) {
  try {
    const { signer } = await connectWallet();
    const contract = await getScholarshipManagerContract(signer);

    const tx = await contract.withdrawRemainingFunds(scholarshipId);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error("Error withdrawing remaining funds:", error);
    throw error;
  }
}
