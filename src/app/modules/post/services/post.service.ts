import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import { environment } from '../../../../environments/environment';
import { TagService } from '../../tag/services/tag.service';
import { Tag, TagApiResponse } from '../../tag/models/tag.model';

export interface PostApiResponse {
  pagination: {
    page: number;
    limit: number;
    total_records: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  response: Post[];
}


@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);
  private tagService = inject(TagService);
  private apiUrl = `${environment.apiUrl}/post`;

  getAllPosts(
    page: number,
    limit: number
  ): Observable<{ data: PostApiResponse }> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<{ data: PostApiResponse }>(
      `${this.apiUrl}/get-all`,
      { params }
    );
  }

  getPostById(id: number): Observable<{ data: Post }> {
    return this.http.get<{ data: Post }>(`${this.apiUrl}/edit/${id}`);
  }

  createPost(post: Omit<Post, 'id'>): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, post);
  }

  updatePost(post: Post): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, post);
  }

  getTags(page: number, limit: number): Observable<{ data: TagApiResponse }> {
    return this.tagService.getAll(page, limit);
  }
}
