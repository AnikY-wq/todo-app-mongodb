import mongoose from 'mongoose';
import TaskHistory from './TaskHistory.js';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task owner is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Custom audit logging using Mongoose hooks
// Track fields to audit
const auditFields = ['title', 'description', 'completed', 'owner'];

// Helper function to get changed fields for create
const getChangedFieldsForCreate = function (doc) {
  const logs = [];
  // For create, log all initial values
  auditFields.forEach((field) => {
    if (doc[field] !== undefined) {
      logs.push({
        field_name: field,
        from_value: null,
        to_value: doc[field],
      });
    }
  });
  return logs;
};

// Helper function to get changed fields for update (save hook)
const getChangedFieldsForUpdate = function (doc) {
  const logs = [];
  // For update using save(), compare modified paths
  auditFields.forEach((field) => {
    if (doc.isModified(field)) {
      const originalValue = doc.get(field, null, { getters: false });
      const newValue = doc[field];
      logs.push({
        field_name: field,
        from_value: originalValue,
        to_value: newValue,
      });
    }
  });
  return logs;
};

// Post-save hook for create and update
taskSchema.post('save', async function (doc, next) {
  try {
    // Get user context from document locals (set in controller)
    const userContext = doc.$locals?.auditUser || null;
    
    const changeType = doc.isNew ? 'create' : 'update';
    const logs =
      changeType === 'create'
        ? getChangedFieldsForCreate(doc)
        : getChangedFieldsForUpdate(doc);

    if (logs.length > 0 || changeType === 'create') {
      await TaskHistory.create({
        model: 'Task',
        model_id: doc._id,
        change_type: changeType,
        logs: logs,
        created_by: userContext
          ? {
              id: userContext.id,
              name: userContext.name,
              role: userContext.role,
            }
          : null,
        created_at: new Date(),
      });
    }
  } catch (error) {
    // Log error but don't fail the operation
    console.error('Error creating audit log:', error);
  }
  next();
});

// Pre-update hook to store original document for comparison
taskSchema.pre(['findOneAndUpdate', 'findOneAndReplace'], async function () {
  // Store original document in query for later comparison
  this._originalDoc = await this.model.findOne(this.getQuery());
});

// Post-update hook for findByIdAndUpdate and similar methods
taskSchema.post(['findOneAndUpdate', 'findOneAndReplace'], async function (doc, next) {
  if (!doc) return next();

  try {
    // Get user context from query options
    const userContext = this.getOptions()?.auditUser || null;

    // Get the original document (stored in pre hook)
    const originalDoc = this._originalDoc;
    if (!originalDoc) return next();

    // Get the update data
    const update = this.getUpdate();
    const logs = [];

    // Compare updated fields
    auditFields.forEach((field) => {
      const oldValue = originalDoc[field];
      // Check update object for the new value
      const newValue =
        update.$set?.[field] !== undefined
          ? update.$set[field]
          : update[field] !== undefined
            ? update[field]
            : doc[field];

      // Only log if value actually changed
      if (oldValue !== newValue && newValue !== undefined) {
        logs.push({
          field_name: field,
          from_value: oldValue,
          to_value: newValue,
        });
      }
    });

    if (logs.length > 0) {
      await TaskHistory.create({
        model: 'Task',
        model_id: doc._id,
        change_type: 'update',
        logs: logs,
        created_by: userContext
          ? {
              id: userContext.id,
              name: userContext.name,
              role: userContext.role,
            }
          : null,
        created_at: new Date(),
      });
    }
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
  next();
});

// Pre-delete hook to capture document before deletion
taskSchema.pre(['findOneAndDelete', 'findOneAndRemove'], async function () {
  // Store original document before deletion
  this._deletedDoc = await this.model.findOne(this.getQuery());
});

// Post-delete hook
taskSchema.post(['findOneAndDelete', 'findOneAndRemove'], async function (doc, next) {
  try {
    // Get user context from query options
    const userContext = this.getOptions()?.auditUser || null;

    // Get the document that was deleted (stored in pre hook)
    const deletedDoc = this._deletedDoc || doc;
    
    if (!deletedDoc) return next();

    // Create audit log for deletion
    await TaskHistory.create({
      model: 'Task',
      model_id: deletedDoc._id,
      change_type: 'delete',
      logs: [
        {
          field_name: 'status',
          from_value: 'active',
          to_value: 'deleted',
        },
      ],
      created_by: userContext
        ? {
            id: userContext.id,
            name: userContext.name,
            role: userContext.role,
          }
        : null,
      created_at: new Date(),
    });
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
  next();
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
