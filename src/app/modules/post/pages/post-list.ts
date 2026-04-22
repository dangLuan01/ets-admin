import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { PostFormComponent } from '../components/post-form';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzDividerModule,
    NzButtonModule,
    NzModalModule,
    NzIconModule,
    NzTagModule,
  ],
  templateUrl: './post-list.html',
  styleUrl: './post-list.less',
})
export class PostListComponent implements OnInit {
  private postService = inject(PostService);
  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);
  private message = inject(NzMessageService);

  posts: Post[] = [];
  page: number = 1;
  limit: number = 10;
  total: number = 0;

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.postService.getAllPosts(this.page, this.limit).subscribe((res) => {
      this.posts = res.data.response;
      this.limit = res.data.pagination.limit;
      this.total = res.data.pagination.total_records;
      this.cdr.detectChanges();
    });
  }

  onPageIndexChange(page: number): void {
    this.page = page;
    this.loadPosts();
  }

  showCreateModal(): void {
    const modal = this.modal.create({
      nzTitle: 'Thêm mới bài viết',
      nzContent: PostFormComponent,
      nzWidth: '1400px',
      nzCentered: true,
      nzFooter: [
        {
          label: 'Hủy',
          onClick: () => modal.destroy(),
        },
        {
          label: 'Tạo mới',
          type: 'primary',
          onClick: (componentInstance) => {
            if (componentInstance?.validateForm.valid) {
              this.postService.createPost(componentInstance.validateForm.value).subscribe({
                next: () => {
                  this.message.success('Post created successfully!');
                  this.loadPosts();
                  modal.destroy();
                },
                error: (err) => this.message.error(`Failed to create post: ${err.error?.message || err.message}`)
              });
            } else {
              componentInstance?.validateForm.markAsDirty();
              componentInstance?.validateForm.updateValueAndValidity();
            }
          },
        },
      ],
    });
  }

  showEditModal(post: Post): void {
    if (!post.id) return;
    this.postService.getPostById(post.id).subscribe((res) => {
      const modal = this.modal.create({
        nzTitle: 'Cập nhật bài viết',
        nzContent: PostFormComponent,
        nzWidth: '1400px',
        nzCentered: true,
        nzData: {
          post: res.data,
        },
        nzFooter: [
          {
            label: 'Hủy',
            onClick: () => modal.destroy(),
          },
          {
            label: 'Cập nhật',
            type: 'primary',
            onClick: (componentInstance) => {
              if (componentInstance?.validateForm.valid) {
                const updatedPost = {
                  ...res.data,
                  ...componentInstance.validateForm.value,
                };
                this.postService.updatePost(updatedPost).subscribe({
                  next: () => {
                    this.message.success('Post updated successfully!');
                    this.loadPosts();
                    modal.destroy();
                  },
                  error: (err) => this.message.error(`Failed to update post: ${err.error?.message || err.message}`)
                });
              } else {
                componentInstance?.validateForm.markAsDirty();
                componentInstance?.validateForm.updateValueAndValidity();
              }
            },
          },
        ],
      });
    });
  }
}
