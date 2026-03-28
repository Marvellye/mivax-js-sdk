# MivaX SDK

A comprehensive Node.js & Browser SDK for the MivaX API. Connect your applications to the Miva Open University ecosystem with ease.

## Installation

```bash
npm install mivax-sdk
# or
yarn add mivax-sdk
```

## Features

- **Cross-Platform**: Works in both Node.js and the browser.
- **Type-Safe**: Full TypeScript support with detailed types and interfaces.
- **Authentication**: Easy session management and login handling.
- **Comprehensive coverage**: SIS, LMS, and Student Dashboard support.

## Usage

### Simple Initialization

```typescript
import { MivaX } from 'mivax-sdk';

const mivax = new MivaX({
  baseUrl: 'https://mivax.marvelly.com.ng' // (optional, defaults to this)
});
```

### Authentication

```typescript
// Login to get a session ID
const loginRes = await mivax.login('your.email@miva.edu.ng', 'your_password');
console.log('LoggedIn Session:', mivax.getSessionId());

// Or set an existing session ID manually
mivax.setSessionId('your_existing_session_id');
```

### Student Profile & Academics (SIS)

```typescript
// Get User Profile
const profile = await mivax.getUserProfile();
console.log(`Welcome, ${profile.first_name}`);

// Academic summary (CGPA, etc)
const summary = await mivax.getAcademicSummary();
console.log(`Current CGPA: ${summary.cgpa}`);

// Get results for specific level
const results = await mivax.getTranscriptByLevel('200_LEVEL');

// List current courses
const currentCourses = await mivax.getCurrentCourses();
```

### LMS & Course Content

```typescript
// List courses from the LMS
const courses = await mivax.getLmsCourses();

// Get content for a specific course
const content = await mivax.getCourseContent('course_id_here');

// Get module specific details
const mod = await mivax.getModuleDetail('page', 'module_id_here');
```

### Dashboards & Payments

```typescript
// Fetch recent payment records
const payments = await mivax.getPaymentRecords(1, 10);

// Get recent notifications
const notifications = await mivax.getNotifications();
```

## Related Links

- [Official MivaX API Base](https://mivax.marvelly.com.ng/)

## License

MIT
