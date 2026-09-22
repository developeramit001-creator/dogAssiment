# Performance Report

## Measurement Status

This document describes the performance checks that should be recorded before final submission. Numeric values and screenshots must be filled with measurements taken from the target Android/iOS device or emulator; this repository archive did not include profiler exports or bundle-analysis output, so no measurements are invented here.

## Performance Targets

| Metric              |         Target from assignment | Result                             |
| ------------------- | -----------------------------: | ---------------------------------- |
| Cached initial load | Under 3 seconds to interactive | Measure on target device           |
| List scrolling      |               Sustained 60 FPS | Measure during full-list scrolling |
| Memory              |  Under 150 MB under normal use | Capture profiler measurement       |
| Breed dataset       |      Approximately 283 records | Verify after complete sync         |
| API pagination      |            48 records per page | Verify from API response           |

## Recommended Test Procedure

### 1. Full Dataset Load

1. Clear the app's local data.
2. Launch the app with a stable network connection.
3. Record the time from launch until the list becomes interactive.
4. Confirm that all available API pages are merged.
5. Record the final cached breed count and last-sync timestamp.

### 2. Scroll FPS

1. Open the full breed list after synchronization.
2. Scroll from the top to the bottom several times.
3. Record average FPS and any visible dropped frames using the native profiler or Flipper-compatible tooling available in the development environment.
4. Repeat while thumbnails are visible.

### 3. Memory Usage

1. Start a fresh app session.
2. Capture baseline memory.
3. Load the complete breed list.
4. Scroll through the list and open several detail/gallery screens.
5. Record peak memory and attach a screenshot.

### 4. Bundle Analysis

Record the release bundle size generated for the target platform. Include:

- JavaScript bundle size.
- Asset size, including onboarding images.
- Android APK/AAB size if available.
- Build mode and command used.

## Results to Add Before Submission

> Replace the following placeholders with real measurements and screenshots.

- **Initial load:** `[record measured time]`
- **List FPS:** `[record average/minimum FPS]`
- **Peak memory:** `[record MB]`
- **Bundle size:** `[record JS bundle and APK/AAB size]`
- **Synced breeds:** `[record actual count]`

## Implementation Notes

- The home screen uses a list-based rendering approach for the breed collection.
- Search is debounced by 300 ms.
- The cache is normalized through Redux Toolkit entity adapters.
- API pages after the first page are fetched concurrently.
- Images use a local cache with a maximum size of 50 MB.
- Existing data remains visible during later synchronization instead of replacing the entire screen with a blocking loader.
