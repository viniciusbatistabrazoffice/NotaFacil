# Async Error Handling Fix

## Problem
When creating an account, users were receiving a generic error message: "Erro inesperado. Tente novamente." (Unexpected error. Try again.)

## Root Cause
The Express.js route handlers were async functions that threw errors, but these errors were not being caught by the error handler middleware. In Express, when an async function throws an error, it returns a rejected promise. If this promise is not explicitly handled (via `.catch()` or `try/catch`), the error is not passed to the error handler middleware.

The error handler middleware in `src/middlewares/error-handler.ts` was properly configured to translate error messages to Portuguese and set appropriate HTTP status codes, but it was never receiving the errors from async route handlers.

## Solution
Created an `asyncHandler` utility function that wraps async route handlers and ensures any thrown errors are properly passed to the error handler middleware.

### Files Created
- `src/utils/async-handler.ts` - Utility function to wrap async route handlers

### Files Modified
All route files were updated to wrap their async handlers:
- `src/routes/auth.routes.ts`
- `src/routes/user.routes.ts`
- `src/routes/order.routes.ts`
- `src/routes/product.routes.ts`
- `src/routes/financial.routes.ts`
- `src/routes/supplier.routes.ts`
- `src/routes/supply.routes.ts`
- `src/routes/client.routes.ts`
- `src/routes/production.routes.ts`
- `src/routes/invoice.routes.ts`
- `src/routes/cash.routes.ts`
- `src/routes/sale.routes.ts`
- `src/routes/payment.routes.ts`

## How It Works
The `asyncHandler` wrapper:
1. Takes an async route handler function
2. Returns a new function that Express can call
3. Wraps the async function execution in `Promise.resolve()` and catches any errors
4. Passes caught errors to the Express error handler via `next(error)`

Example:
```typescript
// Before
authRoutes.post('/register', authController.register);

// After
authRoutes.post('/register', asyncHandler((req, res) => authController.register(req, res)));
```

## Result
Now when account creation fails:
1. The error thrown by `authService.register()` is caught by the asyncHandler
2. The error is passed to the error handler middleware
3. The error message is translated to Portuguese (if a translation exists)
4. The appropriate HTTP status code is set
5. The user receives a meaningful error message instead of a generic one

For example:
- "Email already in use" → "Este e-mail já está em uso." (409 Conflict)
- "Company name, name, email and password are required" → Returns 400 Bad Request
- Any other error → "Erro interno do servidor. Tente novamente." (500 Internal Server Error)
