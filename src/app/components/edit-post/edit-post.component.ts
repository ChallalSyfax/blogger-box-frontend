import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PostService } from '../../services/post.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../data/post';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  editForm: FormGroup;
  categories: Category[] = [];
  postId!: string;
  loading = true;

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private categoryService: CategoryService
  ) {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      categoryId: ['', Validators.required],
      content: ['', [Validators.required, Validators.maxLength(2500)]]
    });
  }

  ngOnInit(): void {
    this.postId = this.route.snapshot.paramMap.get('id')!;

    this.categoryService.getAll().subscribe(cats => {
      this.categories = cats;
    });

    this.postService.getById(this.postId).subscribe({
      next: (post) => {
        this.editForm.patchValue({
          title: post.title,
          categoryId: post.category.id,
          content: post.content
        });
        this.loading = false;
      },
      error: () => {
        this.toast.fire({ icon: 'error', title: 'Post not found' });
        this.router.navigate(['/']);
      }
    });
  }

  get title() { return this.editForm.controls['title']; }
  get categoryId() { return this.editForm.controls['categoryId']; }
  get content() { return this.editForm.controls['content']; }

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      this.toast.fire({ icon: 'error', title: 'Please review your post' });
      return;
    }

    this.postService.update(this.postId, this.editForm.value).subscribe({
      next: () => {
        this.toast.fire({ icon: 'success', title: 'Post updated!' });
        this.router.navigate(['/posts', this.postId]);
      },
      error: () => {
        this.toast.fire({ icon: 'error', title: 'An error occurred, please try again' });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/posts', this.postId]);
  }
}
