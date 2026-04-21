import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Post } from '../models/post.model';
import { PostService } from '../services/post.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { Tag } from '../../tag/models/tag.model';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { Subject, takeUntil } from 'rxjs';
import { generateSlug } from '../../../shared/utils/string.utils';
import { CkEditor, CkEditorConfig } from '../../../shared/configs/ckeditor.config';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzSelectModule,
    NzButtonModule,
    CKEditorModule,
  ],
  templateUrl: './post-form.html',
})
export class PostFormComponent implements OnInit, OnDestroy {
  public Editor = CkEditor;
  public config = CkEditorConfig;
  private fb = inject(FormBuilder);
  private postService = inject(PostService);
  private modalData?: { post: Post } = inject(NZ_MODAL_DATA, {
    optional: true,
  });

  private destroy$ = new Subject<void>();

  validateForm!: FormGroup;
  tags: Tag[] = [];
  tagPage = 1;
  tagLimit = 20;
  hasMoreTags = true;

  ngOnInit(): void {
    this.loadTags();
    this.validateForm = this.fb.group({
      name: [this.modalData?.post?.name || '', [Validators.required]],
      slug: [this.modalData?.post?.slug || '', [Validators.required]],
      content: [this.modalData?.post?.content || '', [Validators.required]],
      summary: [this.modalData?.post?.summary || '', [Validators.required]],
      thumbnail_url: [this.modalData?.post?.thumbnail_url || '', [Validators.required]],
      tags: [this.modalData?.post?.tags || [], [Validators.required]],
      status: [this.modalData?.post?.status ?? 1, [Validators.required]],
    });

    this.validateForm.controls['name'].valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(name => {
      if (this.validateForm.controls['slug'].pristine) {
        this.validateForm.controls['slug'].setValue(generateSlug(name));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTags(): void {
    if (!this.hasMoreTags) {
      return;
    }
    this.postService.getTags(this.tagPage, this.tagLimit).subscribe(res => {
      this.tags = [...this.tags, ...res.data.response];
      this.hasMoreTags = res.data.pagination.has_next;
      this.tagPage++;
    });
  }
}

