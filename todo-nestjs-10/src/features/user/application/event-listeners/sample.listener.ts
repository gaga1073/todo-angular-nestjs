import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SampleEvent } from '@/features/user/domain/events/sample.envet';

@EventsHandler(SampleEvent)
export class SampleListener implements IEventHandler<SampleEvent> {
  handle(event: SampleEvent): void {
    console.log(event.name);
    console.log('イベント実装');
  }
}
