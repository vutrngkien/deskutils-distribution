# Publish the redesign

Production hosting uses Vercel. Configure the project to build `web/` and set
the public feedback variable in Vercel. The app is free; Ko-fi support is optional.
Checkout, discount and launch-offer environment variables are obsolete and ignored.
These values are embedded at build time, so changing them requires a rebuild.
Changelog refreshes from the public GitHub Releases API whenever a visitor opens
the page; publishing or editing a release no longer requires a Vercel rebuild.
Builds still read the committed snapshot for initial HTML and fallback content.
Do not sync during ordinary tests. Committing source does not publish the website.

## Ko-fi goal sync

The community notarization goal uses a static 99 USD / 9% fallback. To enable
automatic progress, deploy the separate `kofi-sync` Vercel project and follow
[`../kofi-sync/README.md`](../kofi-sync/README.md). Set only the public
`NEXT_PUBLIC_DESKUTILS_KOFI_GOAL_ENDPOINT` on the website project, then rebuild
and review its preview. Webhook and Redis secrets belong exclusively to the sync
project. Funding completion is not a notarization status claim.

## Optional GitHub Pages workflow

The following release switches apply only to the existing GitHub Pages workflow,
not to Vercel. Its deploy gates remain unchanged.

The site describes the **next DeskUtils release** (macOS 15.2), not the DMG
currently listed in `site/appcast.xml`. CI builds a preview artifact by default;
production deployment is deliberately disabled until the matching app is ready.

Before enabling deployment:

1. Check the released DMG on supported Macs: macOS 15.2 minimum, supported CPU
   architectures, screenshot/annotation, clipboard capacity up to 500, OCR,
   Scrolling Capture, Capture Subject, persistent display dimming, Quick Ring
   customization and External Display Only without a trial countdown.
2. Confirm every feature works with no license key, including a fresh install,
   offline use and an upgrade from earlier Free or Pro installs. Check that the
   app makes no license activation/validation requests. Verify the optional
   Ko-fi links point to `https://ko-fi.com/vutrngkien`. Publish the free app before
   publishing the website’s all-features-free copy, including on Vercel.
3. Verify signing/notarization on the artifact before adding any notarization claim.
4. Publish the matching app release and update `site/appcast.xml` using the existing
   signing scripts in the private app repository. Never hand-edit the signed feed.
5. Verify the `releases/latest/download/DeskUtils.dmg` URL serves that release.
6. Review the new Install, Privacy and Terms pages against the released behavior.
7. Set repository variable `DESKUTILS_WEBSITE_RELEASE_TAG` to that exact tag, then
   `DESKUTILS_WEBSITE_RELEASE_READY=true`. Run the Pages workflow on main.

The deploy job checks the feed's first item, minimum OS, latest release tag and DMG
availability before publishing. Feature support and supported CPUs require the
manual artifact checks above; a successful source build does not establish them.

## Changelog snapshot

`/changelog/` renders `web/content/releases.json`, a snapshot synced from the
public GitHub Releases API. On each visit, the browser fetches every API page,
filters drafts/prereleases, sorts by publication date and replaces the list only
after the complete fetch succeeds. Release notes remain verbatim and use the
same safe Markdown renderer. API errors, rate limiting, malformed/empty data or
a 15-second timeout leave the initial snapshot visible. No token is sent from
the browser. Version anchors also work for releases newer than the snapshot.

CI runs `npm run sync:releases` before the build; a
failed sync fails the job and leaves the committed snapshot unchanged (it never
overwrites with empty data). Builds never require a network call; browser tests
mock GitHub responses. Run `npm run sync:releases` locally to refresh initial
HTML/fallback content when convenient. Publishing or editing a release in this repo
triggers the Pages workflow directly (`release: [published, edited]`); the app
repo can also rebuild cross-repo with a `repository_dispatch` of type
`release-published`. These rebuild triggers are optional for live Changelog freshness.

For rollback, disable `DESKUTILS_WEBSITE_RELEASE_READY`, revert the website source
change, and rebuild/redeploy the previous website artifact. Never restore an older
signed appcast as part of a visual rollback: keep the current feed and release
assets. Keep this switch off whenever website copy gets ahead of the public app.
