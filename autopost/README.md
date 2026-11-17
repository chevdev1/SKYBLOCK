# Telegram autopost

Posts the next **approved** item from `queue.json` to the channel, with the image from `img/`.

- Add or remove posts: edit `queue.json`; delete an image from `img/` to skip that post.
- Approve a post: set `"approved": true`. Nothing unapproved is ever posted.
- Order: top to bottom. Each post goes out once (`postedAt` is written back).
- Schedule: `.github/workflows/autopost.yml` (2 posts a day, 09:00 and 17:00 UTC).
- Secret: `TG_BOT_TOKEN` in GitHub, Settings, Secrets and variables, Actions. Never commit the token.
- Test without posting: `DRY_RUN=1 node autopost/post-next.js`, or run the workflow manually with "Dry run" on.
- Own server instead of GitHub: `TG_BOT_TOKEN=... TG_CHAT=@HopToOlympus node autopost/post-next.js` from cron, twice a day.
