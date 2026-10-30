export async function sendApprovalSMS(phone: string, name: string, approvedBy: string) {
  // TODO: Integrate with SMS provider.
  console.log(`Sending approval SMS to ${phone} (${name}) approved by ${approvedBy}`);
  return true;
}
