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
import { Tag } from '../models/tag.model';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Subject, takeUntil } from 'rxjs';
import { generateSlug } from '../../../shared/utils/string.utils';

@Component({
  selector: 'app-tag-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzSelectModule,
  ],
  templateUrl: './tag-form.html',
})
export class TagFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private modalData?: { tag: Tag } = inject(NZ_MODAL_DATA, {
    optional: true,
  });

  private destroy$ = new Subject<void>();

  validateForm!: FormGroup;

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [this.modalData?.tag?.name || '', [Validators.required]],
      slug: [this.modalData?.tag?.slug || '', [Validators.required]],
      status: [this.modalData?.tag?.status ?? 1, [Validators.required]],
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
}
