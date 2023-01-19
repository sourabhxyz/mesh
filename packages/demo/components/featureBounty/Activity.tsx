import Comment from './Comment';
import Textarea from '../../components/ui/textarea';
import Button from '../../components/ui/button';
import { useState } from 'react';

export default function Activity() {
  const [comment, setComment] = useState<string>('');
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">
            Activity Feed (20)
          </h2>
        </div>
        <form className="mb-6">
          <div className="">
            <label className="sr-only">Your comment</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              placeholder="Write a comment..."
            />
          </div>
          <Button>Post comment</Button>
        </form>
        <Comment />
        <Comment />
        <Comment />
        <Comment />
        <Comment />
      </div>
    </section>
  );
}
