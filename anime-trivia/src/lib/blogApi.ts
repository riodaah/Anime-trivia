import { collection, query, orderBy, limit, getDocs, where, startAfter } from 'firebase/firestore';
import { db } from '@/firebase';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  contentMarkdown?: string;
  content?: string;
  coverImageUrl: string;
  tags: string[];
  publishedAt: string;
  sourceUrl?: string;
  createdAt?: any;
}

export const getPosts = async (pageSize: number = 10, lastDoc?: any): Promise<{ posts: BlogPost[]; lastDoc: any }> => {
  try {
    let q = query(
      collection(db, 'posts'),
      orderBy('publishedAt', 'desc'),
      limit(pageSize)
    );

    if (lastDoc) {
      q = query(
        collection(db, 'posts'),
        orderBy('publishedAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      );
    }

    const querySnapshot = await getDocs(q);
    const posts: BlogPost[] = [];
    let newLastDoc = null;

    querySnapshot.forEach((docSnap) => {
      posts.push({
        id: docSnap.id,
        ...docSnap.data(),
      } as BlogPost);
      newLastDoc = docSnap;
    });

    return { posts, lastDoc: newLastDoc };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], lastDoc: null };
  }
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const q = query(collection(db, 'posts'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const docSnap = querySnapshot.docs[0];
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as BlogPost;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
};

export const getLatestPosts = async (count: number = 3): Promise<BlogPost[]> => {
  try {
    const { posts } = await getPosts(count);
    return posts;
  } catch (error) {
    console.error('Error fetching latest posts:', error);
    return [];
  }
};

