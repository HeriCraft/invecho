import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AgentDispatchedEvent } from '../src/agent/domain/events/agent-dispatched.event';

describe('Inventory Flow (e2e)', () => {
  let app: INestApplication;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    eventEmitter = app.get(EventEmitter2);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should trigger low stock check, dispatch agent, and process webhook', async () => {
    // 1. Initial stock
    const res = await request(app.getHttpServer()).get('/inventory');
    expect(res.status).toBe(200);
    const p2 = res.body.find(p => p.id === 'p2');
    expect(p2.stock).toBe(5); // low stock

    // Setup listener for agent dispatched
    let dispatchedCallId = null;
    eventEmitter.on('agent.dispatched', (event: AgentDispatchedEvent) => {
      if (event.productId === 'p2') {
        dispatchedCallId = event.callId;
      }
    });

    // 2. Trigger check
    await request(app.getHttpServer())
      .post('/inventory/p2/check')
      .expect(201);
    
    // Wait for async dispatch
    await new Promise(resolve => setTimeout(resolve, 600));
    
    expect(dispatchedCallId).toBeTruthy();

    // 3. Webhook postback
    await request(app.getHttpServer())
      .post('/webhook/calle')
      .send({
        callId: dispatchedCallId,
        productId: 'p2',
        status: 'success',
        restockAmount: 20
      })
      .expect(201);

    // Wait for sync
    await new Promise(resolve => setTimeout(resolve, 100));

    // 4. Verify new stock
    const res2 = await request(app.getHttpServer()).get('/inventory');
    const p2Updated = res2.body.find(p => p.id === 'p2');
    expect(p2Updated.stock).toBe(25); // 5 + 20
  });
});
