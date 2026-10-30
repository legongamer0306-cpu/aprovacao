export async function sendApprovalEmail(email: string, name: string, approvedBy: string) {
  // TODO: Integrate with an email provider using environment variables.
  // For demo purposes we just log the action.
  console.log(`Sending approval email to ${email} (${name}) approved by ${approvedBy}`);
  return true;
}
