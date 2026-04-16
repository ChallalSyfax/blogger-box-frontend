import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'readingTime' })
export class ReadingTimePipe implements PipeTransform {
  transform(content: string): string {
    const words = content ? content.trim().split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  }
}
