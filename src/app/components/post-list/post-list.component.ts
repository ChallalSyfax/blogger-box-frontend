import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { PostService } from '../../services/post.service';
import { CategoryService } from '../../services/category.service';
import { Post, Category } from '../../data/post';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  categories: Category[] = [];
  selectedCategoryId: string | null = null;
  searchValue = '';

  private searchSubject = new Subject<string>();
  private destroyed$ = new Subject<void>();

  constructor(
    private postService: PostService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadPosts();

    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(value => {
        this.selectedCategoryId = null;
        if (!value.trim()) return this.postService.getAll();
        return this.postService.search(value.trim());
      })
    ).subscribe({
      next: (posts) => this.posts = posts,
      error: (err) => console.error(err)
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (cats) => this.categories = cats,
      error: (err) => console.error(err)
    });
  }

  loadPosts(): void {
    this.postService.getAll().subscribe({
      next: (posts) => this.posts = posts,
      error: (err) => console.error(err)
    });
  }

  onSearch(value: string): void {
    this.searchValue = value;
    this.searchSubject.next(value);
  }

  selectCategory(id: string | null): void {
    this.selectedCategoryId = id;
    this.searchValue = '';
    if (!id) {
      this.loadPosts();
    } else {
      this.postService.getByCategory(id).subscribe({
        next: (posts) => this.posts = posts,
        error: (err) => console.error(err)
      });
    }
  }

  onPostDeleted(id: string): void {
    this.posts = this.posts.filter(p => p.id !== id);
  }
}
