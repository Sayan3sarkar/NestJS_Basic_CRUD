import {
  BadRequestException,
  // ArgumentMetadata,
  PipeTransform,
} from '@nestjs/common';
import { TaskStatus } from '../tasks.model';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.DONE,
    TaskStatus.IN_PROGRESS,
    TaskStatus.OPEN,
  ];

  transform(
    value: any,
    // metadata: ArgumentMetadata
  ) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is an invalid status`);
    }
    return value;
  }

  private isStatusValid(status: any) {
    const index = this.allowedStatuses.indexOf(status); // indexOf will return -1 if 'status' not present in 'allowedStatuses'
    return index != -1;
  }
}
