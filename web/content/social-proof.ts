export type RedditComment = {
  id: string;
  quote: string;
  author: string;
  /** Verified permalink to this specific Reddit comment. */
  url: string;
};

/** Verbatim excerpts verified in the owner's r/MacStack thread on 2026-10-02. */
export const redditComments: RedditComment[] = [
  {
    id: 'pcpf9b3',
    quote: 'Great work on this...Thanks',
    author: 'u/mrterrycarson',
    url: 'https://www.reddit.com/r/MacStack/comments/1wsl0hk/comment/pcpf9b3/',
  },
  {
    id: 'pd5iufo',
    quote:
      'Been using this for the past week. I am already considering transitioning from Paste to your app.',
    author: 'u/azfarrizvi',
    url: 'https://www.reddit.com/r/MacStack/comments/1wsl0hk/comment/pd5iufo/',
  },
  {
    id: 'pco8k5a',
    quote: 'i love the ui look closer to native macos ui great work.',
    author: 'u/ahyasinsab',
    url: 'https://www.reddit.com/r/MacStack/comments/1wsl0hk/comment/pco8k5a/',
  },
  {
    id: 'pco046c',
    quote: 'having everything in one spot sounds handy.',
    author: 'u/jakarotro',
    url: 'https://www.reddit.com/r/MacStack/comments/1wsl0hk/comment/pco046c/',
  },
];
