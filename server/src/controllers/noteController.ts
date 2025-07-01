import { Request, Response } from "express";
import Note from "@/models/notes";
import axios from "axios";
import { HttpCode } from "../utils/constants";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export class NoteController {
  // Get all notes for a user
  public getNotes = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const userId = req.userId || (req.headers["x-user-id"] as string);

      if (!userId) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "User ID is required",
        });
        return;
      }

      const notes = await Note.find({ userId });
      res.status(HttpCode.OK).json({
        success: true,
        data: notes,
        message: "Notes retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve notes");
    }
  };

  // Get a note by ID (with user validation)
  public getNoteById = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.userId || (req.headers["x-user-id"] as string);

      if (!id || !userId) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Note ID and User ID are required",
        });
        return;
      }

      const note = await Note.findOne({ _id: id, userId });
      if (!note) {
        res.status(HttpCode.NOT_FOUND).json({
          success: false,
          message: "Note not found",
        });
        return;
      }

      res.status(HttpCode.OK).json({
        success: true,
        data: note,
        message: "Note retrieved successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to retrieve note");
    }
  };

  // Create a new note
  public createNote = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { title, content, position } = req.body;
      const userId = req.userId || (req.headers["x-user-id"] as string);

      if (!title || !content || !userId) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Title, content, and user ID are required",
        });
        return;
      }

      const newNote = new Note({
        title,
        content,
        position: position || { x: 0, y: 0 },
        userId,
      });

      const savedNote = await newNote.save();
      res.status(HttpCode.CREATED).json({
        success: true,
        data: savedNote,
        message: "Note created successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to create note");
    }
  };

  // Update a note
  public updateNote = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, content, position } = req.body;
      const userId = req.userId || (req.headers["x-user-id"] as string);

      if (!id || !userId) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Note ID and User ID are required",
        });
        return;
      }

      const note = await Note.findOne({ _id: id, userId });
      if (!note) {
        res.status(HttpCode.NOT_FOUND).json({
          success: false,
          message: "Note not found",
        });
        return;
      }

      if (title) note.title = title;
      if (content) note.content = content;
      if (position) note.position = position;
      note.updatedAt = new Date();

      const updatedNote = await note.save();

      res.status(HttpCode.OK).json({
        success: true,
        data: updatedNote,
        message: "Note updated successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to update note");
    }
  };

  // Delete a note
  public deleteNote = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.userId || (req.headers["x-user-id"] as string);

      if (!id || !userId) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Note ID and User ID are required",
        });
        return;
      }

      const note = await Note.findOne({ _id: id, userId });
      if (!note) {
        res.status(HttpCode.NOT_FOUND).json({
          success: false,
          message: "Note not found",
        });
        return;
      }

      await Note.findByIdAndDelete(id);

      res.status(HttpCode.OK).json({
        success: true,
        message: "Note deleted successfully",
      });
    } catch (error) {
      this.handleError(res, error, "Failed to delete note");
    }
  };

  // Enhance note using AI
  public enhanceNote = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { promptType } = req.body;
      const userId = req.userId || (req.headers["x-user-id"] as string);

      if (!id || !promptType || !userId) {
        res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Note ID, prompt type, and user ID are required",
        });
        return;
      }

      const note = await Note.findOne({ _id: id, userId });
      if (!note) {
        res.status(HttpCode.NOT_FOUND).json({
          success: false,
          message: "Note not found",
        });
        return;
      }

      // Pre-check if content is enhanceable
      const contentAnalysis = this.analyzeContentEnhanceability(note.content);
      if (!contentAnalysis.isEnhanceable) {
        res.status(HttpCode.OK).json({
          success: true,
          type: "suggestion",
          originalNote: note,
          suggestion: contentAnalysis.reason,
          message: "Content needs improvement before enhancement",
        });
        return;
      }

      let aiPrompt: string;
      switch (promptType) {
        case "improve grammar":
          aiPrompt = `Please improve the grammar and style of this text. Return ONLY the improved version without any explanations or commentary: "${note.content}"`;
          break;
        case "summarize":
          aiPrompt = `Please create a concise summary of this text. Return ONLY the summary without any explanations or commentary: "${note.content}"`;
          break;
        case "expand":
          aiPrompt = `Please expand this text with more details and context. Return ONLY the expanded version without any explanations or commentary: "${note.content}"`;
          break;
        default:
          res.status(HttpCode.BAD_REQUEST).json({
            success: false,
            message: "Invalid prompt type",
          });
          return;
      }

      const aiResponse: any = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "deepseek/deepseek-r1:free",
          messages: [{ role: "user", content: aiPrompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );


      const aiContent = aiResponse.data.choices[0].message.content;

      // Analyze if the AI response is enhancement or suggestion
      const enhancementResult = this.analyzeAIResponse(
        aiContent,
        note.content,
        promptType
      );


      if (enhancementResult.isEnhanced) {
        note.content = enhancementResult.enhancedContent as any;
        note.updatedAt = new Date();
        const updatedNote = await note.save();

        res.status(HttpCode.OK).json({
          success: true,
          type: "enhanced",
          data: updatedNote,
          message: "Note enhanced successfully",
        });
      } else {
        res.status(HttpCode.OK).json({
          success: true,
          type: "suggestion",
          originalNote: note,
          suggestion: enhancementResult.suggestion,
          message: "AI provided suggestions for improvement",
        });
      }
    } catch (error) {
      this.handleError(res, error, "Failed to enhance note");
    }
  };

  // Helper method to analyze content enhanceability
  private analyzeContentEnhanceability = (
    content: string
  ): { isEnhanceable: boolean; reason?: string } => {
    const trimmedContent = content.trim();

    // Checking minimum length
    if (trimmedContent.length < 10) {
      return {
        isEnhanceable: false,
        reason:
          "Content is too short to enhance meaningfully. Please add more text (at least 10 characters).",
      };
    }

    // Check for repetitive characters
    const hasRepeatingChars = /(.)\1{4,}/.test(trimmedContent);
    if (hasRepeatingChars) {
      return {
        isEnhanceable: false,
        reason:
          "Content contains repetitive characters. Please provide meaningful text.",
      };
    }

    // Check for random short words
    const isRandomShortText =
      /^[a-zA-Z]{1,6}$/.test(trimmedContent) &&
      !this.isValidWord(trimmedContent);
    if (isRandomShortText) {
      return {
        isEnhanceable: false,
        reason:
          "Content appears to be random characters. Please provide meaningful text to enhance.",
      };
    }

    // Check for only numbers or special characters
    const isOnlyNumbersOrSpecial = /^[0-9\s\W]+$/.test(trimmedContent);
    if (isOnlyNumbersOrSpecial) {
      return {
        isEnhanceable: false,
        reason:
          "Content contains only numbers or special characters. Please provide text content.",
      };
    }

    return { isEnhanceable: true };
  };

  // Helper method to check if a word is valid (basic dictionary check)
  private isValidWord = (word: string): boolean => {
    const commonWords = [
      "the",
      "and",
      "is",
      "to",
      "for",
      "of",
      "in",
      "on",
      "at",
      "with",
      "by",
      "from",
      "as",
      "an",
      "be",
      "or",
      "are",
      "was",
      "but",
      "not",
      "have",
      "had",
      "has",
      "will",
      "would",
      "could",
      "should",
      "can",
      "may",
      "might",
      "must",
      "shall",
      "do",
      "does",
      "did",
      "get",
      "got",
      "go",
      "went",
      "come",
      "came",
      "see",
      "saw",
      "know",
      "knew",
      "think",
      "thought",
      "say",
      "said",
      "tell",
      "told",
      "ask",
      "work",
      "play",
      "run",
      "walk",
      "talk",
      "look",
      "find",
      "give",
      "take",
      "make",
    ];

    return commonWords.includes(word.toLowerCase()) || word.length > 6;
  };

  // Helper method do tto analyze AI response
  private analyzeAIResponse = (
    aiResponse: string,
    originalContent: string,
    promptType: string
  ): { isEnhanced: boolean; enhancedContent?: string; suggestion?: string } => {
    const suggestionPatterns = [
      /does not convey coherent meaning/i,
      /difficult to interpret/i,
      /impossible given the absence/i,
      /consider the following actions/i,
      /verify spelling/i,
      /provide context/i,
      /clarify format/i,
      /this could stem from/i,
      /may be a misspelling/i,
      /might be a random/i,
      /could represent an acronym/i,
      /a summary.+is impossible/i,
      /upon receiving corrected/i,
      /feel free to elaborate/i,
      /please provide/i,
      /need more context/i,
      /unclear what you mean/i,
      /could you clarify/i,
      /appears to be/i,
      /seems to be/i,
      /looks like/i,
      /unable to enhance/i,
      /cannot enhance/i,
      /cannot improve/i,
      /cannot summarize/i,
      /cannot expand/i,
      /not enough content/i,
      /insufficient content/i,
      /too short to/i,
      /too brief to/i,
      /requires more/i,
      /needs more/i,
    ];

    // Checking  if response contains suggestion patterns
    const containsSuggestions = suggestionPatterns.some((pattern) =>
      pattern.test(aiResponse)
    );

    // Checkinggs if the response is asking questions or giving instructions
    const containsQuestions =
      /\?/.test(aiResponse) && aiResponse.split("?").length > 2;
    const containsInstructions =
      /please|try to|you should|you could|i recommend/i.test(aiResponse);

    // Checking if response contains meta-commentary about the original text
    const containsMetaCommentary =
      /the term|this text|this input|such inputs|this usage|the content|the phrase|the word/i.test(
        aiResponse
      );

    // Check length ratios based on prompt type
    let suspiciousLengthRatio = false;
    switch (promptType) {
      case "summarize":
        // Summary should be shorter or similar length, not much longer
        suspiciousLengthRatio = aiResponse.length > originalContent.length * 2;
        break;
      case "improve grammar":
        // Grammar improvement should be similar length, not drastically different
        suspiciousLengthRatio = aiResponse.length > originalContent.length * 3;
        break;
      case "expand":
        // Expansion can be longer, but not if it's mostly explanation
        suspiciousLengthRatio = aiResponse.length > originalContent.length * 5;
        break;
      default:
        suspiciousLengthRatio = aiResponse.length > originalContent.length * 3;
    }

    // Check if response starts with explanatory phrases
    const startsWithExplanation =
      /^(the|this|here|i|unfortunately|it appears|it seems|the term|the text)/i.test(
        aiResponse.trim()
      );

    // Determine if this is a suggestion vs enhancement
    const isSuggestion =
      containsSuggestions ||
      (containsMetaCommentary && suspiciousLengthRatio) ||
      (containsQuestions && containsInstructions) ||
      (startsWithExplanation && suspiciousLengthRatio);

    if (isSuggestion) {
      return {
        isEnhanced: false,
        suggestion: aiResponse,
      };
    } else {
      // Additional validation for actual enhancement
      const trimmedResponse = aiResponse.trim();

      // Removing common AI prefixes/suffixes if they exist
      const cleanedResponse = this.cleanAIResponse(trimmedResponse);

      return {
        isEnhanced: true,
        enhancedContent: cleanedResponse,
      };
    }
  };

  // Helper method to clean AI response from common prefixes/suffixes
  private cleanAIResponse = (response: string): string => {
    let cleaned = response.trim();

    // Remove common AI prefixes
    const prefixPatterns = [
      /^here is the improved version:?\s*/i,
      /^here is the enhanced text:?\s*/i,
      /^improved version:?\s*/i,
      /^enhanced text:?\s*/i,
      /^corrected text:?\s*/i,
      /^here's the improved text:?\s*/i,
      /^here's the enhanced version:?\s*/i,
    ];

    prefixPatterns.forEach((pattern) => {
      cleaned = cleaned.replace(pattern, "");
    });

    // Remove quotes if the entire content is wrapped in quotes
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = cleaned.slice(1, -1);
    }
    if (cleaned.startsWith("'") && cleaned.endsWith("'")) {
      cleaned = cleaned.slice(1, -1);
    }

    return cleaned.trim();
  };
  // Handle errors consistently
  private handleError(res: Response, error: any, message: string): void {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message,
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
}
