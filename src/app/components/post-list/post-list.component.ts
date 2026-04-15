import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../data/post';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: Post[] = [];

  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.postService.getAll().subscribe((posts) => {
      this.posts = posts;
    });
  }

  onPostDeleted(id: string): void {
    this.posts = this.posts.filter(p => p.id !== id);
  }
}

