export const CREATE_REPLAY = {
  status: 201,
  description: 'The comment has been successfully created.',
  schema: {
    example: {
      post_id: '7e9a9ed2-476e-4e95-8725-d2cc611a5429',
      user_id: '24fd6a83-51dd-4a5f-b653-a6369eaed041',
      comment: 'Thanks for your thoughts! I agree with your point.',
      parent_id: 'd2a0f7c2-3e17-47a3-9d0a-0d97e30e9c21',
      date: '2025-04-30T12:45:00.000Z',
    },
  },
};

export const CREATE_COMMENT = {
  status: 201,
  description: 'The comment has been successfully created.',
  schema: {
    example: {
      data: {
        id: 'uuid',
        news_id: 'uuid',
        user_id: 'uuid',
        comment: 'This is a great post! Thanks for sharing.',
        parent_id: null,
        type: 'comment', // default
        created_at: '2025-04-30T14:30:00Z',
        updated_at: '2025-04-30T14:30:00Z',
      },
    },
  },
};

export const UPDATE_COMMENT = {
  schema: {
    example: {
      comment: 'This is a great post! Thanks for sharing.',
    },
  },
};
