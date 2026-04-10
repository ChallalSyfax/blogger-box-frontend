import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, PostCreateInput } from '../data/post';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private postsUrl = `${environment.apiUrl}/v1/posts`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.postsUrl);
  }

  getById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.postsUrl}/${id}`);
  }

  create(post: PostCreateInput): Observable<Post> {
    return this.http.post<Post>(this.postsUrl, post);
  }

  update(id: string, post: { title: string; content: string; categoryId: string }): Observable<Post> {
    return this.http.put<Post>(`${this.postsUrl}/${id}`, post);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.postsUrl}/${id}`);
  }
}
