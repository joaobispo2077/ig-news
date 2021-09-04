import { NextApiRequest, NextApiResponse } from 'next';

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const users = [
    {
      id: 1,
      name: 'John Doe',
    },
  ];

  response.status(200).json(users);
};
