# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory.spec.ts >> Invecho E2E Journeys >> Successful PSTN Webhook Journey
- Location: tests\inventory.spec.ts:15:7

# Error details

```
AggregateError: connect ECONNREFUSED ::1:3000; connect ECONNREFUSED 127.0.0.1:3000
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import axios from 'axios';
  3   | 
  4   | const BACKEND_URL = 'http://localhost:3000';
  5   | const FRONTEND_URL = 'http://localhost:4200';
  6   | 
  7   | // Helper to get products from backend
  8   | async function getProducts() {
> 9   |   const response = await axios.get(`${BACKEND_URL}/inventory`);
      |                    ^ AggregateError: connect ECONNREFUSED ::1:3000; connect ECONNREFUSED 127.0.0.1:3000
  10  |   return response.data;
  11  | }
  12  | 
  13  | test.describe('Invecho E2E Journeys', () => {
  14  |   
  15  |   test('Successful PSTN Webhook Journey', async ({ page }) => {
  16  |     test.info().annotations.push({ type: 'testCaseId', description: 'TC-001' });
  17  |     test.info().annotations.push({ type: 'featureName', description: 'Webhook Inventory Sync' });
  18  |     
  19  |     const restockAmount = 50;
  20  |     const payload = {
  21  |       callId: 'call-12345',
  22  |       productId: 'dummy-id',
  23  |       status: 'success',
  24  |       restockAmount: restockAmount
  25  |     };
  26  | 
  27  |     test.info().annotations.push({ 
  28  |       type: 'inputData', 
  29  |       description: JSON.stringify(payload, null, 2) 
  30  |     });
  31  |     test.info().annotations.push({ 
  32  |       type: 'expectedOutcome', 
  33  |       description: `Product stock should increase by ${restockAmount}. UI should display updated stock.` 
  34  |     });
  35  | 
  36  |     // 1. Get initial inventory
  37  |     const products = await getProducts();
  38  |     const targetProduct = products[0]; // Assuming there is at least one product
  39  |     expect(targetProduct).toBeDefined();
  40  | 
  41  |     const initialStock = targetProduct.stock;
  42  |     payload.productId = targetProduct.id;
  43  | 
  44  |     // 2. Simulate Webhook
  45  |     const webhookRes = await axios.post(`${BACKEND_URL}/webhook/calle`, payload);
  46  |     expect(webhookRes.status).toBe(201); // NestJS default for POST is 201
  47  | 
  48  |     // 3. Verify Database Mutation
  49  |     const updatedProducts = await getProducts();
  50  |     const updatedProduct = updatedProducts.find((p: any) => p.id === targetProduct.id);
  51  |     
  52  |     expect(updatedProduct.stock).toBe(initialStock + restockAmount);
  53  | 
  54  |     test.info().annotations.push({ 
  55  |       type: 'actualOutput', 
  56  |       description: `Backend verified: Product stock changed from ${initialStock} to ${updatedProduct.stock}.` 
  57  |     });
  58  |     test.info().annotations.push({ 
  59  |       type: 'eventTraceLogs', 
  60  |       description: `Webhook received 201 Created.\nDB Verification: Stock is ${updatedProduct.stock}` 
  61  |     });
  62  | 
  63  |     // 4. Verify UI Updates
  64  |     try {
  65  |       await page.goto(FRONTEND_URL);
  66  |     } catch (e) {
  67  |       console.log('UI Verification skipped or failed (ensure frontend is running)', e.message);
  68  |     }
  69  |   });
  70  | 
  71  |   test('Failed Phone Call Resilience', async () => {
  72  |     test.info().annotations.push({ type: 'testCaseId', description: 'TC-002' });
  73  |     test.info().annotations.push({ type: 'featureName', description: 'Call Failure Handling' });
  74  | 
  75  |     const payload = {
  76  |       callId: 'call-failed-123',
  77  |       productId: 'dummy-id',
  78  |       status: 'failed',
  79  |       restockAmount: 0
  80  |     };
  81  | 
  82  |     test.info().annotations.push({ type: 'inputData', description: JSON.stringify(payload, null, 2) });
  83  |     test.info().annotations.push({ type: 'expectedOutcome', description: 'System should accept the webhook but not change stock' });
  84  | 
  85  |     const products = await getProducts();
  86  |     const targetProduct = products[0];
  87  |     const initialStock = targetProduct?.stock || 0;
  88  | 
  89  |     payload.productId = targetProduct?.id || 'dummy-id';
  90  | 
  91  |     const webhookRes = await axios.post(`${BACKEND_URL}/webhook/calle`, payload);
  92  |     expect(webhookRes.status).toBe(201);
  93  | 
  94  |     const updatedProducts = await getProducts();
  95  |     const updatedProduct = updatedProducts.find((p: any) => p.id === targetProduct?.id);
  96  |     
  97  |     expect(updatedProduct?.stock).toBe(initialStock);
  98  | 
  99  |     test.info().annotations.push({ type: 'actualOutput', description: 'Stock remained unchanged.' });
  100 |     test.info().annotations.push({ type: 'eventTraceLogs', description: 'Call status failed.' });
  101 |   });
  102 | 
  103 |   test('Invalid Webhook Signature', async () => {
  104 |     test.info().annotations.push({ type: 'testCaseId', description: 'TC-003' });
  105 |     test.info().annotations.push({ type: 'featureName', description: 'Webhook Security' });
  106 | 
  107 |     test.info().annotations.push({ type: 'inputData', description: 'Payload with invalid or missing signature' });
  108 |     test.info().annotations.push({ type: 'expectedOutcome', description: 'Should reject with 401 Unauthorized (Skipped/To Be Implemented)' });
  109 | 
```