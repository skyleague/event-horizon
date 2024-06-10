import { expect, it } from 'vitest'
import { eventEntries } from './publish.js'

it('should publish event to eventbridge', () => {
    expect(
        eventEntries({
            eventBusName: 'test-bus',
            source: 'foo',
            events: [
                {
                    'detail-type': 'test-detail-type',
                    detail: { test: 'test' },
                },
            ],
        }),
    ).toMatchInlineSnapshot(`
      {
        "Entries": [
          {
            "Detail": "{"test":"test"}",
            "DetailType": "test-detail-type",
            "EventBusName": "test-bus",
            "Source": "foo",
          },
        ],
      }
    `)
    expect(
        eventEntries({
            eventBusName: 'test-bus',
            events: [
                {
                    'detail-type': 'test-detail-type',
                    detail: { test: 'test' },
                    source: 'foo',
                },
            ],
        }),
    ).toMatchInlineSnapshot(`
      {
        "Entries": [
          {
            "Detail": "{"test":"test"}",
            "DetailType": "test-detail-type",
            "EventBusName": "test-bus",
            "Source": "foo",
          },
        ],
      }
    `)
    expect(
        eventEntries({
            events: [
                {
                    'detail-type': 'test-detail-type',
                    detail: { test: 'test' },
                    eventBusName: 'test-bus',
                    source: 'foo',
                },
            ],
        }),
    ).toMatchInlineSnapshot(`
      {
        "Entries": [
          {
            "Detail": "{"test":"test"}",
            "DetailType": "test-detail-type",
            "EventBusName": "test-bus",
            "Source": "foo",
          },
        ],
      }
    `)
})
