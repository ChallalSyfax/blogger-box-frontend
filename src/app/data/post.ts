export interface Post {
  id: string;
  title: string;
  content: string;
  createdDate: string;
  category: Category;
}

export interface Category {
  id: string;
  name: string;
}

export type PostCreateInput = Omit<Post, 'id' | 'createdDate' | 'category'> & { categoryId: string };

export type CategoryCreateInput = Omit<Category, 'id'>;

