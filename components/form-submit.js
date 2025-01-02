'use client';

import { useFormStatus } from 'react-dom'

const FormSubmit = () => {
    const status = useFormStatus();

    if (status.pending) {
      return <p>Creating Posts</p>
    }
  return (
    <div>
        <button type="reset">Reset</button>
        <button>Create Post</button>
    </div>
  )
}

export default  FormSubmit;
