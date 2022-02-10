import isPayloadValid from "../shared/WorkflowItemValidator";

export default function WorkflowConfigValidator(workflowConfig, isF) {
  if (!Array.isArray(workflowConfig)) {
    return false;
  }

  try {
    for (let i = 0; i < workflowConfig.length; i++) {
      const currentWorkflow = workflowConfig[i];
      if (
        !currentWorkflow.hasOwnProperty("id") ||
        !currentWorkflow.hasOwnProperty("name") ||
        !currentWorkflow.hasOwnProperty("payload")
      ) {
        return false;
      }

      if (
        currentWorkflow.payload.some((item) => {
          if (!isPayloadValid(item, isF)) {
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
