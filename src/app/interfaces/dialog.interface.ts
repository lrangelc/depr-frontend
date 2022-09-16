/**
 * Use Partial<DialogData>
 * to declare a specific type of Dialog
 */
export interface IDialogData {
  /** Type of dialogue to show ['confirmation','notification'] */
  type: string;
  /** Title for 'confirmation' type */
  dialogTitle: string;
  /** Content for 'confirmation' type */
  dialogContent: string;
  /** Cancel Button Text for 'confirmation' type */
  cancelBtnText: string;
  /** Submit Button Text for 'confirmation' type */
  submitBtnText: string;
  /** MaterialIcon name for 'notification' type */
  icon: string;
  /** First part of the message for 'notification' type */
  messageStart: string;
  /** Bold part of the message for 'notification' type */
  messageMiddle: string;
  /** Last part of the message for 'notification' type */
  messageEnd: string;

  messages: string[];
}

/**
* Confirm Dialog Labels
*/
export interface IConfirmDialogLabels {
  title: string;
  content: string;
  cancelText: string;
  submitText: string;
}

/**
* Notification Dialog Labels
*/
export interface INotificationDialogLabels {
  firstMessage: string;
  endMessage: string;
  alreadyCancelled: string;
  notAuth: string;
  error: string;
}
