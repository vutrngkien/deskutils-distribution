# Website analytics

Umami collects pageviews on `deskutils.app` using the existing website ID. Preview
domains remain excluded. The script omits URL query strings and hashes from pageviews.

`InteractionTracker` owns click events for all active pages, including 404.
Authored `data-track-event` attributes specify conversion names and metadata;
ordinary links are classified automatically. Do not use `data-umami-event` on
active components: that would give Umami a second click listener. Retired
`Site.tsx` and `MobileNavigation.tsx` are not rendered by the current RootShell.

All events include `path` (pathname only) and `locale`. Links use stable route
targets instead of translated labels; email targets are the literal `email`.
No query strings, feedback text, entered emails, attachment names/content, license
keys or payment details are passed to event data. Release-note links inside
Markdown are covered by the same link listener without changing the notes.

| Event                                                     | Trigger / extra properties                                                              |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `download`                                                | Download CTA; `placement`                                                               |
| `offer_popup_view`                                        | Launch offer opens when Quick Ring enters view; `placement: offer_popup`                |
| `offer_popup_dismiss`                                     | Offer closes; `placement: offer_popup`, `reason: close / later / escape / backdrop`     |
| `checkout`                                                | Pro checkout; `placement`                                                               |
| `nav_click`                                               | Internal links, catalog, breadcrumbs, related tools/guides; `placement`, `target`       |
| `permissions_click`                                       | Link to Install permissions; `placement`, `target`                                      |
| `support_click`                                           | Email link; `placement`, `target: email`                                                |
| `external_link`                                           | External/GitHub/release link; `placement`, `target`                                     |
| `language_change`                                         | Locale selection; `from`, `to`, `placement`                                             |
| `menu_open`                                               | Open Features, mobile navigation or language menu; `menu`                               |
| `utilities_toggle`                                        | Expand/collapse Home utilities; `state`, `placement`                                    |
| `section_view`                                            | Visible height reaches 15% of the smaller of section/viewport; `section`; once per page |
| `demo_view`                                               | Demo reaches 50% visibility, including reduced-motion poster; `demo`, `placement`       |
| `demo_play`                                               | First actual video playback; `demo`, `placement`                                        |
| `demo_error`                                              | Final video source fails; `demo`, `placement`                                           |
| `faq_open`                                                | Open FAQ/troubleshooting answer; `faq`, `group`                                         |
| `install_copy` / `install_copy_error`                     | Copy SHA command succeeds/fails                                                         |
| `feedback_start`                                          | First form focus                                                                        |
| `feedback_kind_change`                                    | Change type; `kind`                                                                     |
| `feedback_attachment_add` / `feedback_attachment_remove`  | Add/remove validated image; no file data                                                |
| `feedback_validation_error`                               | Invalid input; `field`, `reason`                                                        |
| `feedback_submit` / `feedback_success` / `feedback_error` | Submission lifecycle; `kind`                                                            |
| `feedback_reset`                                          | Send another response                                                                   |

Demo signals are once per mounted demo, never once per video loop. Click capture
runs before React changes download URLs or closes menus and does not prevent
navigation. Pending events wait in memory for at most 30 seconds (100 events max)
when the script loads late; they are discarded if blocked. The queue does not
persist across a full page unload. Analytics errors never block website actions.

Browser checks use a mock tracker and mock feedback endpoint; they never submit
to production. Validate real event ingestion on the production Umami dashboard
after deployment.
