import { Component, EventEmitter, Input, Output } from '@angular/core';
import Swal from 'sweetalert2';
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

  onDelete(event: Event): void {
    event.stopPropagation();
    Swal.fire({
      title: 'Delete this post?',
      text: `"${this.post.title}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1C1C2E',
      cancelButtonColor: '#e8e4db',
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.delete(this.post.id).subscribe({
          next: () => {
            this.deleted.emit(this.post.id);
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Post deleted',
              showConfirmButton: false,
              timer: 2500,
              timerProgressBar: true
            });
          },
          error: () => {
            Swal.fire({ icon: 'error', title: 'Could not delete post' });
          }
        });
      }
    });
  }
}
