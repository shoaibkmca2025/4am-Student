import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import UserAssessment from '../models/UserAssessment.js';

const router = express.Router();

// Static Roadmap Definition (could be moved to a DB model later)
const FULL_STACK_ROADMAP = [
  {
    id: 1,
    title: 'Frontend Fundamentals',
    skills: ['HTML', 'CSS', 'JavaScript'],
    relatedAssessmentIds: [1, 2], // IDs of assessments that count towards this (e.g., HTML/CSS, JS)
    description: 'Master the building blocks of the web.'
  },
  {
    id: 2,
    title: 'React & State Management',
    skills: ['React', 'Redux', 'Hooks'],
    relatedAssessmentIds: [3], // React assessment
    description: 'Build dynamic user interfaces with modern React.'
  },
  {
    id: 3,
    title: 'Backend Basics',
    skills: ['Node.js', 'Express', 'API Design'],
    relatedAssessmentIds: [4], // Node.js assessment
    description: 'Create robust server-side applications.'
  },
  {
    id: 4,
    title: 'Database Management',
    skills: ['MongoDB', 'Mongoose', 'SQL'],
    relatedAssessmentIds: [5], // Database assessment
    description: 'Design and optimize data storage solutions.'
  }
];

// @desc    Get user's career path progress
// @route   GET /api/career-path
// @access  Private
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // Fetch all completed assessments for this user
    const userAssessments = await UserAssessment.find({ userId });
    
    // Create a map of completed assessment IDs for quick lookup
    const completedAssessmentIds = new Set(
      userAssessments
        .filter(ua => ua.status === 'Completed' && parseInt(ua.score, 10) >= 70) // Assume 70% is passing
        .map(ua => ua.assessmentId)
    );

    // Calculate status for each roadmap step
    let isPreviousStepCompleted = true; // First step is always accessible

    const roadmap = FULL_STACK_ROADMAP.map(step => {
      // Check if any of the related assessments are completed
      // For strict mode, we might require ALL, but for now let's say ANY
      const isStepCompleted = step.relatedAssessmentIds.some(id => completedAssessmentIds.has(id));
      
      let status = 'Locked';
      let progress = 0;

      if (isStepCompleted) {
        status = 'Completed';
        progress = 100;
      } else if (isPreviousStepCompleted) {
        status = 'In Progress';
        // Calculate partial progress? (if multiple assessments required)
        progress = 0; 
      }

      // Update previous step status for next iteration
      // If this step is NOT completed, the next one will be locked (unless we want to allow skipping)
      // But we set isPreviousStepCompleted based on THIS step's completion for the NEXT step.
      const currentStepCompleted = isStepCompleted;
      
      // Look ahead: if the user hasn't completed this step, can they start the next?
      // Usually no. So we update the flag.
      isPreviousStepCompleted = currentStepCompleted;

      return {
        ...step,
        status,
        progress
      };
    });

    res.json({ roadmap });
  } catch (err) {
    next(err);
  }
});

export default router;
