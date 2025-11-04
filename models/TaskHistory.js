import mongoose from 'mongoose';

/**
 * Task History Model for Audit Logs
 * Created by mongoose-log-history plugin
 */
const taskHistorySchema = new mongoose.Schema(
  {
    model: { type: String, required: true },
    model_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    change_type: { type: String, enum: ['create', 'update', 'delete'], required: true },
    logs: [
      {
        field_name: String,
        from_value: mongoose.Schema.Types.Mixed,
        to_value: mongoose.Schema.Types.Mixed,
      },
    ],
    created_by: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: String,
      role: String,
    },
    created_at: { type: Date, default: Date.now },
  },
  {
    collection: 'task_histories',
    timestamps: false,
  }
);

// Create model if it doesn't exist
const TaskHistory =
  mongoose.models.TaskHistory || mongoose.model('TaskHistory', taskHistorySchema);

export default TaskHistory;

