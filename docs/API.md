# Mindseye2 API Documentation

## Authentication

### Todoist API Key
To use this application, you'll need a Todoist API key. Here's how to get one:

1. Log in to your Todoist account
2. Go to Settings → Integrations
3. Copy your API token
4. Never share your API token or commit it to version control

## API Endpoints Used

### Favorites
```
GET https://api.todoist.com/rest/v2/favorites
Header: Authorization: Bearer YOUR_API_KEY
```

### Filters
```
GET https://api.todoist.com/rest/v2/filters
Header: Authorization: Bearer YOUR_API_KEY
```

## Error Handling

The application handles several types of errors:

- Invalid API key (401)
- Network errors
- Server errors
- Rate limiting

All errors are displayed to the user with friendly messages and appropriate actions.

## Image Generation

The image generation feature uses AI to create visual representations of tasks. Images are generated based on:

1. Task name
2. Task description
3. Task labels
4. Filter criteria