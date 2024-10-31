const path = require('path');
const fs = require('fs').promises;
const ResumeAnalysisService = require('../services/enhancedResumeService');
const { extractTextFromPDF } = require('../services/pdfService');
const { extractTextFromDOCX } = require('../services/docxService');
const User = require('../models/users.models');


//Handles resume upload, text extraction, analysis, and user profile update
 
const uploadAndScanResume = async (req, res) => {
  // Track the uploaded file path for cleanup
  let uploadedFilePath = null;

  try {
    // Validate request
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        success: false,
        message: 'User authentication required' 
      });
    }

    uploadedFilePath = req.file.path;

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ];

    if (!validTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        success: false,
        message: 'Unsupported file type. Please upload PDF or Word document' 
      });
    }

    // Extract text based on file type
    let resumeText;
    try {
      if (req.file.mimetype === 'application/pdf') {
        resumeText = await extractTextFromPDF(req.file.path);
      } else {
        resumeText = await extractTextFromDOCX(req.file.path);
      }

      if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
        throw new Error('No text content could be extracted from the file');
      }
    } catch (extractionError) {
      throw new Error(`Failed to extract text from file: ${extractionError.message}`);
    }

    // Prepare data for analysis
    const analysisData = {
      text: resumeText,
      id: req.user.id,
      filename: req.file.originalname,
      fileType: req.file.mimetype,
      uploadDate: new Date().toISOString()
    };

    // Perform enhanced analysis
    const analysis = await ResumeAnalysisService.analyzeResume(analysisData);

    // Generate a relative URL for the resume file
    const resumeUrl = path.relative(process.cwd(), req.file.path)
      .split(path.sep)
      .join('/');

    // Update user profile
    try {
      await User.findByIdAndUpdate(req.user.id, {
        resumeAnalysis: analysis,
        resumeText: resumeText,
        resumeUrl: resumeUrl,
        lastUpdated: new Date()
      }, { 
        new: true,
        runValidators: true 
      });
    } catch (dbError) {
      throw new Error(`Failed to update user profile: ${dbError.message}`);
    }

    // Prepare response with relevant analysis results
    const response = {
      success: true,
      message: 'Resume uploaded and analyzed successfully',
      analysis: {
        completenessScore: analysis.completenessScore,
        status: analysis.status,
        technicalSkills: analysis.technicalSkills?.found || [],
        softSkills: analysis.softSkills?.found || [],
        experience: {
          totalYears: analysis.experience?.totalYears || null,
          details: analysis.experience?.experiences || []
        },
        education: analysis.education || {
          highestDegree: null,
          degrees: []
        },
        metrics: analysis.basicMetrics || {}
      }
    };

    // Add warnings if any analysis components failed
    if (analysis.status === 'partial') {
      response.warnings = analysis.errors.map(error => ({
        component: error.component,
        message: error.message
      }));
    }

    res.status(200).json(response);

  } catch (error) {
    console.error('Error in uploadAndScanResume:', error);

    // Clean up uploaded file if there was an error
    if (uploadedFilePath) {
      try {
        await fs.unlink(uploadedFilePath);
      } catch (cleanupError) {
        console.error('Error cleaning up uploaded file:', cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      error: 'Failed to process resume',
      message: error.message
    });
  }
};


//Retrieves the latest resume analysis for a user
const getResumeAnalysis = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const user = await User.findById(req.user.id)
      .select('resumeAnalysis resumeUrl lastUpdated')
      .lean();

    if (!user || !user.resumeAnalysis) {
      return res.status(404).json({
        success: false,
        message: 'No resume analysis found for this user'
      });
    }

    res.status(200).json({
      success: true,
      analysis: user.resumeAnalysis,
      resumeUrl: user.resumeUrl,
      lastUpdated: user.lastUpdated
    });

  } catch (error) {
    console.error('Error in getResumeAnalysis:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve resume analysis',
      message: error.message
    });
  }
};

module.exports = {
  uploadAndScanResume,
  getResumeAnalysis
};