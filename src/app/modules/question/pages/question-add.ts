import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ExamService } from '../../exam/services/exam.service';
import { SkillService } from '../../skill/services/skill.service';
import { PartMasterService } from '../../part-master/services/part-master.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { QuestionFormComponent } from '../components/question-form';
import { QuestionService } from '../services/question.service';
import { SubQuestionFormComponent } from '../components/sub-question-form';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'app-question-add',
  templateUrl: './question-add.html',
  styleUrls: ['./question-add.less'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzGridModule,
    QuestionFormComponent,
    SubQuestionFormComponent,
    NzDividerModule,
    NzRadioModule,
  ],
})
export class QuestionAddPage implements OnInit {
  selectForm!: FormGroup;
  groupForm!: FormGroup;
  exams: any[] = [];
  skills: any[] = [];
  parts: any[] = [];
  filteredSkills: any[] = [];
  filteredParts: any[] = [];
  questionType: 'single' | 'group' = 'single';

  get subQuestions(): FormArray {
    return this.groupForm.get('sub_questions') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private skillService: SkillService,
    private partService: PartMasterService,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.selectForm = this.fb.group({
      exam_id: [null, Validators.required],
      skill_id: [null, Validators.required],
      part_id: [null, Validators.required],
    });

    this.groupForm = this.fb.group({
      exam_id: [null, Validators.required],
      entity_type: ['GROUP', Validators.required],
      part_id: [null, Validators.required],
      image_url: [''],
      audio_start_ms: [null],
      audio_end_ms: [null],
      sub_questions: this.fb.array([]),
    });

    this.selectForm.valueChanges.subscribe(value => {
      this.groupForm.patchValue({
        exam_id: value.exam_id,
        part_id: value.part_id,
      });
    });

    this.examService.getAll(1, 50).subscribe(res => (this.exams = res.data.response));
    this.skillService.getAll(1, 50).subscribe(res => (this.skills = res.data.response));
    this.partService.getAll(1, 50).subscribe(res => (this.parts = res.data.response));
  }

  onExamChange(examId: number): void {
    const exam = this.exams.find(e => e.id === examId);
    this.filteredSkills = this.skills.filter(s => s.cert_id === exam?.cert_id);
    this.selectForm.patchValue({ skill_id: null, part_id: null });
    this.filteredParts = [];
  }

  onSkillChange(skillId: number): void {
    this.filteredParts = this.parts.filter(p => p.skill_id === skillId);
    this.selectForm.patchValue({ part_id: null });
  }

  getPartNumber(partId: number): number {
    return this.parts.find(p => p.id === partId)?.part_number ?? 0;
  }

  onQuestionSaved(): void {
    // Optionally: show notification, maybe reset selectForm
  }

  // --- Group Question Methods ---
  addSubQuestion() {
    this.subQuestions.push(
      this.fb.group({
        part: [null, Validators.required],
        question_text: [''],
        image_url: [''],
        correct_answer: ['', Validators.required],
        option_a: ['', Validators.required],
        option_b: ['', Validators.required],
        option_c: ['', Validators.required],
        option_d: [''],
        sub_order: [null, Validators.required],
      })
    );
  }

  removeSubQuestion(idx: number) {
    this.subQuestions.removeAt(idx);
  }

  submitGroup() {
    if (this.groupForm.valid) {
      this.questionService.createGroup(this.groupForm.value).subscribe(() => {
        // show success message and reset form
        this.groupForm.reset({ entity_type: 'GROUP' });
        this.selectForm.reset();
      });
    } else {
      this.groupForm.markAllAsTouched();
    }
  }
}
