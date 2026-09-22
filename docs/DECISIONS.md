# Technical Decisions

## 1. React Native CLI with TypeScript

The project uses React Native CLI with TypeScript instead of Expo. This gives the project direct control over native Android configuration and makes it suitable for an assignment that evaluates native persistence, file access, and mobile runtime behavior.

TypeScript provides compile-time checks for API models, navigation parameters, Redux state, and component props.

## 2. Redux Toolkit and RTK Query

Redux Toolkit was selected for predictable global state management and reduced Redux boilerplate. The application uses:

- Redux slices for app settings, synchronization state, and cached entities.
- `createEntityAdapter` for normalized breed and group collections.
- RTK Query for API endpoint definitions, request lifecycle handling, caching, and endpoint dispatching.
- RTK Query retry support with a maximum of three retries.

The normalized cache prevents the UI from depending on deeply nested, duplicated arrays and makes updates to an individual breed straightforward.

## 3. SQLite for Local Persistence

SQLite was selected because the application needs to retain a complete local dataset and support offline access after the first successful synchronization. The schema uses separate tables for breeds, groups, and metadata.

The full API payload is serialized into a JSON column. This approach preserves nested API data such as traits, relationships, origin information, and image data without requiring a large number of relational tables for the assignment.

## 4. Offline-First Bootstrap

The bootstrap process hydrates local data before starting background synchronization. This means the application can become interactive using cached data rather than blocking the initial UI on a network request.

When the network is unavailable, the sync service reports that cached data is available. When connectivity returns, NetInfo triggers a background synchronization.

## 5. Partial Failure Handling

The synchronization service uses `Promise.allSettled` for the additional breed pages. This allows successful pages to be merged even if one or more pages fail. The user can continue using the available cached data while the sync state communicates the partial failure.

## 6. Retry and Timeout Strategy

The API layer uses a 10-second timeout and RTK Query's retry wrapper with up to three retries. This helps handle temporary network instability without requiring the user to manually repeat every request.

## 7. Image Caching

Images are cached in the React Native file-system cache directory. The implementation uses a generated filename based on the source URL and enforces a maximum cache size of 50 MB by deleting older files when the limit is exceeded.

The cache returns a local `file://` URI when an image is already available and falls back to the remote URL if downloading fails.

## 8. Search and Filtering

Search input is debounced by 300 milliseconds to avoid recalculating the filtered list on every keystroke. Filtering is performed in memory against the normalized breed collection and supports breed name, alternate names, group, size band, coat length, hypoallergenic status, and trait thresholds.

## 9. Scope and Trade-offs

The application prioritizes reliable offline access and clear separation between API, persistence, state, and presentation. Storing complete API payloads as JSON is simple and resilient to nested source data, but it is less query-efficient than fully normalized relational columns. For the assignment's dataset size, this trade-off keeps the implementation maintainable while preserving the source response.
