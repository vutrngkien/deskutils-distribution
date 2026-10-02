import { redditComments, type RedditComment } from '@/content/social-proof';
import { translate } from '@/content/i18n';
import type { Locale } from '@/content/locales';

function CommentCard({
  comment,
  duplicate = false,
}: {
  comment: RedditComment;
  duplicate?: boolean;
}) {
  const content = (
    <>
      <blockquote lang="en">
        <p>“{comment.quote}”</p>
      </blockquote>
      <div className="home-social-author">
        <span className="home-social-avatar" aria-hidden="true">
          {comment.author.slice(2, 3).toUpperCase()}
        </span>
        <span className="home-social-username">{comment.author}</span>
        <span className="home-social-source">Reddit</span>
      </div>
    </>
  );
  return (
    <a
      className="home-social-card"
      href={comment.url}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={duplicate ? -1 : undefined}
    >
      {content}
    </a>
  );
}

/** CSS-only loop. Duplicates stay clickable but are hidden from accessibility APIs and tab order. */
export function SocialProof({ locale }: { locale: Locale }) {
  return (
    <section
      className="container-page home-social-proof"
      aria-label={translate(locale, 'home.social.label')}
    >
      <div
        className="home-social-viewport"
        tabIndex={0}
        role="group"
        aria-label={translate(locale, 'home.social.comments')}
      >
        <div className="home-social-track">
          <div className="home-social-group" data-social-original>
            {redditComments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
          <div className="home-social-group" data-social-clone aria-hidden="true">
            {redditComments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} duplicate />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
