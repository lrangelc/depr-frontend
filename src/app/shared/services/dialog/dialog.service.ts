import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "../../components/dialog/dialog.component";

@Injectable({
  providedIn: "root",
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  /**
   * Open confirmation dialog with custom content
   * @returns boolean
   * @category dialog
   * @param dialogType type of dialog ['confirmation', 'notification']
   * @param title dialog title
   * @param content dialog content
   * @param cancelText cancel button text
   * @param submitText submit button text
   */
  openConfirmationDialog(
    dialogType: string,
    title: string,
    content: string,
    cancelText: string,
    submitText: string
  ) {
    return this.dialog.open(DialogComponent, {
      disableClose: true,
      autoFocus: false,
      maxWidth: "650px",
      width: "650px",
      data: {
        type: dialogType,
        dialogTitle: title,
        dialogContent: content,
        cancelBtnText: cancelText,
        submitBtnText: submitText,
      },
    });
  }

  /**
   * Open notification dialog with custom content
   * @category dialog
   * @param dialogType type of dialog ['confirmation', 'notification']
   * @param dialogIcon dialog material icon
   * @param firstMessage first part of the message
   * @param middleMessage bold part of the message
   * @param endMessage last part of the message
   */
  openNotificationDialog(
    dialogType: string,
    dialogIcon: string,
    firstMessage: string,
    middleMessage: string,
    endMessage: string
  ): void {
    this.dialog.open(DialogComponent, {
      autoFocus: false,
      maxWidth: "650px",
      width: "650px",
      data: {
        type: dialogType,
        icon: dialogIcon,
        messageStart: firstMessage,
        messageMiddle: middleMessage,
        messageEnd: endMessage,
      },
    });
  }

  successDialog(
    firstMessage: string,
    middleMessage: string,
    endMessage: string = ""
  ): void {
    this.openNotificationDialog(
      "notification",
      "check_circle_outline",
      firstMessage,
      middleMessage,
      endMessage
    );
  }
  errorDialog(
    firstMessage: string,
    middleMessage: string,
    endMessage: string = ""
  ): void {
    this.openNotificationDialog(
      "notification",
      "error_outline",
      firstMessage,
      middleMessage,
      endMessage
    );
  }
}
