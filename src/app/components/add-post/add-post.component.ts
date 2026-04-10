import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PostService } from '../../services/post.service';
import { CategoryService } from '../../services/category.service';
import { Category, PostCreateInput } from '../../data/post';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  postForm: FormGroup;
  categories: Category[] = [];

  private toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  });

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private categoryService: CategoryService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
      categoryId: ['', Validators.required],
      content: ['', [Validators.required, Validators.maxLength(2500)]]
    });
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe((categories) => {
      this.categories = categories;
    });
  }

  get title() { return this.postForm.controls['title']; }
  get categoryId() { return this.postForm.controls['categoryId']; }
  get content() { return this.postForm.controls['content']; }

  onSubmit(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      this.toast.fire({ icon: 'error', title: 'Please review your post' });
      return;
    }

    const payload: PostCreateInput = this.postForm.value as PostCreateInput;

    this.postService.create(payload).subscribe({
      next: () => {
        this.toast.fire({ icon: 'success', title: 'Post Submitted Successfully' });
        this.router.navigate(['/']);
      },
      error: () => {
        this.toast.fire({ icon: 'error', title: 'An error occurred, please try again' });
      }
    });
  }
}

