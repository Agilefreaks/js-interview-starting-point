# Coffee Shop Finder

## Overview

This application finds the three closest coffee shops to a user's location. It fetches coffee shop data from an API, calculates distances on a flat plane, and returns the three closest shops sorted by distance.

## Usage

Run the application with:

```bash
yarn start <x-coordinate> <y-coordinate>
```

Example:

```bash
yarn start 47.6 -122.4
```

Output format:

```
Starbucks Seattle2, 0.0645
Starbucks Seattle, 0.0861
Starbucks SF, 10.0793
```

Each distance is rounded to exactly four decimal places.

### Core Components

-   **API Module (`api.js`)**: Handles communication with the coffee shop API, including token management, retry logic, and error handling
-   **Application Logic (`app.js`)**: Processes user coordinates and calculates distances to each coffee shop
-   **Utilities (`utils.js`)**: Contains helper functions for distance calculation, input validation, and result sorting
