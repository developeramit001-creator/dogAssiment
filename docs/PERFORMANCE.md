# Performance Report — TripareAI (Dog Breed Explorer)

## 1. Overview

This report summarizes the performance checks completed for the TripareAI React Native application using the available Android build logs and the screen recording of the breed list screen.

The report separates **observed values** from values that still require controlled measurement.

---

## 2. Test Environment

| Item | Result |
|---|---|
| Platform | Android |
| Build type | Debug |
| Application | TripareAI |
| Test device type | Physical Android devices |
| Devices detected | 2 |
| Metro port during launch | 8082 |
| Android build | Successful |
| APK installation | Successful |
| App launch | Successful |

The Android build completed successfully and the application was installed and launched on two connected Android devices.

---

## 3. Cached / Offline Initial Load

| Metric | Observation |
|---|---|
| Test condition | Offline mode with previously cached breed data |
| Screen tested | Breed list screen |
| Approximate time | Around 3 seconds |
| Measurement status | Manual observation / estimate |
| Interpretation | Cached local data was displayed without requiring a fresh network response |

**Note:** This result represents the time required to display previously cached data in offline mode. It should not be presented as the time required for a complete fresh API sync.

Suggested formal wording:

> The breed list screen displayed previously cached data in approximately 3 seconds while the application was in offline mode. This was a manual observation and was not measured using an automated performance tool.

---

## 4. Breed List Scrolling Performance

### Test Performed

- Opened the breed list screen.
- Enabled React Native's Performance Monitor.
- Recorded the screen while scrolling the breed list.
- Observed the FPS overlay during scrolling.

### Observed Result

| Metric | Observed value | Status |
|---|---:|---|
| UI FPS | Approximately 11.8 FPS at one observed point | Needs controlled validation |
| Dropped frames | Approximately 411 at one observed point | Needs controlled validation |
| Scrolling smoothness | Requires further validation without recording | Not final |

### Interpretation

The screen recording showed a temporary low FPS reading and a high dropped-frame count. However, screen recording and the Performance Monitor overlay can add extra workload. Therefore, these values should be treated as **diagnostic observations**, not as the final production performance result.

A controlled test should be performed without screen recording, preferably by observing the monitor directly and repeating the scroll test several times.

---

## 5. Performance Test Status

| Performance area | Result | Status |
|---|---|---|
| Android build | Successful | Verified |
| APK installation | Successful on 2 devices | Verified |
| App launch | Successful | Verified |
| Offline cached list load | Approximately 3 seconds | Manual observation |
| Fresh network initial load | Not measured | Pending |
| List scrolling FPS | Approximately 11.8 FPS observed once | Needs controlled validation |
| Dropped frames | Approximately 411 observed once | Needs controlled validation |
| Memory usage | Not recorded | Pending |
| JavaScript bundle size | Not recorded | Pending |
| APK size | Not recorded | Pending |
| API pagination performance | Not measured | Pending |

---

## 6. Implementation / Performance Considerations

The following areas should be reviewed during final performance validation:

- Use list-based rendering such as `FlatList` for breed data.
- Avoid unnecessary re-renders while scrolling.
- Use stable keys for list items.
- Avoid loading large images without appropriate sizing or caching.
- Verify that API pagination does not block the initial screen.
- Keep cached data visible while fresh data is being synchronized.
- Test both offline cached loading and fresh online loading separately.

Only measurements that are actually recorded should be added as final numeric results.

---

## 7. Recommended Final Validation

Before submitting the final performance report:

1. Disable screen recording.
2. Keep the Performance Monitor visible.
3. Scroll the breed list for 10–15 seconds.
4. Repeat the test at least three times.
5. Record the approximate UI FPS and whether visible lag occurs.
6. Record memory usage separately.
7. Measure fresh online loading separately from cached offline loading.

---

## 8. Conclusion

The Android debug build was successfully built, installed, and launched on two devices. The offline cached breed list was observed to appear in approximately 3 seconds. During the recorded scrolling test, a low UI FPS value of approximately 11.8 FPS and approximately 411 dropped frames were observed at one point.

Because the scrolling result was collected during screen recording and with the Performance Monitor overlay enabled, it requires controlled re-testing before being treated as a final performance benchmark.
