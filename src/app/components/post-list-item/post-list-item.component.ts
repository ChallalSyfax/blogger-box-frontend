import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../data/post';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.css']
})
export class PostListItemComponent {

  @Input() post!: Post;
  @Output() deleted = new EventEmitter<string>();

  constructor(private postService: PostService) {}

  onDelete(): void {
    this.postService.delete(this.post.id).subscribe(() => {
      this.deleted.emit(this.post.id);
    });
  }
}

