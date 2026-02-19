import dotenv from "dotenv";
import cloudinary from "cloudinary";
import multer from "multer";
import Sprint from "../models/sprintModel.js"; // Assuming the Sprint model exists
import Task from "../models/taskModel.js"; // Assuming the Sprint model exists
import Refine from "../models/refineModel.js"; // Assuming the Refine model exists
import { S3Client } from "@aws-sdk/client-s3";
import mongoose from "mongoose";
import multerS3 from "multer-s3";
import calendar from "../utils/googleCalendarService.js"; // Import calendar service
import { google } from "googleapis";
import User from "../models/userModel.js";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALENDAR_REDIRECT_URI
);

/**
 * Create a Google Calendar event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
dotenv.config();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

// Create a sprint
// export const createSprint = async (req, res) => {
//   const { day, activity, refineId } = req.body;
//   console.log(req.body); // Check the fields in the body
//   console.log(req.file); // Check if the file is coming through correctly

//   // Validate all required fields
//   if (!day || !activity || !refineId) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   // Validate refineId before querying the database
//   if (!mongoose.Types.ObjectId.isValid(refineId)) {
//     return res.status(400).json({ message: "Invalid Refine ID" });
//   }

//   try {
//     // Check if the refine exists
//     const refine = await Refine.findById(refineId);
//     if (!refine) {
//       return res.status(404).json({ message: "Refine not found" });
//     }

//     // Create the sprint
//     const sprint = await Sprint.create({
//       day,
//       activity,
//       refineId,
//       createdBy: req.user.userId, // Ensure `req.user.userId` is populated by the auth middleware
//     });

//     res.status(201).json({
//       message: "Sprint created successfully",
//       sprint,
//     });
//   } catch (error) {
//     console.error("Error creating sprint:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
// Create a sprint
export const createSprint = async (req, res) => {
  const { day, activity, refineId, tasks } = req.body; // Tasks will be added in the request body
  console.log(req.body); // Check the fields in the body

  // Validate all required fields
  if (!day || !activity || !refineId || !tasks || tasks.length === 0) {
    return res.status(400).json({
      message: "All fields are required and tasks should not be empty",
    });
  }

  // Validate refineId before querying the database
  if (!mongoose.Types.ObjectId.isValid(refineId)) {
    return res.status(400).json({ message: "Invalid Refine ID" });
  }

  try {
    // Check if the refine exists
    const refine = await Refine.findById(refineId);
    if (!refine) {
      return res.status(404).json({ message: "Refine not found" });
    }

    // Create the sprint
    const sprint = await Sprint.create({
      day,
      activity,
      refineId,
      tasks: tasks, // Store the tasks for the specific day
      createdBy: req.user.userId,
    });

    res.status(201).json({
      message: "Sprint created successfully",
      sprint,
    });
  } catch (error) {
    console.error("Error creating sprint:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getTask = async (req, res) => {
  const { activity } = req.query; // You can send the activity as a query parameter

  console.log("Activity:", activity); // Log the activity value

  if (!activity) {
    return res.status(400).json({ message: "Activity is required" });
  }

  try {
    // Find tasks by user and activity
    const tasks = await Task.find({
      createdBy: req.user.userId,

      activity: activity, // Filter by activity
    }).sort({ day: 1 }); // Optionally, sort by day

    console.log("Tasks found:", tasks); // Log the tasks retrieved

    if (tasks.length === 0) {
      return res
        .status(404)
        .json({ message: "No tasks found for this activity" });
    }

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// export const saveTask = async (req, res) => {
//   const { title, day, activities, status } = req.body; // Destructure 'status' along with other fields

//   // Log the received data to check if it's being sent correctly
//   console.log("Received task data:", req.body); // Debugging line

//   if (!title || !day || !activities) {
//     return res
//       .status(400)
//       .json({ message: "Title, day, and activities are required" });
//   }

//   try {
//     // If status is not provided, it will default to 'todo' (as per the schema)
//     const newTask = await Task.create({
//       title,
//       day,
//       activity: activities,
//       createdBy: req.user.userId, // Assuming authentication middleware sets userId
//       status: status || "todo", // Use the status provided or default to 'todo'
//     });

//     res.status(201).json({ message: "Task saved successfully", task: newTask });
//   } catch (error) {
//     console.error("Error saving task:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
export const saveTask = async (req, res) => {
  const { title, day, activities, status } = req.body;

  console.log("Received task data:", req.body);

  if (!title || !day || !activities) {
    return res
      .status(400)
      .json({ message: "Title, day, and activities are required" });
  }

  try {
    // Save the task in the database
    const newTask = await Task.create({
      title,
      day,
      activity: activities,
      createdBy: req.user.userId,

      status: status || "todo",
    });

    // Create a Google Calendar event
    const event = {
      summary: title,
      description: `Task: ${title}`,
      start: {
        dateTime: new Date(day).toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: new Date(
          new Date(day).getTime() + 60 * 60 * 1000 // 1-hour duration
        ).toISOString(),
        timeZone: "UTC",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 120 }, // 2 hours before
        ],
      },
    };

    await calendar.events.insert({
      calendarId: "primary", // User's primary calendar
      resource: event,
    });

    res.status(201).json({
      message: "Task saved successfully and reminder set",
      task: newTask,
    });
  } catch (error) {
    console.error("Error saving task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// export const createCalendarEvent = async (req, res) => {
//   const { userId } = req.user; // Use userId from JWT to identify the user
//   const { title, description, startTime, endTime } = req.body;

//   if (!title || !startTime || !endTime) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     // Retrieve the user's Google tokens from the database
//     const user = await User.findById(userId);

//     if (!user || !user.accessToken || !user.refreshToken) {
//       return res
//         .status(400)
//         .json({ message: "Google tokens are not set for this user" });
//     }

//     const { accessToken, refreshToken } = user; // Get tokens from the user

//     // Set OAuth2 client credentials
//     oauth2Client.setCredentials({
//       access_token: accessToken,
//       refresh_token: refreshToken,
//     });

//     // Manually check if the access token is expired
//     const currentTime = Date.now();
//     if (oauth2Client.credentials.expiry_date <= currentTime) {
//       try {
//         const { credentials } = await oauth2Client.refreshAccessToken();
//         oauth2Client.setCredentials(credentials);
//         console.log("Access token refreshed");
//       } catch (error) {
//         console.error("Failed to refresh access token:", error);
//         return res.status(500).json({
//           message: "Failed to refresh access token",
//           error: error.message,
//         });
//       }
//     }

//     const calendar = google.calendar({ version: "v3", auth: oauth2Client });

//     const event = {
//       summary: title,
//       description: description || "No description provided",
//       start: {
//         dateTime: new Date(startTime).toISOString(),
//         timeZone: "UTC",
//       },
//       end: {
//         dateTime: new Date(endTime).toISOString(),
//         timeZone: "UTC",
//       },
//       reminders: {
//         useDefault: false,
//         overrides: [
//           { method: "popup", minutes: 120 }, // Notify 2 hours before
//           { method: "popup", minutes: 0 }, // Notify at the time of the event
//         ],
//       },
//     };

//     // Insert the event into Google Calendar
//     const response = await calendar.events.insert({
//       calendarId: "primary", // Use user's primary calendar
//       resource: event,
//     });

//     res.status(201).json({
//       message: "Google Calendar event created successfully",
//       event: response.data,
//     });
//   } catch (error) {
//     console.error("Error creating Google Calendar event:", error);

//     // Handle token refresh if needed
//     if (error.code === 401) {
//       // Unauthorized error, likely due to expired access token
//       try {
//         const { credentials } = await oauth2Client.refreshAccessToken();
//         oauth2Client.setCredentials(credentials);

//         // Retry event creation after refreshing token
//         const calendar = google.calendar({ version: "v3", auth: oauth2Client });

//         const event = {
//           summary: title,
//           description: description || "No description provided",
//           start: {
//             dateTime: new Date(startTime).toISOString(),
//             timeZone: "UTC",
//           },
//           end: {
//             dateTime: new Date(endTime).toISOString(),
//             timeZone: "UTC",
//           },
//           reminders: {
//             useDefault: false,
//             overrides: [
//               { method: "popup", minutes: 120 }, // Notify 2 hours before
//               { method: "popup", minutes: 0 }, // Notify at the time of the event
//             ],
//           },
//         };

//         const response = await calendar.events.insert({
//           calendarId: "primary", // Use user's primary calendar
//           resource: event,
//         });

//         res.status(201).json({
//           message:
//             "Google Calendar event created successfully after token refresh",
//           event: response.data,
//         });
//       } catch (refreshError) {
//         console.error("Failed to refresh access token:", refreshError);
//         res.status(500).json({
//           message: "Failed to refresh access token",
//           error: refreshError.message,
//         });
//       }
//     } else {
//       res.status(500).json({
//         message: "Failed to create Google Calendar event",
//         error: error.message,
//       });
//     }
//   }
// };

export const createCalendarEvent = async (req, res) => {
  const { _id } = req.user;
  const userId = _id; // Assign _id to userId
  console.log("req.user:", req.user);
  console.log("Extracted userId:", userId);

  const { title, description, startTime, endTime } = req.body;

  if (!title || !startTime || !endTime) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Retrieve the user's Google tokens from the database
    const user = await User.findById(userId);

    if (!user || !user.accessToken || !user.refreshToken) {
      console.error("Google tokens are not set for this user");
      return res
        .status(400)
        .json({ message: "Google tokens are not set for this user" });
    }

    const { accessToken, refreshToken } = user; // Get tokens from the user

    // Log the tokens to ensure they're correct
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    // Set OAuth2 client credentials
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALENDAR_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Check if the access token is expired manually by comparing with expiry_date
    const tokenExpiryDate = oauth2Client.credentials.expiry_date;
    const currentTime = Date.now();

    // If the token is expired or about to expire, refresh it
    if (tokenExpiryDate && tokenExpiryDate <= currentTime) {
      try {
        console.log("Access token expired, attempting to refresh...");

        // Refresh the token
        const { credentials } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(credentials);
        console.log("Access token refreshed");
      } catch (error) {
        // Log the detailed error response from Google
        console.error(
          "Failed to refresh access token:",
          error.response ? error.response.data : error.message
        );
        return res.status(500).json({
          message: "Failed to refresh access token",
          error: error.response ? error.response.data : error.message,
        });
      }
    }

    // Create the Google Calendar event
    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary: title,
      description: description || "No description provided",
      start: {
        dateTime: new Date(startTime).toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: new Date(endTime).toISOString(),
        timeZone: "UTC",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 120 }, // Notify 2 hours before
          { method: "popup", minutes: 0 }, // Notify at the time of the event
        ],
      },
    };

    // Insert the event into Google Calendar
    const response = await calendar.events.insert({
      calendarId: "primary", // Use user's primary calendar
      resource: event,
    });

    res.status(201).json({
      message: "Google Calendar event created successfully",
      event: response.data,
    });
  } catch (error) {
    // Log the full error response for debugging
    console.error(
      "Error creating Google Calendar event:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      message: "Failed to create Google Calendar event",
      error: error.response ? error.response.data : error.message,
    });
  }
};
export const editTask = async (req, res) => {
  const { id } = req.params; // Get the task ID from the route parameters
  const { title, day, activities } = req.body; // Destructure the updated fields from the request body

  // Validate that at least one field is provided (title or day)
  if (!title && !day) {
    return res.status(400).json({ message: "Either title or day is required" });
  }

  try {
    // Find the task by ID and update it, only updating provided fields
    const updatedTask = await Task.findByIdAndUpdate(
      id, // Task ID
      {
        ...(title && { title }), // Only update title if provided
        ...(day && { day }), // Only update day if provided
        // We are leaving activities and archived alone for now
      },
      { new: true } // Return the updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    // Find the task by ID
    const task = await Task.findById(taskId);

    // If task not found, return 404 error
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update the task's status
    task.status = status;
    await task.save();

    // Return success response
    res.status(200).json({ message: "Task status updated successfully" });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task" });
  }
};

export const archiveTask = async (req, res) => {
  const taskId = req.params.id; // Get the task ID from URL params
  const { archived } = req.body; // Get the 'archived' status from the request body
  console.log("Task ID:", taskId); // Ensure you're receiving the correct task ID
  console.log("Request Body:", req.body); // Check if 'archived' status is coming through

  try {
    // Update the task by setting the archived field
    const task = await Task.findByIdAndUpdate(
      taskId,
      { archived }, // Update the archived field
      { new: true } // Return the updated task
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Successfully archived task
    res.status(200).json({ message: "Task archived successfully", task });
  } catch (error) {
    console.error("Error archiving task:", error);
    res
      .status(500)
      .json({ message: "Error archiving task", error: error.message });
  }
};

// GET API to fetch all sprints by activity
export const getSprintsByActivity = async (req, res) => {
  const { activities } = req.query;
  const decodedActivities = decodeURIComponent(activities); // Decode activity name if needed

  try {
    // Fetch sprints related to the decoded activity
    const sprints = await Sprint.find({ activity: decodedActivities }).populate(
      "refineId"
    );
    if (sprints.length === 0) {
      return res
        .status(404)
        .json({ message: "No sprints found for this activity" });
    }

    res.status(200).json({
      message: "Sprints fetched successfully",
      sprints,
    });
  } catch (error) {
    console.error("Error fetching sprints:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getSprintByRefineTitlt = async (req, res) => {
  try {
    const { activities } = req.query;

    if (!activities) {
      return res.status(400).json({ message: "Activities is required" });
    }

    // Step 1: Find the refine document by activities
    const refine = await Refine.findOne({ activities }); // Fixed field name

    if (!refine) {
      return res.status(404).json({ message: "Refine not found" });
    }

    // Step 2: Use the refineId to find related sprints
    const sprints = await Sprint.find({ refineId: refine._id })
      .populate("refineId", "activities") // Adjusted field to match database structure
      .sort({ createdAt: -1 });

    // Step 3: Return the data
    res.status(200).json({
      message: "Sprints fetched successfully",
      refineId: refine._id,
      refineActivities: refine.activities, // Adjusted field
      refineEstimatedTime: refine.estimatedtime || 0,
      sprints,
    });
  } catch (error) {
    console.error("Error fetching sprints by refine activity:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a sprint
export const deleteSprint = async (req, res) => {
  const { id } = req.params;

  try {
    const sprint = await Sprint.findById(id);
    if (!sprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    // Ensure only the creator can delete the sprint
    if (sprint.createdBy.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this sprint" });
    }

    await sprint.deleteOne();
    res.status(200).json({ message: "Sprint deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch all sprints for a specific refine
export const getSprintsByRefine = async (req, res) => {
  const { refineId } = req.params;

  try {
    // Find sprints that match the provided refineId
    const sprints = await Sprint.find({ refineId }).populate(
      "createdBy",
      "name email"
    ); // Populate `createdBy` field with user details (optional)

    if (!sprints || sprints.length === 0) {
      return res
        .status(404)
        .json({ message: "No sprints found for this refine" });
    }

    res.status(200).json({
      message: "Sprints fetched successfully",
      sprints,
    });
  } catch (error) {
    console.error("Error fetching sprints:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const getAllSprints = async (req, res) => {
  try {
    // Fetch all tasks (sprints) from the database
    const allSprints = await Task.find(); // Adjust 'Sprint' to match your model name

    // If no sprints found
    if (!allSprints || allSprints.length === 0) {
      return res.status(404).json({ message: "No sprints found" });
    }

    // Return all the sprints with the key 'tasks'
    res
      .status(200)
      .json({ message: "Sprints fetched successfully", tasks: allSprints }); // Change 'sprints' to 'tasks'
  } catch (error) {
    console.error("Error fetching sprints:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
