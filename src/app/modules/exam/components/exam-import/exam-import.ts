import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzUploadModule, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ExamService } from '../../services/exam.service';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-exam-import',
  standalone: true,
  imports: [CommonModule, NzUploadModule, NzButtonModule, NzIconModule],
  templateUrl: './exam-import.html',
  styleUrls: ['./exam-import.less'],
})
export class ExamImportComponent {
  private examService = inject(ExamService);
  private modal = inject(NzModalRef);
  private msg = inject(NzMessageService);
  private data = inject(NZ_MODAL_DATA);

  uploading = false;
  fileList: NzUploadFile[] = [];
  exam_id: number = this.data.exam_id;

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.slice(-1);
    this.fileList = this.fileList.concat(file);
    return false;
  };

  handleUpload(): void {
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
    });
    formData.append('exam_id', this.exam_id.toString());

    this.uploading = true;
    this.examService.importQuestions(formData).subscribe(
      () => {
        this.uploading = false;
        this.msg.success('upload successfully.');
        this.modal.close(true);
      },
      () => {
        this.uploading = false;
        this.msg.error('upload failed.');
        this.modal.close(false);
      }
    );
  }
}
