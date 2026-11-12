# Tracking — vibingwrapper.com

How we measure whether the site (and the posts pointing at it) bring people to download VibingWrapper.

## 1. Google Analytics 4 (the site)

- Code: [`analytics.js`](analytics.js), loaded from `<head>` in `index.html`.
- Measurement ID `G-Z2ST7Z1WKJ` (GA account "VibingWrapper", property + web stream "vibingwrapper.com") lives in `GA_ID` at the top of `analytics.js`. Empty = tracking off.
- Only reports on `vibingwrapper.com` / `www.vibingwrapper.com`. Local previews (`localhost`, `file://`) send nothing, so testing doesn't pollute the numbers.
- GA4 default "enhanced measurement" (page views, scrolls, outbound clicks) stays on; the custom events below add the detail we care about.

### Custom events

| Event | When | Params |
|---|---|---|
| `download_click` | any link to `/releases/latest` | `link_location` (`hero` / `install` / `final` …), `page_lang` |
| `github_click` | other links to the GitHub repo | `link_location`, `link_url` |
| `feedback_click` | link to GitHub issues | `link_location` |
| `social_click` | YouTube / Threads links | `link_location`, `link_url` |
| `copy_install_prompt` | "Copy" on the AI install prompt | `page_lang` |
| `lang_switch` | EN / 中文 toggle | `page_lang` (the one chosen) |
| `section_view` | first time a section is 40% on screen | `section_id` (`states`, `weather`, `monster`, `themes`, `how`, `install`) |

`link_location` is worked out from the nearest `<nav>` / `<header>` / `<section id>` / `<footer>`, so new links are covered without extra markup.

### One-time GA setup

- [x] Account `VibingWrapper` (416031116) → property `vibingwrapper.com` (563968654) → web stream, created 2026-11-12. Taiwan time zone, TWD.
- [x] **Admin → Custom definitions**: event-scoped dimensions `Section` (`section_id`), `Link location` (`link_location`), `Page language` (`page_lang`).
- [x] **Key events**: `download_click`, `copy_install_prompt` (2026-11-12). New events don't show in Admin → Events → Recent events for ~24 h, so they were added via **Create event → Create with code**, with "Mark as key event" on. Same trick for any future key event.

Reports: https://analytics.google.com/analytics/web/#/a416031116p563968654/reports/intelligenthome

### Where to look

- **Reports → Acquisition → Traffic acquisition**: which source brought visitors (threads / youtube / reddit …).
- **Reports → Engagement → Events**: counts of the events above.
- **Explore → Funnel**: `page_view` → `section_view(install)` → `download_click`.
- **Realtime**: open the site yourself to check events fire (use DebugView with the GA Debugger extension for detail).

## 2. UTM tags on every link we post

GA reads `utm_*` automatically. Use this pattern so posts are comparable:

```
https://vibingwrapper.com/?utm_source=<platform>&utm_medium=social&utm_campaign=<campaign>&utm_content=<post-id>
```

| | Values |
|---|---|
| `utm_source` | `threads`, `x`, `youtube`, `reddit`, `instagram`, `github` |
| `utm_medium` | `social` for posts, `video` for YouTube descriptions, `referral` for READMEs / other sites |
| `utm_campaign` | short slug of the push, e.g. `launch-2026-11`, `sea-monster-2` |
| `utm_content` | which post / variant, e.g. `drawbook-ep6`, `deskland-reply` |

Add `&lang=zh` when the audience is Chinese-speaking, so the page opens in 中文.

## 3. Downloads on GitHub (ground truth)

GA only sees clicks on "Download"; GitHub counts the actual zip downloads:

```bash
gh api repos/youllook/VibingWrapper/releases --jq '.[] | "\(.tag_name)\t" + ([.assets[].download_count] | add | tostring)'
```

Repo traffic (views, clones, referrers, last 14 days — needs push access):

```bash
gh api repos/youllook/VibingWrapper/traffic/views --jq '.count, .uniques'
gh api repos/youllook/VibingWrapper/traffic/popular/referrers
```

Comparing `download_click` (GA) with release `download_count` (GitHub) shows how many downloads come from the site vs. elsewhere.
