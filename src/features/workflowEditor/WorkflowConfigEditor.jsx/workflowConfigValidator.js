import workflowItemValidor from "../shared/WorkflowItemValidator";

export default function WorkflowConfigValidator(workflowConfig, isF) {
  if (!Array.isArray(workflowConfig.items)) {
    return false;
  }

  try {
    for (let i = 0; i < workflowConfig.items.length; i++) {
      const currentWorkflow = workflowConfig.items[i];
      if (
        !currentWorkflow.hasOwnProperty("id") ||
        !currentWorkflow.hasOwnProperty("name") ||
        !currentWorkflow.hasOwnProperty("payload")
      ) {
        return false;
      }

      if (
        currentWorkflow.payload.some((item) => {
          if (!workflowItemValidor(item, isF)) {
            return true;
          }
          return false;
        })
      ) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}
