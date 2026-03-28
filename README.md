# MivaX SDK

A comprehensive Node.js & Browser SDK for the MivaX API. Connect your applications to the Miva Open University ecosystem with ease. This SDK provides a unified, type-safe interface for interacting with the MivaX SIS, LMS, and Student Dashboard endpoints.

## Table of Contents

- [MivaX SDK](#mivax-sdk)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Initialization](#initialization)
    - [Authentication](#authentication)
  - [API Reference](#api-reference)
    - [Student (SIS) Methods](#student-sis-methods)
    - [LMS Methods](#lms-methods)
  - [Error Handling](#error-handling)
  - [TypeScript Support](#typescript-support)
  - [Related Links](#related-links)
  - [License](#license)

## Installation

```bash
npm install mivax-sdk
# or
yarn add mivax-sdk
# or
pnpm add mivax-sdk
```

## Features

- **Cross-Platform**: Works smoothly in both Node.js and the browser.
- **Type-Safe**: Full TypeScript support with detailed types and interfaces.
- **Authentication**: Easy session management and login handling.
- **Comprehensive Coverage**: SIS (Student Information System), LMS (Learning Management System), and Student Dashboard support.
- **Pagination & Error Handling**: Built-in support for paginated endpoints and standardized error throwing.

## Getting Started

### Initialization

```typescript
import { MivaX } from "mivax-sdk";

// Initialize the client. Base URL defaults to https://mivax.marvelly.com.ng if not provided.
const mivax = new MivaX({
  baseUrl: "https://mivax.marvelly.com.ng",
});
```

### Authentication

Most methods require an active session ID. You can either log in using your credentials to obtain a new session or set an existing session ID directly.

```typescript
// Option 1: Login to get a new session ID
try {
  const loginRes = await mivax.login("your.email@miva.edu.ng", "your_password");
  console.log("Logged In Session ID:", mivax.getSessionId());
} catch (error) {
  console.error("Login failed:", error.message);
}

// Option 2: Set an existing session ID manually
mivax.setSessionId("your_existing_session_id");
```

## API Reference

Except for `login()`, all methods require an active session. If no `sessionId` is passed as an optional parameter, the SDK will automatically use the stored session ID from `login()` or `setSessionId()`.

### Student (SIS) Methods

#### `getUserProfile(sessionId?: string): Promise<UserProfile>`

Fetch the basic student profile from the SIS.

```typescript
const profile = await mivax.getUserProfile();
console.log(`Welcome, ${profile.first_name}`);
```

#### `getAcademicSummary(sessionId?: string): Promise<AcademicSummary>`

Get overall CGPA and degree status.

```typescript
const summary = await mivax.getAcademicSummary();
console.log(`Current CGPA: ${summary.cgpa}`);
```

#### `getAcademicLevels(sessionId?: string): Promise<AcademicLevel[]>`

List all study years (100L, 200L, etc.) along with their completion summaries.

#### `getFullTranscript(sessionId?: string): Promise<Transcript>`

Returns results for all academic levels at once.

#### `getTranscriptByLevel(level: string, sessionId?: string): Promise<Transcript>`

Get detailed results and GPA for a specific academic level (e.g., `200_LEVEL`).

#### `getCurrentCourses(sessionId?: string): Promise<Course[]>`

List courses currently being taken in the active semester.

#### `getRegistrationStatus(sessionId?: string): Promise<RegistrationStatus>`

Check enrollment windows and pending registration status.

#### `getPaymentRecords(page?: number, perPage?: number, sessionId?: string): Promise<PaginatedResponse<PaymentRecord>>`

Get payment records with pagination support. Defaults to page 1, 10 records per page.

```typescript
const payments = await mivax.getPaymentRecords(1, 10);
console.log(payments.data);
```

#### `getNotifications(page?: number, perPage?: number, sessionId?: string): Promise<PaginatedResponse<Notification>>`

Get notifications with pagination. Defaults to page 1, 5 records per page.

#### `getFullDashboard(sessionId?: string): Promise<any>`

Fetch the entire SIS dashboard JSON data. Use with caution as this can be a heavy payload.

### LMS Methods

#### `getLmsCourses(sessionId?: string): Promise<Course[]>`

List all LMS courses available for the student.

```typescript
const lmsCourses = await mivax.getLmsCourses();
console.log(lmsCourses);
```

#### `getCourseContent(courseId: string | number, sessionId?: string): Promise<any>`

Get detailed content mapped to a specific course.

#### `getModuleDetail(modType: string, modId: string | number, sessionId?: string): Promise<ModuleDetail>`

Get in-depth details of a specific module within a course.

```typescript
const moduleDetail = await mivax.getModuleDetail("page", "12345");
```

#### `getProxyImageUrl(encodedUrl: string, sessionId?: string): Promise<string>`

Proxies an image URL and returns the full URL configured through MivaX.

```typescript
const imageUrl = await mivax.getProxyImageUrl("encoded_url_string");
console.log(imageUrl); // https://mivax.marvelly.com.ng/img/...
```

## Error Handling

The SDK performs standard error checking. If an HTTP error occurs, it maps the API response to an informative Error instance.

```typescript
try {
  await mivax.login("wrong@email.com", "bad_pass");
} catch (error) {
  // error.message will contain the specific status and JSON failure details from the backend
  console.error(error.message);
}
```

## TypeScript Support

The SDK is written purely in TypeScript to provide excellent auto-completion and compile-time type checking. You can import types directly if needed:

```typescript
import { MivaX, UserProfile, Course, AcademicSummary } from "mivax-sdk";
```

## Related Links

- [MivaX](https://mivax.vercel.app)
- [MivaX API](https://mivax.marvelly.com.ng/)
- [Postman API](https://documenter.getpostman.com/view/44188441/2sBXikpXNJ)

## License

MIT
