'use client';

import { formatDate } from '@/lib/format';
import LikeButton from './like-icon';
import { togglePostsLikeStatus } from '@/actions/posts';
import { useOptimistic } from 'react';
import Image from 'next/image';

function Post({ post, action }) {

  function imageloader(config){
    const urlStart = config.src.split('/upload')[0];
    const urlEnd = config.src.split('/upload')[1];
    const transformation = `w_200,q_${config.quality}`;
    return `${urlStart}/upload/${transformation}/${urlEnd}`;
  }

  return (
    <article className="post">
      <div className="post-image">
        <Image loader={imageloader} src={post.image} width={200} height={120} alt={post.title} quality={50}/>
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{' '}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div>
            <form action={action.bind(null, post.id)}
                  className={post.isLiked ? 'liked' : ''}
             >
              <LikeButton />
            </form>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

export default function Posts({ posts }) {

  const [optimisticPosts, updatedoptimisticPosts] = useOptimistic(posts, (prevPost, updatedPostID) => {
    const updatedPostIndex = prevPost.findIndex(post => post.id === updatedPostID);
    if (updatedPostIndex == -1) {
      return prevPost;
    }

    const updatedPost = {...prevPost[updatedPostIndex]};
    updatedPost.likes = updatedPost.likes + (updatedPost.isLiked ? -1 : 1);
    updatedPost.isLiked = !updatedPost.isLiked;
    const newPost = [...prevPost];
    newPost[updatedPostIndex] = updatedPost;
    return newPost;
  })

  if (!optimisticPosts || optimisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  async function updatedPost(postId) {
      updatedoptimisticPosts(postId);
      await togglePostsLikeStatus(postId);
  }

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} action={updatedPost}/>
        </li>
      ))}
    </ul>
  );
}
